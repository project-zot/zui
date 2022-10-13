import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import DependsOn from 'components/DependsOn';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const mockDependenciesList = {
  data: {
    BaseImageList: [
      {
        RepoName: 'project-stacker/c3/static-ubuntu-amd64'
      },
      {
        RepoName: 'tag2'
      },
      {
        RepoName: 'tag3'
      },
      {
        RepoName: 'tag4'
      }
    ]
  }
};

const RouterDependsWrapper = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<DependsOn name="alpine:latest" />} />
      </Routes>
    </BrowserRouter>
  );
};

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Dependencies tab', () => {
  it('should render the dependencies if there are any', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: mockDependenciesList });
    render(<RouterDependsWrapper />);
    expect(await screen.findAllByText(/published/i)).toHaveLength(4);
  });

  it('renders no dependencies if there are not any', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { BaseImageList: [] } }
    });
    render(<RouterDependsWrapper />);
    expect(await screen.findByText(/Nothing found/i)).toBeInTheDocument();
  });

  it("should log an error when data can't be fetched", async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterDependsWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
