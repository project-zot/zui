import { render, screen, fireEvent } from '@testing-library/react';
import UserAccountMenu from 'components/Header/UserAccountMenu';
import React from 'react';

const mockIsApiKeyEnabled = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => {}
}));

jest.mock('../../utilities/authUtilities', () => ({
  isApiKeyEnabled: () => {
    return mockIsApiKeyEnabled();
  },
  getLoggedInUser: () => {
    return 'jest-user';
  },
  logoutUser: () => {}
}));

describe('Account Menu', () => {
  it('displays Api Keys menu item with its divider when the API Keys config is enabled', async () => {
    mockIsApiKeyEnabled.mockReturnValue(true);
    render(<UserAccountMenu />);
    const userIconButton = await screen.getByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);
    expect(await screen.queryByTestId('api-keys-menu-item')).toBeInTheDocument();
    expect(await screen.queryByTestId('api-keys-menu-item-divider')).toBeInTheDocument();
  });

  it('does not display Api Keys menu item and divider when the API Keys config is disabled', async () => {
    mockIsApiKeyEnabled.mockReturnValue(false);
    render(<UserAccountMenu />);
    const userIconButton = await screen.getByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);
    expect(await screen.queryByTestId('api-keys-menu-item')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('api-keys-menu-item-divider')).not.toBeInTheDocument();
  });
});
