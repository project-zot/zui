import { render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import IsDependentOn from 'components/Tag/Tabs/IsDependentOn';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MockThemeProvider from '__mocks__/MockThemeProvider';

const mockDependentsList = {
  data: {
    DerivedImageList: {
      Page: { ItemCount: 4, TotalCount: 4 },
      Results: [
        {
          RepoName: 'project-stacker/c3/static-ubuntu-amd64',
          Tag: 'tag1',
          Manifests: [],
          Vulnerabilities: {
            MaxSeverity: 'HIGH',
            Count: 5
          }
        },
        {
          RepoName: 'tag2',
          Tag: 'tag2',
          Manifests: [],
          Vulnerabilities: {
            MaxSeverity: 'CRITICAL',
            Count: 2
          }
        },
        {
          RepoName: 'tag3',
          Tag: 'tag3',
          Manifests: [],
          Vulnerabilities: {
            MaxSeverity: 'LOW',
            Count: 5
          }
        },
        {
          RepoName: 'tag4',
          Tag: 'tag4',
          Manifests: [],
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
    <MockThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<IsDependentOn name="alpine:latest" />} />
        </Routes>
      </BrowserRouter>
    </MockThemeProvider>
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
    expect(await screen.findAllByText(/tag/i)).toHaveLength(16);
  });

  it('renders no dependents if there are not any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { DerivedImageList: { Results: [], Page: {} } } }
    });
    render(<RouterDependsWrapper />);
    expect(await screen.findByText(/main.nothingFound/i)).toBeInTheDocument();
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterDependsWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should stop loading if the api response contains an error', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 500, data: { errors: ['test error'] } });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterDependsWrapper />);
    expect(await screen.findByText(/main.nothingFound/i)).toBeInTheDocument();
  });
});
