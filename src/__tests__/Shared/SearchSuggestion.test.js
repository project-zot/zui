import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api } from 'api';
import SearchSuggestion from 'components/Header/SearchSuggestion';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// router mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const RouterSearchWrapper = (props) => {
  const queryString = props.search || '';
  return (
    <MemoryRouter initialEntries={[queryString]}>
      <SearchSuggestion />
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
          IsSigned: true,
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
          IsSigned: false,
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
          IsSigned: false,
          Licenses: '',
          Vendor: '',
          Labels: ''
        }
      }
    ],
    Images: [
      {
        RepoName: 'debian',
        Tag: 'testTag'
      }
    ]
  }
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Search component', () => {
  it('should display suggestions when user searches', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<RouterSearchWrapper />);
    const searchInput = screen.getByPlaceholderText(/searchSuggestion.search/i);
    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'test');
    expect(await screen.findByText(/alpine/i)).toBeInTheDocument();
  });

  it('should navigate to repo page when a repo suggestion is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<RouterSearchWrapper />);
    const searchInput = screen.getByPlaceholderText(/searchSuggestion.search/i);
    userEvent.type(searchInput, 'test');
    const suggestionItemRepo = await screen.findByText(/alpine/i);
    userEvent.click(suggestionItemRepo);
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/image/alpine'));
  });

  it('should navigate to repo page when a image suggestion is clicked', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } });
    render(<RouterSearchWrapper />);
    const searchInput = screen.getByPlaceholderText(/searchSuggestion.search/i);
    userEvent.type(searchInput, 'debian:test');
    const suggestionItemImage = await screen.findByText(/debian:testTag/i);
    userEvent.click(suggestionItemImage);
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/image/debian/tag/testTag'));
  });

  it('should log an error if it doesnt receive an ok response for repo search', async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterSearchWrapper />);
    const searchInput = screen.getByPlaceholderText(/searchSuggestion.search/i);
    userEvent.type(searchInput, 'debian');
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should log an error if it doesnt receive an ok response for image search', async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterSearchWrapper />);
    const searchInput = screen.getByPlaceholderText(/searchSuggestion.search/i);
    userEvent.type(searchInput, 'debian:test');
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
