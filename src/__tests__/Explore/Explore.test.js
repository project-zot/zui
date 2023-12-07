import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from 'api';
import Explore from 'components/Explore/Explore';
import React from 'react';
import { createSearchParams, MemoryRouter } from 'react-router-dom';
import filterConstants from 'utilities/filterConstants.js';
import { sortByCriteria } from 'utilities/sortCriteria.js';
import MockThemeProvider from '__mocks__/MockThemeProvider';

// router mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const StateExploreWrapper = (props) => {
  const queryString = props.search || '';
  return (
    <MockThemeProvider>
      <MemoryRouter initialEntries={[`/explore?${queryString.toString()}`]}>
        <Explore />
      </MemoryRouter>
    </MockThemeProvider>
  );
};
const mockImageList = {
  GlobalSearch: {
    Page: { TotalCount: 20, ItemCount: 10 },
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        IsBookmarked: false,
        IsStarred: false,
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
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'mongo',
        Size: '231383863',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        IsBookmarked: false,
        IsStarred: false,
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
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'node',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        IsBookmarked: false,
        IsStarred: false,
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
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'centos',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        IsBookmarked: false,
        IsStarred: false,
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'NONE',
            Count: 10
          }
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'debian',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        IsBookmarked: false,
        IsStarred: false,
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'MEDIUM',
            Count: 10
          }
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          },
          {
            Os: 'windows',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'mysql',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        IsBookmarked: false,
        IsStarred: false,
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: 'UNKNOWN',
            Count: 10
          }
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      },
      {
        Name: 'base',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        IsBookmarked: false,
        IsStarred: false,
        NewestImage: {
          Tag: 'latest',
          Description: '',
          IsSigned: true,
          Licenses: '',
          Vendor: '',
          Labels: '',
          Vulnerabilities: {
            MaxSeverity: '',
            Count: 10
          }
        },
        Platforms: [
          {
            Os: 'linux',
            Arch: 'amd64'
          }
        ]
      }
    ]
  }
};

const filteredMockImageListWindows = () => {
  const filteredRepos = mockImageList.GlobalSearch.Repos.filter((r) =>
    r.Platforms.map((pf) => pf.Os).includes('windows')
  );
  return {
    GlobalSearch: {
      Page: { TotalCount: 1, ItemCount: 1 },
      Repos: filteredRepos
    }
  };
};

const filteredMockImageListSigned = () => {
  const filteredRepos = mockImageList.GlobalSearch.Repos.filter((r) => r.NewestImage.IsSigned);
  return {
    GlobalSearch: {
      Page: { TotalCount: 6, ItemCount: 6 },
      Repos: filteredRepos
    }
  };
};

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: 'user=test'
  });
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Explore component', () => {
  it("fetches image data and renders the list of images based on it's filters", async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findByText(/alpine/i)).toBeInTheDocument();
    expect(await screen.findByText(/mongo/i)).toBeInTheDocument();
    expect(await screen.findByText(/centos/i)).toBeInTheDocument();
  });

  it('displays the no data message if no data is received', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { GlobalSearch: { Repos: [] } } } });
    render(<StateExploreWrapper />);
    expect(await screen.findByText(/Looks like/i)).toBeInTheDocument();
  });

  it('renders signature icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findAllByTestId('unverified-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('verified-icon')).toHaveLength(6);
  });

  it('renders vulnerability icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findAllByTestId('low-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('high-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('critical-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('none-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('medium-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('unknown-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('failed-vulnerability-icon')).toHaveLength(1);
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateExploreWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it("should render the sort filter and be able to change it's value", async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    const selectFilter = await screen.findByText('Relevance');
    expect(selectFilter).toBeInTheDocument();
    userEvent.click(selectFilter);
    const newOption = await screen.findByText('Alphabetical');
    userEvent.click(newOption);
    expect(await screen.findByText('Alphabetical')).toBeInTheDocument();
  });

  it('should get preselected filters and sorting order from query params', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(
      <StateExploreWrapper
        search={createSearchParams({
          filter: filterConstants.osFilters[0].value,
          sortby: sortByCriteria.downloads.value
        })}
      />
    );
    const sortyBySelect = await screen.findByText(sortByCriteria.downloads.label);
    expect(sortyBySelect).toBeInTheDocument();
    const filterCheckboxes = await screen.findAllByRole('checkbox');
    expect(filterCheckboxes[0]).toBeChecked();
  });

  it('should filter the images based on filter cards', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findAllByTestId('repo-card')).toHaveLength(mockImageList.GlobalSearch.Repos.length);
    const windowsCheckbox = (await screen.findAllByRole('checkbox'))[0];
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: filteredMockImageListWindows() } });
    await userEvent.click(windowsCheckbox);
    expect(windowsCheckbox).toBeChecked();
    expect(await screen.findAllByTestId('repo-card')).toHaveLength(1);
    const signedCheckboxLabel = await screen.findByText(/signed images/i);
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: filteredMockImageListSigned() } });
    await userEvent.click(signedCheckboxLabel);
    expect(await screen.findAllByTestId('repo-card')).toHaveLength(6);
  });

  it('should bookmark a repo if bookmark button is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    const bookmarkButton = (await screen.findAllByTestId('bookmark-button'))[0];
    jest.spyOn(api, 'put').mockResolvedValueOnce({ status: 200, data: {} });
    await userEvent.click(bookmarkButton);
    expect(await screen.findAllByTestId('bookmarked')).toHaveLength(1);
  });

  it('should star a repo if star button is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    const starButton = (await screen.findAllByTestId('star-button'))[0];
    jest.spyOn(api, 'put').mockResolvedValueOnce({ status: 200, data: {} });
    await userEvent.click(starButton);
    expect(await screen.findAllByTestId('starred')).toHaveLength(1);
  });
});
