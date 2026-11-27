import { api } from '../../api';
import { isAuthenticated, isAuthenticationEnabled, logoutUser, refreshAuthConfig } from '../authUtilities';

describe('authUtilities', () => {
  describe('logoutUser', () => {
    let replaceMock;

    beforeEach(() => {
      replaceMock = jest.fn();
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, replace: replaceMock }
      });
      localStorage.setItem('authConfig', '{}');
      document.cookie = 'user=test-user';
    });

    afterEach(() => {
      jest.restoreAllMocks();
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      localStorage.clear();
    });

    it('redirects to endSessionUrl when the response contains a valid URL', async () => {
      const endSessionUrl = 'https://idp.example.com/logout';
      jest.spyOn(api, 'post').mockResolvedValue({ data: { endSessionUrl: endSessionUrl } });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith(endSessionUrl);
    });

    it('falls back to /login when endSessionUrl is malformed', async () => {
      jest.spyOn(api, 'post').mockResolvedValue({ data: { endSessionUrl: 'not-a-valid-url' } });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith('/login');
    });

    it('redirects to /login when the response has no endSessionUrl', async () => {
      jest.spyOn(api, 'post').mockResolvedValue({ data: {} });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith('/login');
    });
  });

  describe('refreshAuthConfig', () => {
    const htpasswdAuth = { htpasswd: {}, allowAnonymousAccess: true };
    const mgmtResponse = (auth) => ({ status: 200, data: { http: auth === undefined ? {} : { auth } } });

    afterEach(() => {
      jest.restoreAllMocks();
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      localStorage.clear();
    });

    it('does nothing when no auth config is cached yet', async () => {
      const getSpy = jest.spyOn(api, 'get');

      await expect(refreshAuthConfig()).resolves.toBe(false);

      expect(getSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('authConfig')).toBeNull();
    });

    it('leaves the cache untouched when the server config is unchanged', async () => {
      localStorage.setItem('authConfig', JSON.stringify(htpasswdAuth));
      jest.spyOn(api, 'get').mockResolvedValue(mgmtResponse(htpasswdAuth));

      await expect(refreshAuthConfig()).resolves.toBe(false);

      expect(JSON.parse(localStorage.getItem('authConfig'))).toEqual(htpasswdAuth);
    });

    it('updates a stale cache when auth was enabled on the server', async () => {
      localStorage.setItem('authConfig', '{}');
      jest.spyOn(api, 'get').mockResolvedValue(mgmtResponse(htpasswdAuth));

      await expect(refreshAuthConfig()).resolves.toBe(true);

      expect(JSON.parse(localStorage.getItem('authConfig'))).toEqual(htpasswdAuth);
      expect(isAuthenticationEnabled()).toBe(true);
      expect(isAuthenticated()).toBeFalsy();
    });

    it('updates a stale cache and clears the user cookie when auth was disabled on the server', async () => {
      localStorage.setItem('authConfig', JSON.stringify(htpasswdAuth));
      document.cookie = 'user=test-user; path=/';
      jest.spyOn(api, 'get').mockResolvedValue(mgmtResponse());

      await expect(refreshAuthConfig()).resolves.toBe(true);

      expect(localStorage.getItem('authConfig')).toBe('{}');
      expect(document.cookie).not.toContain('user=test-user');
      expect(isAuthenticationEnabled()).toBe(false);
    });

    it('keeps the cached config when the server cannot be reached', async () => {
      localStorage.setItem('authConfig', '{}');
      jest.spyOn(api, 'get').mockRejectedValue(new Error('network error'));

      await expect(refreshAuthConfig()).resolves.toBe(false);

      expect(localStorage.getItem('authConfig')).toBe('{}');
    });

    it('keeps the cached config when the response has no http section', async () => {
      localStorage.setItem('authConfig', '{}');
      jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: {} });

      await expect(refreshAuthConfig()).resolves.toBe(false);

      expect(localStorage.getItem('authConfig')).toBe('{}');
    });
  });
});
