import { render, screen } from '@testing-library/react';
import Header from 'components/Header/Header';
import React from 'react';
import MockThemeProvider from '__mocks__/MockThemeProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => {}
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
