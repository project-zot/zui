import { api, endpoints } from '../api';

describe('api module', () => {
  const setupLocation = () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, replace: jest.fn() }
    });
    const location = new URL('https://www.test.com');
    location.replace = jest.fn();
    delete window.location;
    window.location = location;
    return location;
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should redirect to login if a 401 error is received', async () => {
    const location = setupLocation();
    jest.spyOn(api, 'post').mockResolvedValue({ data: {} });
    const axiosInstance = api.getAxiosInstance();
    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        response: { statusText: 'Unauthorized', status: 401 }
      })
    ).rejects.toMatchObject({
      response: { statusText: 'Unauthorized', status: 401 }
    });
    expect(location.replace).toHaveBeenCalledWith('/login');
  });

  it('should not recurse when the 401 originates from the logout endpoint itself', async () => {
    setupLocation();
    const postSpy = jest.spyOn(api, 'post').mockResolvedValue({ data: {} });
    const axiosInstance = api.getAxiosInstance();
    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        config: { url: `https://www.test.com${endpoints.logout}` },
        response: { statusText: 'Unauthorized', status: 401 }
      })
    ).rejects.toMatchObject({
      response: { statusText: 'Unauthorized', status: 401 }
    });
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('should request artifact type details for image pages', () => {
    const query = endpoints.detailedImageInfo('repo', 'tag');

    expect(query).toContain('Image(image: "repo:tag")');
    expect(query).toContain('Tag TaggedTimestamp ArtifactType Manifests {ArtifactType Layers');
    expect(query).toContain('Layers {Size Digest}');
    expect(query).not.toContain('Layers {MediaType');
    expect(query).toContain('Referrers {MediaType Size Digest}');
  });
});
