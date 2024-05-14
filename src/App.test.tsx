import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  act(async () => {
    render(<App />);
  });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
