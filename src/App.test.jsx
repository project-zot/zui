import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';
import App from './App';
import MockThemeProvider from './__mocks__/MockThemeProvider';
import * as authUtilities from 'utilities/authUtilities';

jest.mock('./pages/HomePage', () => {
  const { isAuthenticationEnabled } = require('utilities/authUtilities');
  return () => (
    <div data-testid="home">{isAuthenticationEnabled() ? 'account-menu' : 'no-account-menu'}</div>
  );
});
jest.mock('./pages/LoginPage', () => () => <div data-testid="login" />);

const renderApp = () =>
  render(
    <MockThemeProvider>
      <App />
    </MockThemeProvider>
  );

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  jest.restoreAllMocks();
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
});

it('renders the app component', async () => {
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  renderApp();
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
  await screen.findByTestId('login');
});

it('moves to the home page when a refresh finds auth was disabled', async () => {
  localStorage.setItem('authConfig', JSON.stringify({ htpasswd: {} }));
  let resolveRefresh;
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockReturnValue(
    new Promise((resolve) => {
      resolveRefresh = resolve;
    })
  );
  renderApp();
  await screen.findByTestId('login');

  localStorage.setItem('authConfig', JSON.stringify({}));
  await act(async () => resolveRefresh(true));

  expect(await screen.findByTestId('home')).toBeInTheDocument();
});

it('stays on the login page when the refresh reports no change', async () => {
  localStorage.setItem('authConfig', JSON.stringify({ htpasswd: {} }));
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  renderApp();
  await screen.findByTestId('login');

  localStorage.setItem('authConfig', JSON.stringify({}));
  await act(async () => {});

  expect(screen.getByTestId('login')).toBeInTheDocument();
});

it('moves to the home page when another tab disables auth', async () => {
  localStorage.setItem('authConfig', JSON.stringify({ htpasswd: {} }));
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  renderApp();
  await screen.findByTestId('login');

  localStorage.setItem('authConfig', JSON.stringify({}));
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'authConfig' }));
  });

  expect(await screen.findByTestId('home')).toBeInTheDocument();
});

it('refreshes the router when a signed-in user sees auth disabled', async () => {
  document.cookie = 'user=alice; path=/';
  localStorage.setItem('authConfig', JSON.stringify({ htpasswd: {} }));
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  renderApp();
  expect(await screen.findByText('account-menu')).toBeInTheDocument();

  localStorage.setItem('authConfig', JSON.stringify({}));
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'authConfig' }));
  });

  await waitFor(() => expect(screen.getByText('no-account-menu')).toBeInTheDocument());
});

it('ignores storage events for unrelated keys', async () => {
  localStorage.setItem('authConfig', JSON.stringify({ htpasswd: {} }));
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  renderApp();
  await screen.findByTestId('login');

  localStorage.setItem('authConfig', JSON.stringify({}));
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'other' }));
  });

  expect(screen.getByTestId('login')).toBeInTheDocument();
});
