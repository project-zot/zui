import { render, screen } from '@testing-library/react';
import HomePage from 'pages/HomePage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



it('renders the homepage component', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<HomePage data={[]} keywords={'test'} updateData={() => {}} updateKeywords={() => {}}/>} />
      </Routes>
    </BrowserRouter>
  );
  expect(screen.getByTestId('homepage-container')).toBeInTheDocument();
});
