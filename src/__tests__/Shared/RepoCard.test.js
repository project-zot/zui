import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import RepoCard from 'components/Shared/RepoCard';
import { createSearchParams } from 'react-router-dom';
import MockThemeProvider from '__mocks__/MockThemeProvider';

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
  isSigned: true,
  signatureInfo: [
    {
      Tool: 'cosign',
      IsTrusted: false,
      Author: ''
    },
    {
      Tool: 'cosign',
      IsTrusted: false,
      Author: ''
    },
    {
      Tool: 'cosign',
      IsTrusted: false,
      Author: ''
    },
    {
      Tool: 'cosign',
      IsTrusted: false,
      Author: ''
    }
  ],
  platforms: [{ Os: 'linux', Arch: 'amd64' }]
};

const RepoCardWrapper = (props) => {
  const { image } = props;
  return (
    <MockThemeProvider>
      <RepoCard
        name={image.name}
        version={image.latestVersion}
        description={image.description}
        vendor={image.vendor}
        isSigned={image.isSigned}
        signatureInfo={image.signatureInfo}
        key={1}
        lastUpdated={image.lastUpdated}
        platforms={image.platforms}
      />
    </MockThemeProvider>
  );
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Repo card component', () => {
  it('navigates to repo page when clicked', async () => {
    render(<RepoCardWrapper image={mockImage} />);
    const cardTitle = await screen.findByText('alpine');
    expect(cardTitle).toBeInTheDocument();
    userEvent.click(cardTitle);
    expect(mockedUsedNavigate).toBeCalledWith(`/image/${mockImage.name}`);
  });

  it('renders placeholders for missing data', async () => {
    render(<RepoCardWrapper image={{ ...mockImage, lastUpdated: '' }} />);
    const cardTitle = await screen.findByText('alpine');
    expect(cardTitle).toBeInTheDocument();
    userEvent.click(cardTitle);
    expect(mockedUsedNavigate).toBeCalledWith(`/image/${mockImage.name}`);
    expect(await screen.findByText(/main.timestampNA/i)).toBeInTheDocument();
  });

  it('navigates to explore page when platform chip is clicked', async () => {
    render(<RepoCardWrapper image={mockImage} />);
    const osChip = await screen.findByText(/linux/i);
    fireEvent.click(osChip);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: '/explore',
      search: createSearchParams({ filter: 'linux' }).toString()
    });
  });
});
