#!/usr/bin/env python3
import argparse
import json
import os
import tempfile
import yaml

# Import from image_utils
from image_utils import (
    create_and_push_image, get_cve_info, init_logger,
    configure_registry_tls, verify_prerequisites
)

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('-r', '--registry', default='localhost:8080', help='Registry address')
    p.add_argument('-u', '--username', default="", help='registry username')
    p.add_argument('-p', '--password', default="", help='registry password')
    p.add_argument('-c', '--cosign-password', default="", help='cosign key password')
    p.add_argument('-d', '--debug', action='store_true', help='enable debug logs')
    p.add_argument('-f', '--config-file', default="config.yaml", help='config file containing information about images to upload')
    p.add_argument('-m', '--metadata-file', default="image_metadata.json", help='file containing metadata on uploaded images')
    p.add_argument('--data-dir', default="", help='location where to store image related data')
    p.add_argument('--build-tool', choices=['buildah', 'podman', 'docker'], default=None,
                   help='Force a specific build tool (buildah, podman, or docker). If not specified, auto-detects.')

    return p.parse_args()

def create_push_image(logger, registry, image_name, tag, cosign_password,
                     multiarch, username, password, data_dir, build_tool=None):
    """Create and push an image, returning its metadata."""
    logger.info("image '{}:{}' will be created from scratch and pushed".format(image_name, tag))

    with tempfile.TemporaryDirectory() as meta_dir_name:
        metafile = '{}_{}_metadata.json'.format(image_name, tag)
        metafile = os.path.join(meta_dir_name, metafile)

        # Call the library function directly
        image_metadata = create_and_push_image(
            registry=registry,
            image=image_name,
            tag=tag,
            metafile=metafile,
            logger=logger,
            username=username,
            password=password,
            cosign_password=cosign_password,
            multiarch=multiarch,
            data_dir=data_dir,
            build_tool=build_tool
        )

        logger.debug("raw image metadata")
        logger.debug(image_metadata)

        # Process metadata
        image_metadata["multiarch"] = multiarch
        trivy_results = image_metadata.pop("trivy", [])
        image_metadata["cves"] = get_cve_info(trivy_results)

    logger.debug("processed image metadata")
    logger.debug(image_metadata)
    return image_metadata

def main():
    args = parse_args()

    registry = args.registry
    username = args.username
    password = args.password
    cosign_password = args.cosign_password
    config_file = args.config_file
    debug = args.debug
    metadata_file = args.metadata_file
    data_dir = args.data_dir
    build_tool = args.build_tool

    logger = init_logger(debug)

    # Setup paths
    images_dir = os.path.join(data_dir, "images") if data_dir else os.path.join(os.getcwd(), "images")
    docker_docs_dir = os.path.join(data_dir, "docs") if data_dir else os.path.join(os.getcwd(), "docs")
    cosign_key_path = os.path.join(data_dir, "cosign.key") if data_dir else os.path.join(os.getcwd(), "cosign.key")

    # Verify prerequisites once per script execution
    verify_prerequisites(data_dir or os.getcwd(), cosign_key_path, docker_docs_dir, cosign_password, logger, build_tool)

    # Configure registry TLS once per script execution
    configure_registry_tls(registry, logger)

    with open(config_file, "r") as f:
        config = yaml.load(f, Loader=yaml.SafeLoader)

    metadata = {}

    for image in config["images"]:
        image_name = image["name"]

        multiarch = image["multiarch"]
        if not multiarch:
            multiarch = ""

        expected_tags = image["tags"]

        logger.debug("image '{}' has the following tags specified in the config file: '{}'".format(image_name, ",".join(expected_tags)))

        # No need to fetch tags from DockerHub - we create all images from scratch
        for tag in expected_tags:
            image_metadata = create_push_image(logger, registry, image_name, tag, cosign_password, multiarch, username, password, data_dir, build_tool)

            metadata.setdefault(image_name, {})
            metadata[image_name][tag] = image_metadata

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    logger.info("Done creating images, see more details in '{}'".format(metadata_file))

if __name__ == "__main__":
    main()

