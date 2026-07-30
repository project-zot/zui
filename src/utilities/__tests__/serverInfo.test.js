import { api, endpoints } from '../../api';
import { getServerVersionInfo } from '../serverInfo';

describe('serverInfo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches build info from the mgmt endpoint and maps the response fields', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      data: {
        releaseTag: 'v2.1.22',
        commit: 'v2.1.22-0-g6bbc7e5',
        distSpecVersion: '1.1.1',
        binaryType: '-search-mgmt',
        http: { auth: {} }
      }
    });

    await expect(getServerVersionInfo()).resolves.toEqual({
      releaseTag: 'v2.1.22',
      commit: 'v2.1.22-0-g6bbc7e5',
      distSpecVersion: '1.1.1',
      binaryType: '-search-mgmt'
    });

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`${endpoints.authConfig}$`)));
  });

  it('maps missing build fields to undefined', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ data: {} });

    await expect(getServerVersionInfo()).resolves.toEqual({
      releaseTag: undefined,
      commit: undefined,
      distSpecVersion: undefined,
      binaryType: undefined
    });
  });
});
