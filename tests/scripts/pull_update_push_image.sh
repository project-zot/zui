#!/bin/bash

registry=""
image=""
tag=""
cosign_password=""
metafile=""
multiarch=""
username=""
password=""
debug=0
data_dir=$(pwd)

while (( "$#" )); do
    case $1 in
        -r|--registry)
            if [ -z "$2" ]; then
                echo "Option registry requires an argument"
                exit 1
            fi
            registry=$2;
            shift 2
            ;;
        -i|--image)
            if [ -z "$2" ]; then
                echo "Option image requires an argument"
                exit 1
            fi
            image=$2
            shift 2
            ;;
        -t|--tag)
            if [ -z "$2" ]; then
                echo "Option tag requires an argument"
                exit 1
            fi
            tag=$2
            shift 2
            ;;
        -u|--username)
            if [ -z "$2" ]; then
                echo "Option username requires an argument"
                exit 1
            fi
            username=$2
            shift 2
            ;;
        -p|--password)
            if [ -z "$2" ]; then
                echo "Option password requires an argument"
                exit 1
            fi
            password=$2
            shift 2
            ;;
        -c|--cosign-password)
            if [ -z "$2" ]; then
                echo "Option cosign-password requires an argument"
                exit 1
            fi
            cosign_password=$2
            shift 2
            ;;
        -m|--multiarch)
            if [ -z "$2" ]; then
                echo "Option multiarch requires an argument"
                exit 1
            fi
            multiarch=$2
            shift 2
            ;;
        -f|--file)
            if [ -z "$2" ]; then
                echo "Option metafile requires an argument"
                exit 1
            fi
            metafile=$2
            shift 2
            ;;
        --data-dir)
            if [ -z "$2" ]; then
                echo "Option data-dir requires an argument"
                exit 1
            fi
            data_dir=$2
            shift 2
            ;;
        -d|--debug)
            debug=1
            shift 1
            ;;
        --)
            shift 1
            break
            ;;
        *)
            break
            ;;
    esac
done

if [ ${debug} -eq 1 ]; then
    set -x
fi

images_dir=${data_dir}/images
docker_docs_dir=${data_dir}/docs
cosign_key_path=${data_dir}/cosign.key

function verify_prerequisites {
    mkdir -p ${data_dir}

    command -v regctl
    if [ $? -ne 0 ]; then
        echo "you need to install regctl as a prerequisite"
        exit 1
    fi

    command -v skopeo
    if [ $? -ne 0 ]; then
        echo "you need to install skopeo as a prerequisite"
        exit 1
    fi

    command -v cosign
    if [ $? -ne 0 ]; then
        echo "you need to install cosign as a prerequisite"
        return 1
    fi

    command -v trivy
    if [ $? -ne 0 ]; then
        echo "you need to install trivy as a prerequisite"
        return 1
    fi

    command -v jq
    if [ $? -ne 0 ]; then
        echo "you need to install jq as a prerequisite"
        return 1
    fi

    if [ ! -f "${cosign_key_path}" ]; then
        COSIGN_PASSWORD=${cosign_password} cosign generate-key-pair
        key_dir=$(dirname ${cosign_key_path})
        mv cosign.key ${cosign_key_path}
        mv cosign.pub ${key_dir}
    fi

    # pull docker docs repo
    if [ ! -d ${docker_docs_dir} ]
    then
        git clone https://github.com/docker-library/docs.git ${docker_docs_dir}
    fi

    return 0
}

verify_prerequisites

repo=$(cat ${docker_docs_dir}/${image}/github-repo)
description="$(cat ${docker_docs_dir}/${image}/README-short.txt)"
license="$(cat ${docker_docs_dir}/${image}/license.md)"
vendor="$(cat ${docker_docs_dir}/${image}/maintainer.md)"
logo=$(base64 -w 0 ${docker_docs_dir}/${image}/logo.png)
echo ${repo}
sed -i.bak "s|%%GITHUB-REPO%%|${repo}|g" ${docker_docs_dir}/${image}/maintainer.md; rm ${docker_docs_dir}/${image}/maintainer.md.bak
sed -i.bak "s|%%IMAGE%%|${image}|g" ${docker_docs_dir}/${image}/content.md; rm ${docker_docs_dir}/${image}/content.md.bak
doc=$(cat ${docker_docs_dir}/${image}/content.md)

local_image_ref_skopeo=oci:${images_dir}:${image}-${tag}
local_image_ref_regtl=ocidir://${images_dir}:${image}-${tag}
local_image_ref_trivy=${images_dir}:${image}-${tag}
remote_src_image_ref=docker://${image}:${tag}
remote_dest_image_ref=${registry}/${image}:${tag}

multiarch_arg=""
if [ ! -z "${multiarch}" ]; then
    multiarch_arg="--multi-arch=${multiarch}"
fi

# Verify if image is already present in local oci layout
skopeo inspect ${local_image_ref_skopeo}
if [ $? -eq 0 ]; then
    echo "Image ${local_image_ref_skopeo} found locally"
else
    echo "Image ${local_image_ref_skopeo} will be copied"
    skopeo --insecure-policy --override-os="linux" --override-arch="amd64" copy --override-os="linux" --override-arch="amd64" --format=oci ${multiarch_arg} ${remote_src_image_ref} ${local_image_ref_skopeo}
    if [ $? -ne 0 ]; then
        exit 1
    fi
fi

# Mofify image in local oci layout and update the old reference to point to the new index
regctl image mod --replace --annotation org.opencontainers.image.title=${image} ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.description="${description}" ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.url=${repo} ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.source=${repo} ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.licenses="${license}" ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.vendor="${vendor}" ${local_image_ref_regtl}
regctl image mod --replace --annotation org.opencontainers.image.documentation="${description}" ${local_image_ref_regtl}

credentials_args=""
if [ ! -z "${username}" ]; then
    credentials_args="--dest-creds ${username}:${password}"
fi

# Upload image to target registry
skopeo --override-os="linux" --override-arch="amd64" copy  --dest-tls-verify=false ${multiarch_arg} ${credentials_args} ${local_image_ref_skopeo} docker://${remote_dest_image_ref}
if [ $? -ne 0 ]; then
    exit 1
fi

# Upload image logo as image media type
regctl artifact put --annotation artifact.type=com.zot.logo.image --annotation format=oci \
    --artifact-type "application/vnd.zot.logo.v1" --subject ${remote_dest_image_ref} ${remote_dest_image_ref}-logo-image << EOF
${logo}
EOF
if [ $? -ne 0 ]; then
    exit 1
fi

trivy_out_file=trivy-${image}-${tag}.json
if [ ! -z "${multiarch}" ]; then
    trivy image --scanners vuln --format json --input ${local_image_ref_trivy} -o ${trivy_out_file}
    jq -n --argfile trivy_file ${trivy_out_file}  '.trivy=$trivy_file.Results' > ${trivy_out_file}.tmp
    mv ${trivy_out_file}.tmp ${trivy_out_file}
else
    echo '{"trivy":[]}' > ${trivy_out_file}
fi

layers_file=manifests-${image}-${tag}.json
rm -f ${layers_file}

if [ -z "${multiarch}" ]; then
    regctl manifest --format raw-body get ${local_image_ref_regtl} | jq '{ manifests: { default: { layers: [ .layers[].digest ] } } }' > ${layers_file}
else
    manifests=$(regctl manifest --format raw-body get ${local_image_ref_regtl} | jq '[ .manifests[] | { "digest":.digest, "platform":(.platform | [ .os, .architecture, .variant ] | map(select(.!=null)) | join("/") )} ] ')

    echo $manifests | jq -c '.[]' | while read i; do
        digest=$(echo $i | jq -r '.digest')
        platform=$(echo $i | jq -r '.platform')
        regctl manifest --format raw-body get ocidir://${images_dir}@${digest} | jq --arg platform "${platform}" '{ manifests: { ($platform): { layers: [ .layers[].digest ] } } }' >> layers-${image}-${tag}-${digest//:/_}.json
    done

    jq -n '{ manifests: [ inputs.manifests ] | add }' layers-${image}-${tag}*.json > ${layers_file}
    rm -f layers-${image}-${tag}*.json
fi


# Sign new updated image
COSIGN_PASSWORD=${cosign_password} cosign sign ${remote_dest_image_ref} --key ${cosign_key_path} --allow-insecure-registry --yes
if [ $? -ne 0 ]; then
    exit 1
fi

details_file=details-${image}-${tag}.json

jq -n \
    --arg org.opencontainers.image.title "${image}" \
    --arg org.opencontainers.image.description " $description" \
    --arg org.opencontainers.image.url "${repo}" \
    --arg org.opencontainers.image.source "${repo}" \
    --arg org.opencontainers.image.licenses "${license}" \
    --arg org.opencontainers.image.vendor "${vendor}" \
    --arg org.opencontainers.image.documentation "${description}" \
    '$ARGS.named' > ${details_file}

jq -c -s add ${details_file} ${trivy_out_file} ${layers_file} > ${metafile}
rm ${details_file} ${trivy_out_file} ${layers_file}
