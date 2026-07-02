import { hostRoot } from 'host';

const dockerPull = (imageName) => `docker pull ${hostRoot()}/${imageName}`;
const podmanPull = (imageName) => `podman pull ${hostRoot()}/${imageName}`;
const podmanArtifactPull = (imageName) => `podman artifact pull ${hostRoot()}/${imageName}`;
const skopeoPull = (imageName) => `skopeo copy docker://${hostRoot()}/${imageName}`;
const orasPull = (imageName) => `oras pull ${hostRoot()}/${imageName}`;

export { dockerPull, podmanPull, podmanArtifactPull, skopeoPull, orasPull };
