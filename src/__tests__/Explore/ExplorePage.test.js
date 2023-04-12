import { render, screen } from '@testing-library/react';
import ExplorePage from 'pages/ExplorePage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

jest.mock(
  'components/Explore/Explore',
  () =>
    function Explore() {
      return <div />;
    }
);

jest.mock(
  'components/Header/Header',
  () =>
    function Header() {
      return <div />;
    }
);

it('renders the explore page component', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('explore-container')).toBeInTheDocument();
});
