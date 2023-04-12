import { render, screen } from '@testing-library/react';
import HomePage from 'pages/HomePage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

jest.mock(
  'components/Home/Home',
  () =>
    function Home() {
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

it('renders the homepage component', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('homepage-container')).toBeInTheDocument();
});
