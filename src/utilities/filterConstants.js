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
    label: 'Signed Images',
    value: 'HasToBeSigned',
    type: 'boolean'
  },
  {
    label: 'Bookmarks',
    value: 'IsBookmarked',
    type: 'boolean'
  },
  {
    label: 'Starred Repositories',
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

const filterConstants = { osFilters, imageFilters, archFilters };

export default filterConstants;
