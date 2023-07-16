import { render, screen } from '@testing-library/react';
import RepoPage from 'pages/RepoPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MockThemeProvider from '__mocks__/MockThemeProvider';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/image/test',
    state: { lastDate: '' }
  })
}));

jest.mock(
  'components/Repo/RepoDetails',
  () =>
    function RepoDetails() {
      return <div />;
    }
);

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

it('renders the repository page component', () => {
  render(
    <MockThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<RepoPage />} />
        </Routes>
      </BrowserRouter>
    </MockThemeProvider>
  );
  expect(screen.getByTestId('repo-container')).toBeInTheDocument();
});
