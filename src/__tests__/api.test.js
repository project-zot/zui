import { api } from '../api';

describe('api module', () => {
  it('should redirect to login if a 401 error is received', () => {
    const location = new URL('https://www.test.com');
    location.replace = jest.fn();
    delete window.location;
    window.location = location;
    const axiosInstance = api.getAxiosInstance();
    expect(
      axiosInstance.interceptors.response.handlers[0].rejected({
        response: { statusText: 'Unauthorized', status: 401 }
      })
    ).rejects.toMatchObject({
      response: { statusText: 'Unauthorized', status: 401 }
    });
    expect(location.replace).toHaveBeenCalledWith('/login');
  });
});
