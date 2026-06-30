import { hostRoot } from 'host';

const dockerPull = (imageName) => `docker pull ${hostRoot()}/${imageName}`;
const podmanPull = (imageName) => `podman pull ${hostRoot()}/${imageName}`;
const skopeoPull = (imageName) => `skopeo copy docker://${hostRoot()}/${imageName}`;
const orasPull = (imageName) => `oras pull ${hostRoot()}/${imageName}`;

export { dockerPull, podmanPull, skopeoPull, orasPull };
