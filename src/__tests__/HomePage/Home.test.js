import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import Home from 'components/Home';
import React from 'react';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const mockImageList = {
  RepoListWithNewestImage: [
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
        Labels: ''
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
        Labels: ''
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
        Labels: ''
      }
    }
  ]
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
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<Home />);
    await waitFor(() => expect(screen.getAllByText(/alpine/i)).toHaveLength(2));
    await waitFor(() => expect(screen.getAllByText(/mongo/i)).toHaveLength(2));
    await waitFor(() => expect(screen.getAllByText(/node/i)).toHaveLength(1));
  });

  it('renders signature chips', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<Home />);
    expect(await screen.findAllByTestId('unverified-icon')).toHaveLength(1);
    expect(await screen.findAllByTestId('verified-icon')).toHaveLength(2);
    expect(await screen.findAllByTestId('unverified-chip')).toHaveLength(1);
    expect(await screen.findAllByTestId('verified-chip')).toHaveLength(1);
  });

  it("should log an error when data can't be fetched", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Home />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
