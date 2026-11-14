import { createTheme } from '@mui/material/styles';

import { lightPalette } from './palette';

const theme = createTheme({
	cssVariables: true,
	colorSchemes: {
		light: { palette: lightPalette }
	}
});

// Keeps the exact behavior from before the theme refactor; could be removed to use MUI defaults
theme.typography.h4 = {
	fontFamily: 'inherit',
	fontWeight: 'bold',
	lineHeight: 'inherit',
	letterSpacing: 'inherit',
	fontSize: '2.5rem',
	[theme.breakpoints.down('sm')]: {
		fontSize: '1.5rem'
	}
};

export default theme;
