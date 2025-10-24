// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

describe('App Component Integration Tests', () => {
  test('renders welcome message on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Check for text in Home component
    expect(screen.getByText(/welcome to ab3 transaction api/i)).toBeInTheDocument();
  });

  test('renders Home route content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Assuming Home component renders this
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  test('renders DatabaseDemo route content', () => {
    render(
      <MemoryRouter initialEntries={['/db']}>
        <App />
      </MemoryRouter>
    );
    // Assuming DatabaseDemo component renders this
    expect(screen.getByText(/database demo/i)).toBeInTheDocument();
  });

  test('burger toggles menu visibility', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const burgerButton = screen.getByRole('button', { name: /burger/i });

    // Menu should not be visible initially
    expect(screen.queryByText(/menu/i)).not.toBeInTheDocument();

    // Click burger to open menu
    fireEvent.click(burgerButton);
    expect(screen.getByText(/menu/i)).toBeInTheDocument();

    // Click burger again to close menu
    fireEvent.click(burgerButton);
    expect(screen.queryByText(/menu/i)).not.toBeInTheDocument();
  });
});
