import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import MockThemeProvider from './__mocks__/MockThemeProvider';
import * as authUtilities from 'utilities/authUtilities';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders the app component', () => {
  render(
    <MockThemeProvider>
      <App />
    </MockThemeProvider>
  );
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});

it('re-evaluates login state when the cached auth config was refreshed', async () => {
  const authSpy = jest.spyOn(authUtilities, 'isAuthenticated').mockReturnValue(false);
  jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(true);
  render(
    <MockThemeProvider>
      <App />
    </MockThemeProvider>
  );
  authSpy.mockClear();
  await waitFor(() => expect(authSpy).toHaveBeenCalled());
});

it('keeps login state when the cached auth config is unchanged', async () => {
  const refreshSpy = jest.spyOn(authUtilities, 'refreshAuthConfig').mockResolvedValue(false);
  const authSpy = jest.spyOn(authUtilities, 'isAuthenticated');
  render(
    <MockThemeProvider>
      <App />
    </MockThemeProvider>
  );
  await waitFor(() => expect(refreshSpy).toHaveBeenCalled());
  authSpy.mockClear();
  await Promise.resolve();
  expect(authSpy).not.toHaveBeenCalled();
});
