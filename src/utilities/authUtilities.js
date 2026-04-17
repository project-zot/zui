import { isNil } from 'lodash';
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

export { isAuthenticated, isAuthenticationEnabled, isApiKeyEnabled, getLoggedInUser, logoutUser };
