import { render, screen } from '@testing-library/react';
import LoginPage from 'pages/LoginPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

it('renders the signin presentation component and signin components if auth enabled', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LoginPage isAuthEnabled={true} setIsAuthEnabled={() => { }} isLoggedIn={false} setIsLoggedIn={() => { }} />} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('login-container')).toBeInTheDocument();
  expect(screen.getByTestId('presentation-container')).toBeInTheDocument();
  expect(screen.getByTestId('signin-container')).toBeInTheDocument();
});
