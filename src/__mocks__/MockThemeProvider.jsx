import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function MockThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MockThemeProvider;
