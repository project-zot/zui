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
  },
  useNavigate: () => jest.fn()
}));

const mockRepoDetailsData = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest'
      }
    ],
    Summary: {
      Name: 'test',
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'CRITICAL',
          Count: 15
        }
      }
    }
  }
};
const mockRepoDetailsNone = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest'
      }
    ],
    Summary: {
      Name: 'test1',
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'NONE',
          Count: 15
        }
      }
    }
  }
};

// const mockRepoDetailsUnknown = {
//   ExpandedRepoInfo: {
//     Images: [
//       {
//         Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
//         Tag: 'latest'
//       }
//     ],
//     Summary: {
//       Name: 'test1',
//       NewestImage: {
//         RepoName: 'mongo',
//         IsSigned: true,
//         Vulnerabilities: {
//           MaxSeverity: 'UNKNOWN',
//           Count: 15
//         }
//       }
//     }
//   }
// };

const mockRepoDetailsLow = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest'
      }
    ],
    Summary: {
      Name: 'test1',
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'LOW',
          Count: 15
        }
      }
    }
  }
};

const mockRepoDetailsMedium = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest'
      }
    ],
    Summary: {
      Name: 'test1',
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'MEDIUM',
          Count: 15
        }
      }
    }
  }
};

const mockRepoDetailsHigh = {
  ExpandedRepoInfo: {
    Images: [
      {
        Digest: '2aa7ff5ca352d4d25fc6548f9930a436aacd64d56b1bd1f9ff4423711b9c8718',
        Tag: 'latest'
      }
    ],
    Summary: {
      Name: 'test1',
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'HIGH',
          Count: 15
        }
      }
    }
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

  it('renders vulnerability icons', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetails />);
    expect(await screen.findAllByTestId('critical-vulnerability-icon')).toHaveLength(1);
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsNone } });
    render(<RepoDetails />);
    expect(await screen.findAllByTestId('none-vulnerability-icon')).toHaveLength(1);
    // @ts-ignore
    // jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsUnknown } });
    // render(<RepoDetails />);
    // expect(await screen.findAllByTestId('unknown-vulnerability-icon')).toHaveLength(1);
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsLow } });
    render(<RepoDetails />);
    expect(await screen.findAllByTestId('low-vulnerability-icon')).toHaveLength(1);
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsMedium } });
    render(<RepoDetails />);
    expect(await screen.findAllByTestId('medium-vulnerability-icon')).toHaveLength(1);
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsHigh } });
    render(<RepoDetails />);
    expect(await screen.findAllByTestId('high-vulnerability-icon')).toHaveLength(1);
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
});
