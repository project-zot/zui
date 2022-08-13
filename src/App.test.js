import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';


it('renders the app component', () => {
  render(<App/>);
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});
