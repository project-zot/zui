const osFilters = [
  {
    label: 'windows',
    value: 'windows'
  },
  {
    label: 'linux',
    value: 'linux'
  },
  {
    label: 'freebsd',
    value: 'freebsd'
  }
];

const imageFilters = [
  {
    label: 'filterConstants.signedImages',
    value: 'HasToBeSigned',
    type: 'boolean'
  },
  {
    label: 'filterConstants.bookmarks',
    value: 'IsBookmarked',
    type: 'boolean'
  },
  {
    label: 'filterConstants.starredRepositories',
    value: 'IsStarred',
    type: 'boolean'
  }
];

const archFilters = [
  {
    label: 'arm',
    value: 'arm',
    tooltip: '32-bit ARM'
  },
  {
    label: 'arm64',
    value: 'arm64',
    tooltip: '64-bit ARM'
  },
  {
    label: 'ppc64',
    value: 'ppc64',
    tooltip: 'PowerPC 64-bit, big-endian'
  },
  {
    label: 's390x',
    value: 's390x',
    tooltip: 'IBM System z 64-bit, big-endian'
  },
  {
    label: 'ppc64le',
    value: 'ppc64le',
    tooltip: 'PowerPC 64-bit, little-endian'
  },
  {
    label: '386',
    value: '386',
    tooltip: '32-bit x86'
  },
  {
    label: 'amd64',
    value: 'amd64',
    tooltip: '64-bit x86'
  }
];

const signatureToolConstants = {
  COSIGN: 'cosign',
  NOTATION: 'notation'
};

const filterConstants = { osFilters, imageFilters, archFilters, signatureToolConstants };

export default filterConstants;
