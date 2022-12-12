import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import IsDependentOn from 'components/IsDependentOn';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const mockDependentsList = {
  data: {
    DerivedImageList: {
      Page: { ItemCount: 4, TotalCount: 4 },
      Results: [
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
            Count: 5
          }
        },
        {
          RepoName: 'tag4',
          Tag: 'tag4',
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 3
          }
        }
      ]
    }
  }
};

const RouterDependsWrapper = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<IsDependentOn name="alpine:latest" />} />
      </Routes>
    </BrowserRouter>
  );
};

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}));

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

describe('Dependents tab', () => {
  it('should render the dependents if there are any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: mockDependentsList });
    render(<RouterDependsWrapper />);
    expect(await screen.findAllByText(/tag/i)).toHaveLength(8);
  });

  it('renders no dependents if there are not any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { DerivedImageList: { Results: [], Page: {} } } }
    });
    render(<RouterDependsWrapper />);
    expect(await screen.findByText(/Nothing found/i)).toBeInTheDocument();
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterDependsWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
