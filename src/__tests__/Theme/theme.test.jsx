import React from 'react';
import { render, screen } from '@testing-library/react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import theme from 'theme';
import MockThemeProvider from '__mocks__/MockThemeProvider';

describe('theme', () => {
	it('exposes palette values as css variables', () => {
		expect(theme.vars.palette.background.default).toContain('var(--mui-palette-background-default');
		expect(theme.vars.palette.secondary.main).toContain('var(--mui-palette-secondary-main');
	});

	it('resolves sx palette shorthands to css variables', () => {
		render(
			<MockThemeProvider>
				<Box data-testid="box" sx={{ bgcolor: 'background.default' }} />
			</MockThemeProvider>
		);
		const css = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText)).join('');
		expect(screen.getByTestId('box')).toBeInTheDocument();
		expect(css).toMatch(/background-color:\s*var\(--mui-palette-background-default/);
	});

	it('keeps the h4 override inheriting the surrounding typography once the provider resolves the theme', () => {
		let resolved;
		const Probe = () => {
			resolved = useTheme().typography.h4;
			return null;
		};
		render(
			<MockThemeProvider>
				<Probe />
			</MockThemeProvider>
		);

		expect(resolved).toMatchObject({
			fontFamily: 'inherit',
			fontWeight: 'bold',
			lineHeight: 'inherit',
			letterSpacing: 'inherit'
		});
	});

	it('keeps the h4 override responsive', () => {
		expect(theme.typography.h4.fontSize).toBe('2.5rem');
		expect(theme.typography.h4[theme.breakpoints.down('sm')]).toEqual({ fontSize: '1.5rem' });
	});
});
