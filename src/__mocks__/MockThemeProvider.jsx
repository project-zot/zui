import React from 'react';
import { ThemeProvider } from '@mui/material/styles';

import theme from 'theme';

function MockThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MockThemeProvider;
