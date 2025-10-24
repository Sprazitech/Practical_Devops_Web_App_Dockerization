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

    // Home page h1 is rendered
    expect(screen.getByText(/aws 3-tier web app demo/i)).toBeInTheDocument();
    // Home page image is rendered
    expect(screen.getByAltText(/3t web app architecture/i)).toBeInTheDocument();
  });

  test('renders DatabaseDemo route content', () => {
    render(
      <MemoryRouter initialEntries={['/db']}>
        <App />
      </MemoryRouter>
    );

    // DB Demo link is present in the nav
    expect(screen.getByText(/db demo/i)).toBeInTheDocument();
  });

  test('burger toggles menu visibility', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
    const menu = screen.getByTestId('main-menu'); // We will use data-testid

    // Menu should be hidden initially
    expect(menu).toHaveAttribute('aria-hidden', 'true');

    // Click burger button
    fireEvent.click(burgerButton);

    // Menu should now be visible
    expect(menu).toHaveAttribute('aria-hidden', 'false');
  });

});
