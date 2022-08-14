import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import Home from 'components/Home';
import React, { useState } from 'react';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   // @ts-ignore
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const StateHomeWrapper = (props) => {
  const [data,useData] = useState([]);
  return (<Home data={data} keywords={''} updateData={useData} />)
}
const mockImageList = {
  ImageListWithLatestTag: [
    {
      "Name": "alpine",
      "Latest": "latest",
      "LastUpdated": "2022-05-23T19:19:30.413290187Z",
      "Description": "",
      "Licenses": "",
      "Vendor": "",
      "Size": "585",
      "Labels": ""
    },
    {
      "Name": "buildah",
      "Latest": "latest",
      "LastUpdated": "2022-05-06T10:11:58Z",
      "Description": "",
      "Licenses": "",
      "Vendor": "",
      "Size": "4440",
      "Labels": ""
    },
    {
      "Name": "redis",
      "Latest": "latest",
      "LastUpdated": "2022-06-23T00:20:27.020952309Z",
      "Description": "",
      "Licenses": "",
      "Vendor": "",
      "Size": "6591",
      "Labels": ""
    },
    {
      "Name": "ubuntu",
      "Latest": "latest",
      "LastUpdated": "2022-06-06T22:21:25.961828386Z",
      "Description": "",
      "Licenses": "",
      "Vendor": "",
      "Size": "579",
      "Labels": ""
    }
  ]
};
afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});


describe('Home component', () => {
  it('fetches image data and renders popular, bookmarks and recently updated',async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImageList } })
    render(<StateHomeWrapper/>);
    await waitFor(() => expect(screen.getAllByText(/alpine/i)).toHaveLength(3));
    await waitFor(() => expect(screen.getAllByText(/buildah/i)).toHaveLength(3));
    await waitFor(() => expect(screen.getAllByText(/redis/i)).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText(/ubuntu/i)).toHaveLength(1));
  });

  it('should log an error when data can\'t be fetched', async() => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: { } })
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateHomeWrapper/>);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  })
});