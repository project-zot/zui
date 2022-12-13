import { render, screen } from '@testing-library/react';
import TagPage from 'pages/TagPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

jest.mock(
  'components/TagDetails',
  () =>
    function TagDetails() {
      return <div />;
    }
);

jest.mock(
  'components/ExploreHeader',
  () =>
    function ExploreHeader() {
      return <div />;
    }
);

it('renders the tags page component', async () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TagPage />} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('tag-container')).toBeInTheDocument();
});
