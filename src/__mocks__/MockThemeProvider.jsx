import React from 'react';
import { ThemeContextProvider } from 'contexts/ThemeContext';

function MockThemeProvider({ children }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

export default MockThemeProvider;
