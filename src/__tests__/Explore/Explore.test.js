import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import Explore from 'components/Explore';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// router mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
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
    Repos: [
      {
        Name: 'alpine',
        Size: '2806985',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        NewestImage: {
          Tag: 'latest',
          Description: 'w',
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
          Licenses: '',
          Vendor: '',
          Labels: ''
        }
      },
      {
        Name: 'nodeUnique',
        Size: '369311301',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        NewestImage: {
          Tag: 'latest',
          Description: '',
          Licenses: '',
          Vendor: '',
          Labels: ''
        }
      }
    ]
  }
};
afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Explore component', () => {
  it("fetches image data and renders the list of images based on it's filters", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<StateExploreWrapper />);
    expect(await screen.findByText(/alpine/i)).toBeInTheDocument();
    expect(await screen.findByText(/mongo/i)).toBeInTheDocument();
    expect(await screen.findByText(/nodeUnique/i)).toBeInTheDocument();
  });

  it('displays the no data message if no data is received', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: { GlobalSearch: { Repos: [] } } } });
    render(<StateExploreWrapper />);
    expect(await screen.findByText(/Looks like/i)).toBeInTheDocument();
  });

  it("should log an error when data can't be fetched", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateExploreWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
