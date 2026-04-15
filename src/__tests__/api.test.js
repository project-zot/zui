import { api } from '../api';

describe('api module', () => {
  it('should redirect to login if a 401 error is received', async () => {
    const replaceMock = jest.fn();
    delete window.location;
    window.location = { replace: replaceMock, pathname: '/' };

    const axiosInstance = api.getAxiosInstance();

    await expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        response: { statusText: 'Unauthorized', status: 401 }
      })
    ).rejects.toMatchObject({
      response: { statusText: 'Unauthorized', status: 401 }
    });

    expect(replaceMock).toHaveBeenCalledWith('/login');
  });
});
