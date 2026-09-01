import { api, endpoints } from '../api';
import { host } from '../host';

// The mgmt endpoint is public (no auth required) and is also used by zli's
// `zot status` command to report the same build info.
const getServerVersionInfo = () =>
  api.get(`${host()}${endpoints.authConfig}`).then((response) => ({
    releaseTag: response.data?.releaseTag,
    commit: response.data?.commit,
    distSpecVersion: response.data?.distSpecVersion,
    binaryType: response.data?.binaryType
  }));

export { getServerVersionInfo };
