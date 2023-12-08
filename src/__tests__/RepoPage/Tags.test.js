import { fireEvent, waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tags from 'components/Repo/Tabs/Tags';
import React from 'react';
import MockThemeProvider from '__mocks__/MockThemeProvider';

const TagsThemeWrapper = () => {
  return (
    <MockThemeProvider>
      <Tags tags={mockedTagsData} />
    </MockThemeProvider>
  );
};

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const mockedTagsData = [
  {
    tag: 'latest',
    vendor: 'test1',
    isDeletable: true,
    manifests: [
      {
        lastUpdated: '2022-07-19T18:06:18.818788283Z',
        digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
        size: '569130088',
        platform: {
          Os: 'linux',
          Arch: 'amd64'
        }
      }
    ]
  },
  {
    tag: 'bullseye',
    vendor: 'test1',
    isDeletable: true,
    manifests: [
      {
        digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
        lastUpdated: '2022-07-19T18:06:18.818788283Z',
        size: '569130088',
        platform: {
          Os: 'linux',
          Arch: 'amd64'
        }
      }
    ]
  },
  {
    tag: '1.5.2',
    vendor: 'test1',
    isDeletable: true,
    manifests: [
      {
        lastUpdated: '2022-07-19T18:06:18.818788283Z',
        digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559',
        size: '569130088',
        platform: {
          Os: 'linux',
          Arch: 'amd64'
        }
      }
    ]
  }
];

describe('Tags component', () => {
  it('should open and close details dropdown for tags', async () => {
    render(<TagsThemeWrapper />);
    const openBtn = screen.getAllByText(/show/i);
    fireEvent.click(openBtn[0]);
    expect(screen.getByText(/OS\/ARCH/i)).toBeInTheDocument();
    fireEvent.click(openBtn[0]);
    await waitFor(() => expect(screen.queryByText(/OS\/ARCH/i)).not.toBeInTheDocument());
  });

  it('should see delete tag button and its dialog', async () => {
    render(<TagsThemeWrapper />);
    const deleteBtn = await screen.findAllByTestId('DeleteIcon');
    fireEvent.click(deleteBtn[0]);
    expect(await screen.findByTestId('delete-dialog')).toBeInTheDocument();
    const confirmBtn = await screen.findByTestId('confirm-delete');
    expect(confirmBtn).toBeInTheDocument();
    fireEvent.click(confirmBtn);
    expect(await screen.findByTestId('confirm-delete')).toBeInTheDocument();
    expect(await screen.findByTestId('cancel-delete')).toBeInTheDocument();
  });

  it('should navigate to tag page details when tag is clicked', async () => {
    render(<TagsThemeWrapper />);
    const tagLink = await screen.findByText('latest');
    fireEvent.click(tagLink);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('tag/latest', { state: { digest: null } });
    });
  });

  it('should navigate to specific manifest when clicking the digest', async () => {
    render(<TagsThemeWrapper />);
    const openBtn = screen.getAllByText(/show/i);
    await fireEvent.click(openBtn[0]);
    const tagLink = await screen.findByText(/sha256:adca4/i);
    fireEvent.click(tagLink);
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('tag/latest', {
        state: { digest: 'sha256:adca4815c494becc1bf053af0c4640b2d81ab1a779e6d649e1b8b92a75f1d559' }
      });
    });
  });

  it('should filter tag list based on user input', async () => {
    render(<TagsThemeWrapper />);
    const tagFilterInput = await screen.findByPlaceholderText(/Search Tags/i);
    expect(await screen.findByText(/latest/i)).toBeInTheDocument();
    expect(await screen.findByText(/bullseye/i)).toBeInTheDocument();
    userEvent.type(tagFilterInput, 'bull');
    await waitFor(() => expect(screen.queryByText(/latest/i)).not.toBeInTheDocument());
    expect(await screen.findByText(/bullseye/i)).toBeInTheDocument();
  });

  it('should sort tags based on the picked sort criteria', async () => {
    render(<TagsThemeWrapper />);
    const selectFilter = await screen.findByText('Newest');
    expect(selectFilter).toBeInTheDocument();
    userEvent.click(selectFilter);
    const newOption = await screen.findByText('A - Z');
    userEvent.click(newOption);
    expect(await screen.findByText('A - Z')).toBeInTheDocument();
    expect(await screen.queryByText('Newest')).not.toBeInTheDocument();
  });
});
