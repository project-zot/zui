import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import Home from 'components/Home/Home';
import React from 'react';
import { createSearchParams } from 'react-router-dom';
import { sortByCriteria } from 'utilities/sortCriteria';
import MockThemeProvider from '__mocks__/MockThemeProvider';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const HomeWrapper = () => {
  return (
    <MockThemeProvider>
      <Home />
    </MockThemeProvider>
  );
};

const mockImageList = {
  GlobalSearch: {
    Page: { TotalCount: 6, ItemCount: 3 },
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        NewestImage: {
          Tag: 'latest',
          Description: 'w',
          IsSigned: false,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'LOW',
            Count: 7
          }
        }
      },
      {
        Name: 'mongo',
        Size: '231383863',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 2
          }
        }
      },
      {
        Name: 'node',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'CRITICAL',
            Count: 10
          }
        }
      }
    ]
  }
};

const mockImageListRecent = {
  GlobalSearch: {
    Page: { TotalCount: 6, ItemCount: 2 },
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        NewestImage: {
          Tag: 'latest',
          Description: 'w',
          IsSigned: false,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'LOW',
            Count: 7
          }
        }
      },
      {
        Name: 'mongo',
        Size: '231383863',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 2
          }
        }
      }
    ]
  }
};

const mockImageListBookmarks = {
  GlobalSearch: {
    Page: { TotalCount: 3, ItemCount: 2 },
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        NewestImage: {
          Tag: 'latest',
          Description: 'w',
          IsSigned: false,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'LOW',
            Count: 7
          }
        }
      },
      {
        Name: 'mongo',
        Size: '231383863',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 2
          }
        }
      }
    ]
  }
};

const mockImageListStars = {
  GlobalSearch: {
    Page: { TotalCount: 3, ItemCount: 2 },
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        NewestImage: {
          Tag: 'latest',
          Description: 'w',
          IsSigned: false,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'LOW',
            Count: 7
          }
        }
      },
      {
        Name: 'mongo',
        Size: '231383863',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 2
          }
        }
      }
    ]
  }
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Home component', () => {
  it('fetches image data and renders popular, bookmarks and recently updated', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageListRecent } });
    render(<HomeWrapper />);
    await waitFor(() => expect(screen.getAllByText(/alpine/i)).toHaveLength(4));
    await waitFor(() => expect(screen.getAllByText(/mongo/i)).toHaveLength(4));
    await waitFor(() => expect(screen.getAllByText(/node/i)).toHaveLength(1));
  });

  it('renders signature icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageListRecent } });
    render(<HomeWrapper />);
    expect(await screen.findAllByTestId('unverified-icon')).toHaveLength(4);
    expect(await screen.findAllByTestId('verified-icon')).toHaveLength(5);
  });

  it('renders vulnerability icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageListRecent } });
    render(<HomeWrapper />);
    expect(await screen.findAllByTestId('low-vulnerability-icon')).toHaveLength(4);
    expect(await screen.findAllByTestId('high-vulnerability-icon')).toHaveLength(4);
    expect(await screen.findAllByTestId('critical-vulnerability-icon')).toHaveLength(1);
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<HomeWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(4));
  });

  it('should redirect to explore page when clicking view all popular', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageListRecent } });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageListBookmarks } });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageListStars } });
    render(<HomeWrapper />);
    const viewAllButtons = await screen.findAllByText(/view all/i);
    expect(viewAllButtons).toHaveLength(4);
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: [] } });
    fireEvent.click(viewAllButtons[0]);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: `/explore`,
      search: createSearchParams({ sortby: sortByCriteria.downloads.value }).toString()
    });
    fireEvent.click(viewAllButtons[1]);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: `/explore`,
      search: createSearchParams({ sortby: sortByCriteria.updateTime.value }).toString()
    });
    fireEvent.click(viewAllButtons[2]);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: `/explore`,
      search: createSearchParams({ filter: 'IsBookmarked' }).toString()
    });
    fireEvent.click(viewAllButtons[3]);
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      pathname: `/explore`,
      search: createSearchParams({ filter: 'IsStarred' }).toString()
    });
  });
});
