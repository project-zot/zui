import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({ themeMode: 'light', toggleTheme: () => {} });

const buildTheme = (mode) => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        light: '#757ce8',
        main: mode === 'light' ? '#14191F' : '#90caf9',
        dark: mode === 'light' ? '#002884' : '#42a5f5',
        contrastText: mode === 'light' ? '#fff' : '#000'
      },
      secondary: {
        light: '#ff7961',
        main: mode === 'light' ? '#0F2139' : '#90caf9',
        dark: '#52637A',
        contrastText: mode === 'light' ? '#000' : '#fff'
      },
      background: {
        default: mode === 'light' ? '#f6f7f9' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e2a38'
      }
    }
  });

  theme.typography.h4 = {
    fontSize: '2.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    }
  };

  return theme;
};

function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(themeMode), [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const useThemeContext = () => useContext(ThemeContext);

export { ThemeContextProvider, useThemeContext };
