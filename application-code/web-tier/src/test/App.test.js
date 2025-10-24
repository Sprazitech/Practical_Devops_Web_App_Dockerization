// src/test/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App Component Integration Tests', () => {
  test('renders Home route content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check that the Home component text is rendered
    expect(screen.getByText(/aws 3-tier web app demo/i)).toBeInTheDocument();

    // Optionally, check that the architecture image is present
    expect(screen.getByAltText(/3t web app architecture/i)).toBeInTheDocument();
  });

  test('renders DatabaseDemo route content', () => {
    render(
      <MemoryRouter initialEntries={['/db']}>
        <App />
      </MemoryRouter>
    );

    // Check that the DB Demo link exists (text in navigation)
    expect(screen.getByText(/db demo/i)).toBeInTheDocument();
  });

  test('burger toggles menu visibility', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Select the burger button using its aria-label
    const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Menu should be hidden initially
    expect(screen.queryByRole('navigation')).toHaveAttribute('aria-hidden', 'true');

    // Click the burger button
    fireEvent.click(burgerButton);

    // Menu should now be visible
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-hidden', 'false');
  });
});
