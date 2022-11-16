import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  },
  {
    Digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
    Tag: 'bullseye',
    LastUpdated: '2022-07-19T18:06:18.818788283Z',
    Vendor: 'test1',
    Size: '569130088',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    }
  },
  {
    Digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
    Tag: '1.5.2',
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
    const openBtn = screen.getAllByText(/digest/i);
    fireEvent.click(openBtn[0]);
    expect(screen.getByText(/OS\/ARCH/i)).toBeInTheDocument();
    fireEvent.click(openBtn[0]);
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

  it('should filter tag list based on user input', async () => {
    render(<Tags tags={mockedTagsData} />);
    const tagFilterInput = await screen.findByPlaceholderText(/Search for Tags/i);
    expect(await screen.findByText(/latest/i)).toBeInTheDocument();
    expect(await screen.findByText(/bullseye/i)).toBeInTheDocument();
    userEvent.type(tagFilterInput, 'bull');
    await waitFor(() => expect(screen.queryByText(/latest/i)).not.toBeInTheDocument());
    expect(await screen.findByText(/bullseye/i)).toBeInTheDocument();
  });

  it('should sort tags based on the picked sort criteria', async () => {
    render(<Tags tags={mockedTagsData} />);
    const selectFilter = await screen.findByText('Newest');
    expect(selectFilter).toBeInTheDocument();
    userEvent.click(selectFilter);
    const newOption = await screen.findByText('A - Z');
    userEvent.click(newOption);
    expect(await screen.findByText('A - Z')).toBeInTheDocument();
    expect(await screen.queryByText('Newest')).not.toBeInTheDocument();
  });
});
