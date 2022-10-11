import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RepoDetails from 'components/RepoDetails';
import React from 'react';
import { api } from 'api';

// uselocation mock
const mockUseLocationValue = {
  pathname: "'localhost:3000/image/test'",
  search: '',
  hash: '',
  state: { lastDate: '' }
};

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { name: 'test' };
  },
  useLocation: () => {
    return mockUseLocationValue;
  }
}));

// mock clipboard copy fn
const mockCopyToClipboard = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockCopyToClipboard
  }
});

const mockRepoDetailsData = {
  ExpandedRepoInfo: {
    Manifests: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest',
        Layers: [
          {
            Size: '2798889',
            Digest: '2408cc74d12b6cd092bb8b516ba7d5e290f485d3eb9672efc00f0583730179e8'
          }
        ]
      }
    ]
  }
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Repo details component', () => {
  it('fetches repo detailed data and renders', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetails />);
    expect(await screen.findByText('test')).toBeInTheDocument();
  });

  it("should log error if data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RepoDetails />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should switch between tabs', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetails />);
    expect(await screen.findByTestId('overview-container')).toBeInTheDocument();
    fireEvent.click(await screen.findByText(/tags/i));
    expect(await screen.findByTestId('tags-container')).toBeInTheDocument();
    expect(screen.queryByTestId('overview-container')).not.toBeInTheDocument();
  });

  it('should copy the pull string to clipboard', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetails />);
    fireEvent.click(await screen.findByTestId('pullcopy-btn'));
    await waitFor(() => expect(mockCopyToClipboard).toHaveBeenCalledWith('Pull test'));
  });
});
