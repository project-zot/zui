const osFilters = [
  {
    label: 'Windows',
    value: 'windows'
  },
  {
    label: 'Linux',
    value: 'linux'
  }
];

const imageFilters = [
  {
    label: 'Signed Images',
    value: 'HasToBeSigned',
    type: 'boolean'
  }
];

const archFilters = [
  {
    label: 'ARM',
    value: 'arm'
  },
  {
    label: 'ARM 64',
    value: 'arm64'
  },
  {
    label: 'IBM POWER',
    value: 'ppc64'
  },
  {
    label: 'IBM Z',
    value: 's390x'
  },
  {
    label: 'PowerPC 64 LE',
    value: 'ppc64le'
  },
  {
    label: 'x86',
    value: '386'
  },
  {
    label: 'x86-64',
    value: 'amd64'
  }
];

const filterConstants = { osFilters, imageFilters, archFilters };

export default filterConstants;
