import { render, screen } from '@testing-library/react';
import TagPage from 'pages/TagPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


it('renders the tags page component', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TagPage updateKeywords={() => {}}/>} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('tag-container')).toBeInTheDocument();
});

