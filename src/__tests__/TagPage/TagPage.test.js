import { render, screen } from '@testing-library/react';
import { api } from 'api';
import TagPage from 'pages/TagPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

jest.mock("components/TagDetails", () => () => {
  return <div/>;
});

it('renders the tags page component', async () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TagPage updateKeywords={() => {}}/>} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('tag-container')).toBeInTheDocument();
});

