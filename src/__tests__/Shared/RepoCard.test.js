import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import RepoCard from 'components/RepoCard';
import { createSearchParams } from 'react-router-dom';

// usenavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

// image mock
const mockImage = {
  name: 'alpine',
  latestVersion: 'latest',
  lastUpdated: '2022-05-23T19:19:30.413290187Z',
  description: '',
  licenses: '',
  vendor: '',
  size: '585',
  tags: '',
  platforms: [{ Os: 'linux', Arch: 'amd64' }]
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Repo card component', () => {
  it('navigates to repo page when clicked', async () => {
    render(
      <RepoCard
        name={mockImage.name}
        version={mockImage.latestVersion}
        description={mockImage.description}
        vendor={mockImage.vendor}
        key={1}
        lastUpdated={mockImage.lastUpdated}
      />
    );
    const cardTitle = await screen.findByText('alpine');
    expect(cardTitle).toBeInTheDocument();
    userEvent.click(cardTitle);
    expect(mockedUsedNavigate).toBeCalledWith(`/image/${mockImage.name}`);
  });

  it('navigates to explore page when platform chip is clicked', async () => {
    render(
      <RepoCard
        name={mockImage.name}
        version={mockImage.latestVersion}
        description={mockImage.description}
        vendor={mockImage.vendor}
        key={1}
        lastUpdated={mockImage.lastUpdated}
        platforms={mockImage.platforms}
      />
    );
    const osChip = await screen.findByText(/linux/i);
    fireEvent.click(osChip);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: '/explore',
      search: createSearchParams({ filter: 'linux' }).toString()
    });
  });
});
