import { render, screen } from '@testing-library/react';
import ExplorePage from 'pages/ExplorePage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

jest.mock(
  'components/Explore',
  () =>
    function Explore() {
      return <div />;
    }
);

it('renders the explore page component', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ExplorePage data={[]} updateData={() => {}} />} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('explore-container')).toBeInTheDocument();
});
