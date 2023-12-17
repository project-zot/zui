import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#14191F',
        dark: '#002884',
        contrastText: '#fff'
      },
      secondary: {
        light: '#ff7961',
        main: '#0F2139',
        dark: '#52637A',
        contrastText: '#000'
      }
    }
  })
);

theme.typography.h4 = {
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem'
  }
};

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
