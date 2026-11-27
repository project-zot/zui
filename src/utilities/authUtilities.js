import { isEmpty, isEqual, isNil } from 'lodash';
import { host } from '../host';
import { api, endpoints } from '../api';

const getCookie = (name) => document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);

const deleteCookie = (name, path, domain) => {
  if (getCookie(name)) {
    document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

// Extract endSessionUrl from the logout response and validate it is a
// well-formed URL, so a malformed value from a misconfigured backend
// falls through to the /login redirect instead of navigating to garbage.
/** @param {{ data?: { endSessionUrl?: string } }} response */
const extractEndSessionUrl = (response) => {
  const endSessionUrl = response?.data?.endSessionUrl;
  if (!endSessionUrl) return null;
  try {
    const parsed = new URL(endSessionUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return endSessionUrl;
  } catch {
    return null;
  }
};

const logoutUser = () => {
  const finishLogout = (endSessionUrl) => {
    deleteCookie('user');
    localStorage.clear();
    window.location.replace(endSessionUrl || '/login');
  };

  return api
    .post(`${host()}${endpoints.logout}`)
    .then((response) => {
      finishLogout(extractEndSessionUrl(response));
    })
    .catch((err) => {
      console.warn(err);
      finishLogout(null);
    });
};

const isAuthenticated = () => {
  const loggedIn = getCookie('user');
  if (loggedIn) return true;
  const authState = JSON.parse(localStorage.getItem('authConfig'));
  if (isNil(authState)) return false;
  if (Object.keys(authState).length === 0) return true;
};

const isAuthenticationEnabled = () => {
  const authMethods = JSON.parse(localStorage.getItem('authConfig')) || {};
  return Object.keys(authMethods).length > 0;
};

const isApiKeyEnabled = () => {
  const authConfig = JSON.parse(localStorage.getItem('authConfig')) || {};
  return authConfig?.apikey;
};

const getLoggedInUser = () => {
  const userCookie = getCookie('user');
  if (!userCookie) return null;
  return userCookie;
};

// The auth config is cached in localStorage by the login page and is otherwise
// never re-read, so a server whose auth settings changed since the last visit
// (auth enabled or disabled) would keep being treated with the old settings.
// Re-check it against the public mgmt endpoint and update the cache if it is
// stale. Resolves to true when the cached config was changed.
const refreshAuthConfig = () => {
  const cached = localStorage.getItem('authConfig');
  // Nothing cached yet: the login page fetches and stores it on first visit.
  if (isNil(cached)) return Promise.resolve(false);

  return api
    .get(`${host()}${endpoints.authConfig}`)
    .then((response) => {
      if (!response?.data?.http) return false;
      const current = isEmpty(response.data.http.auth) ? {} : response.data.http.auth;
      if (isEqual(JSON.parse(cached), current)) return false;

      localStorage.setItem('authConfig', JSON.stringify(current));
      if (isEmpty(current)) {
        // Auth was disabled: a session cookie from before is no longer meaningful.
        deleteCookie('user', '/');
      }
      return true;
    })
    .catch(() => false);
};

export { isAuthenticated, isAuthenticationEnabled, isApiKeyEnabled, getLoggedInUser, logoutUser, refreshAuthConfig };
