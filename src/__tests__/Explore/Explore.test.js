import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import Explore from 'components/Explore';
import React, { useState } from 'react';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

const StateExploreWrapper = () => {
  const [data, useData] = useState([]);
  return <Explore data={data} keywords={''} updateData={useData} />;
};
const mockImageList = {
  RepoListWithNewestImage: [
    {
      NewestImage: {
        RepoName: 'alpine',
        Tag: 'latest',
        LastUpdated: '2022-08-09T17:19:53.274069586Z',
        Description: 'w',
        Licenses: '',
        Vendor: '',
        Size: '2806985',
        Labels: ''
      }
    },
    {
      NewestImage: {
        RepoName: 'mongo',
        Tag: 'latest',
        LastUpdated: '2022-08-02T01:30:49.193203152Z',
        Description: '',
        Licenses: '',
        Vendor: '',
        Size: '231383863',
        Labels: ''
      }
    },
    {
      NewestImage: {
        RepoName: 'nodeUnique',
        Tag: 'latest',
        LastUpdated: '2022-08-23T00:20:40.144281895Z',
        Description: '',
        Licenses: '',
        Vendor: '',
        Size: '369311301',
        Labels: ''
      }
    }
  ]
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

  it("should log an error when data can't be fetched", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateExploreWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
