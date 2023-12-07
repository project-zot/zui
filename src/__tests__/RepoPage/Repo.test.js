import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RepoDetails from 'components/Repo/RepoDetails';
import React from 'react';
import { api } from 'api';
import { createSearchParams } from 'react-router-dom';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import userEvent from '@testing-library/user-event';

const RepoDetailsThemeWrapper = () => {
  return (
    <MockThemeProvider>
      <RepoDetails />
    </MockThemeProvider>
  );
};

// uselocation mock
const mockUseLocationValue = {
  pathname: "'localhost:3000/image/test'",
  search: ''
};

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { name: 'test' };
  },
  useLocation: () => {
    return mockUseLocationValue;
  },
  useNavigate: () => mockUseNavigate
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
      LastUpdated: '2023-01-30T15:05:35.420124619Z',
      Size: '451554070',
      Vendors: ['[The Node.js Docker Team](https://github.com/nodejs/docker-node)\n'],
      IsBookmarked: false,
      IsStarred: false,
      NewestImage: {
        RepoName: 'mongo',
        IsSigned: true,
        Vulnerabilities: {
          MaxSeverity: 'CRITICAL',
          Count: 15
        }
      },
      Platforms: [
        {
          Os: 'linux',
          Arch: 'amd64'
        }
      ],
      Digest: 'sha256:a8f5a986a9b5324ed3ffdcc30d798c4b0ac24f2c3d1a7cdb3f15ee8908377d74',
      Tag: 'slim',
      Title: 'node',
      Documentation: 'Node.js is a JavaScript-based platform for server-side and networking applications.\n',
      DownloadCount: 0,
      Source: 'https://github.com/nodejs/docker-node',
      Description: 'Node.js is a JavaScript-based platform for server-side and networking applications.',
      Licenses:
        'View [license information](https://github.com/nodejs/node/blob/master/LICENSE) for Node.js or [license information](https://github.com/nodejs/docker-node/blob/master/LICENSE) for the Node.js Docker project.',
      History: null
    }
  }
};

const mockRepoDetailsWithMissingData = {
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
      },
      Platforms: [
        {
          Os: 'linux',
          Arch: 'amd64'
        }
      ]
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

const mockRepoDetailsUnknown = {
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
          MaxSeverity: 'UNKNOWN',
          Count: 15
        }
      }
    }
  }
};

const mockRepoDetailsFailed = {
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
          MaxSeverity: '',
          Count: 15
        }
      }
    }
  }
};

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

beforeEach(() => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: 'user=test'
  });
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Repo details component', () => {
  it('fetches repo detailed data and renders', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findByText('test')).toBeInTheDocument();
  });

  it('renders placeholders for unavailable data', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsWithMissingData } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findByText('test')).toBeInTheDocument();
    expect((await screen.findAllByText(/timestamp n\/a/i)).length).toBeGreaterThan(0);
  });

  it('renders vulnerability icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('critical-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsNone } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('none-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsUnknown } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('unknown-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsFailed } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('failed-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsLow } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('low-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsMedium } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('medium-vulnerability-icon')).toHaveLength(1);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsHigh } });
    render(<RepoDetailsThemeWrapper />);
    expect(await screen.findAllByTestId('high-vulnerability-icon')).toHaveLength(1);
  });

  it("should log error if data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RepoDetailsThemeWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should redirect to homepage if it receives invalid data', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: null, errors: ['testerror'] } });
    render(<RepoDetailsThemeWrapper />);
    await waitFor(() => expect(mockUseNavigate).toBeCalledWith('/home'));
  });

  it('should render platform chips and they should redirect to explore page', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetailsThemeWrapper />);
    const osChip = await screen.findByText(/linux/i);
    fireEvent.click(osChip);
    expect(mockUseNavigate).toHaveBeenCalledWith({
      pathname: '/explore',
      search: createSearchParams({ filter: 'linux' }).toString()
    });
  });

  it('should bookmark a repo if bookmark button is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetailsThemeWrapper />);
    const bookmarkButton = await screen.findByTestId('bookmark-button');
    jest.spyOn(api, 'put').mockResolvedValue({ status: 200, data: {} });
    await userEvent.click(bookmarkButton);
    expect(await screen.findByTestId('bookmarked')).toBeInTheDocument();
  });

  it('should star a repo if star button is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockRepoDetailsData } });
    render(<RepoDetailsThemeWrapper />);
    const starButton = await screen.findByTestId('star-button');
    jest.spyOn(api, 'put').mockResolvedValue({ status: 200, data: {} });
    await userEvent.click(starButton);
    expect(await screen.findByTestId('starred')).toBeInTheDocument();
  });
});
