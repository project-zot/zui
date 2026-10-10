import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserAccountMenu from 'components/Header/UserAccountMenu';
import React from 'react';

const mockIsApiKeyEnabled = jest.fn();
const mockGetServerVersionInfo = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
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

jest.mock('../../utilities/serverInfo', () => ({
  getServerVersionInfo: () => mockGetServerVersionInfo()
}));

describe('Account Menu', () => {
  beforeEach(() => {
    mockGetServerVersionInfo.mockResolvedValue({});
  });

  it('displays Api Keys menu item with its divider when the API Keys config is enabled', async () => {
    mockIsApiKeyEnabled.mockReturnValue(true);
    render(<UserAccountMenu />);
    await waitFor(() => expect(mockGetServerVersionInfo).toHaveBeenCalled());
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);
    expect(await screen.queryByTestId('api-keys-menu-item')).toBeInTheDocument();
    expect(await screen.queryByTestId('api-keys-menu-item-divider')).toBeInTheDocument();
  });

  it('does not display Api Keys menu item and divider when the API Keys config is disabled', async () => {
    mockIsApiKeyEnabled.mockReturnValue(false);
    render(<UserAccountMenu />);
    await waitFor(() => expect(mockGetServerVersionInfo).toHaveBeenCalled());
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);
    expect(await screen.queryByTestId('api-keys-menu-item')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('api-keys-menu-item-divider')).not.toBeInTheDocument();
  });

  it('does not display the version menu item when the server version info is unavailable', async () => {
    render(<UserAccountMenu />);
    await waitFor(() => expect(mockGetServerVersionInfo).toHaveBeenCalled());
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);
    expect(await screen.queryByTestId('version-menu-item')).not.toBeInTheDocument();
  });

  it('displays the version once the server version info loads', async () => {
    mockGetServerVersionInfo.mockResolvedValue({ releaseTag: 'v2.1.0', commit: 'abcdef1234567' });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot v2.1.0 (abcdef1)')).toBeInTheDocument();
  });

  it('extracts the short hash from a git-describe style commit value', async () => {
    mockGetServerVersionInfo.mockResolvedValue({ releaseTag: 'v2.1.18', commit: 'v2.1.18-31-g3ff2b93c' });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot v2.1.18 (3ff2b93)')).toBeInTheDocument();
  });

  it('extracts the short hash from a git-describe commit value with a -dirty suffix', async () => {
    mockGetServerVersionInfo.mockResolvedValue({ releaseTag: 'v2.1.18', commit: 'v2.1.18-31-g3ff2b93c-dirty' });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot v2.1.18 (3ff2b93)')).toBeInTheDocument();
  });

  it('extracts the short hash from a publish.yaml tag-sha commit value', async () => {
    mockGetServerVersionInfo.mockResolvedValue({
      releaseTag: 'v2.1.22',
      commit: 'v2.1.22-6bbc7e5f0123456789abcdef0123456789abcdef'
    });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot v2.1.22 (6bbc7e5)')).toBeInTheDocument();
  });

  it('omits commit parentheses when the commit field is missing', async () => {
    mockGetServerVersionInfo.mockResolvedValue({ releaseTag: 'v2.1.18' });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot v2.1.18')).toBeInTheDocument();
  });

  it('shows a commit-only label when the release tag is missing', async () => {
    mockGetServerVersionInfo.mockResolvedValue({ commit: 'v2.1.18-31-g3ff2b93c' });

    render(<UserAccountMenu />);
    const userIconButton = await screen.findByTestId('user-icon-header-button');
    fireEvent.click(userIconButton);

    await waitFor(() => expect(screen.getByTestId('version-menu-item')).toBeInTheDocument());
    expect(screen.getByText('zot 3ff2b93')).toBeInTheDocument();
  });
});
