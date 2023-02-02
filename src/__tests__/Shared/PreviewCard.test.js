import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import PreviewCard from 'components/Shared/PreviewCard';

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
  tags: ''
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Preview card component', () => {
  it('navigates to repo page when clicked', async () => {
    render(<PreviewCard name={mockImage.name} lastUpdated={mockImage.lastUpdated} />);
    const cardTitle = await screen.findByText('alpine');
    expect(cardTitle).toBeInTheDocument();
    userEvent.click(cardTitle);
    expect(mockedUsedNavigate).toBeCalledWith(`/image/${mockImage.name}`);
  });
});
