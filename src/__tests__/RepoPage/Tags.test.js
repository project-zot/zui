import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import Tags from 'components/Tags';
import React from 'react';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const mockedTagsData = [
  {
    Digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
    Tag: 'latest',
    LastUpdated: '2022-07-19T18:06:18.818788283Z',
    Vendor: 'test1',
    Size: '569130088',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    }
  }
];

describe('Tags component', () => {
  it('should open and close details dropdown for tags', async () => {
    render(<Tags tags={mockedTagsData} />);
    const openBtn = screen.getByText(/digest/i);
    fireEvent.click(openBtn);
    expect(screen.getByText(/OS\/ARCH/i)).toBeInTheDocument();
    fireEvent.click(openBtn);
    await waitFor(() => expect(screen.queryByText(/OS\/ARCH/i)).not.toBeInTheDocument());
  });

  it('should navigate to tag page details when tag is clicked', async () => {
    render(<Tags tags={mockedTagsData} />);
    const tagLink = await screen.findByText('latest');
    fireEvent.click(tagLink);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('tag/latest');
    });
  });
});
