import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import RepoCard from 'components/RepoCard';

// usenavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
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
  tags: ''
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
        tags={mockImage.tags}
        vendor={mockImage.vendor}
        size={mockImage.size}
        licenses={mockImage.licenses}
        key={1}
        data={mockImage}
        lastUpdated={mockImage.lastUpdated}
        shown={true}
      />
    );
    const cardTitle = await screen.findByText('alpine');
    expect(cardTitle).toBeInTheDocument();
    userEvent.click(cardTitle);
    expect(mockedUsedNavigate).toBeCalledWith(`/image/${mockImage.name}`);
  });
});
