import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import MockThemeProvider from './__mocks__/MockThemeProvider';

it('renders the app component', () => {
  render(
    <MockThemeProvider>
      <App />
    </MockThemeProvider>
  );
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});
