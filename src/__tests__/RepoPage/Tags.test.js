import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import Tags from 'components/Tags';
import React from 'react';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const mockedTagsData = {
  name: 'alpine',
  images: [
    {
      Digest: '59118d0816d2e8e05cb04c328224056b3ce07d7afc2ad59e2f1f08bb0ba2ff3c',
      Tag: 'latest',
      Layers: [
        {
          Size: '2806054',
          Digest: '213ec9aee27d8be045c6a92b7eac22c9a64b44558193775a1a7f626352392b49'
        }
      ]
    }
  ],
  lastUpdated: '2022-08-09T17:19:53.274069586Z',
  size: '2806985',
  platforms: [
    {
      Os: 'linux',
      Arch: 'amd64'
    }
  ],
  vendors: [''],
  newestTag: null
};

describe('Tags component', () => {
  it('should open and close details dropdown for tags', () => {
    render(<Tags data={mockedTagsData} />);
    const openBtn = screen.getByText(/see digests/i);
    fireEvent.click(openBtn);
    expect(screen.queryByText(/see digests/i)).not.toBeInTheDocument();
    expect(screen.getByText(/hide digests/i)).toBeInTheDocument();
  });
  it('should navigate to tag page details when tag is clicked', async () => {
    render(<Tags data={mockedTagsData} />);
    const tagLink = await screen.findByText('latest');
    fireEvent.click(tagLink);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('tag/latest');
    });
  });
});
