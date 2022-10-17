import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import DependsOn from 'components/DependsOn';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const mockDependenciesList = {
  data: {
    BaseImageList: [
      {
        RepoName: 'project-stacker/c3/static-ubuntu-amd64',
        Tag: 'tag1',
        Vulnerabilities: {
          MaxSeverity: 'HIGH',
          Count: 5
        }
      },
      {
        RepoName: 'tag2',
        Tag: 'tag2',
        Vulnerabilities: {
          MaxSeverity: 'CRITICAL',
          Count: 2
        }
      },
      {
        RepoName: 'tag3',
        Tag: 'tag3',
        Vulnerabilities: {
          MaxSeverity: 'LOW',
          Count: 7
        }
      },
      {
        RepoName: 'tag4',
        Tag: 'tag4',
        Vulnerabilities: {
          MaxSeverity: 'HIGH',
          Count: 5
        }
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
    expect(await screen.findAllByText(/Tag/i)).toHaveLength(8);
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
