import { createTheme } from '@mui/material/styles';

import { lightPalette } from './palette';

const { breakpoints } = createTheme();

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: { palette: lightPalette }
  },
  typography: {
    h4: {
      fontFamily: 'inherit',
      fontWeight: 'bold',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      fontSize: '2.5rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.5rem'
      }
    }
  }
});

export default theme;
