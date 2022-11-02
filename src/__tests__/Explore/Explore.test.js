import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from 'api';
import Explore from 'components/Explore';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// router mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const StateExploreWrapper = (props) => {
  const queryString = props.search || '';
  return (
    <MemoryRouter initialEntries={[queryString]}>
      <Explore />
    </MemoryRouter>
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
      },
      {
        Name: 'centos',
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
            MaxSeverity: 'NONE',
            Count: 10
          }
        }
      },
      {
        Name: 'debian',
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
            MaxSeverity: 'MEDIUM',
            Count: 10
          }
        }
      },
      {
        Name: 'mysql',
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
            MaxSeverity: 'UNKNOWN',
            Count: 10
          }
        }
      }
    ]
  }
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
    expect(await screen.findAllByTestId('verified-icon')).toHaveLength(5);
  });

  it('renders vulnerability icons', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findAllByTestId('low-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('high-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('critical-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('none-vulnerability-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('medium-vulnerability-icon')).toHaveLength(1);
    // expect(await screen.findAllByTestId('unknown-vulnerability-icon')).toHaveLength(1);
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
});
