import { render, screen } from '@testing-library/react';
import Header from 'components/Header/Header';
import React from 'react';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import { BrowserRouter, Route, Routes } from 'react-router';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUsedNavigate
}));

const HeaderWrapper = () => {
  return (
    <MockThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Header />} />
        </Routes>
      </BrowserRouter>
    </MockThemeProvider>
  );
};

describe('Account Menu', () => {
  it('is language select renders in header component', async () => {
    render(<HeaderWrapper />);
    expect(await screen.queryByTestId('select-language')).toBeInTheDocument();
  });
});
