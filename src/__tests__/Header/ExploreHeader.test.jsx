import { render, screen } from '@testing-library/react';
import ExploreHeader from 'components/Header/ExploreHeader';
import MockThemeProvider from '../../__mocks__/MockThemeProvider';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';

function renderAt(initialEntry) {
  return render(
    <MockThemeProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/image/:reponame/tag/:tag" element={<ExploreHeader />} />
          <Route path="/image/:name" element={<ExploreHeader />} />
        </Routes>
      </MemoryRouter>
    </MockThemeProvider>
  );
}

describe('ExploreHeader', () => {
  it('shows a fully decoded breadcrumb for a nested repo name that survived double encoding', () => {
    renderAt('/image/company%252Fusers%252Ffoobar%252Fmyapp/tag/v1.0');

    expect(screen.getByText('company/users/foobar/myapp / v1.0')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/%2F|%25/);
  });

  it('shows a fully decoded breadcrumb for a nested repo name with a single encoding pass', () => {
    renderAt('/image/company%2Fusers%2Ffoobar%2Fmyapp/tag/v1.0');

    expect(screen.getByText('company/users/foobar/myapp / v1.0')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/%2F|%25/);
  });

  it('links the repo breadcrumb back to a single, correctly encoded repo path', () => {
    renderAt('/image/company%252Fusers%252Ffoobar%252Fmyapp/tag/v1.0');

    const link = screen.getByText('company/users/foobar/myapp / v1.0').closest('a');
    expect(link).toHaveAttribute('href', '/image/company%2Fusers%2Ffoobar%2Fmyapp');
  });
});
