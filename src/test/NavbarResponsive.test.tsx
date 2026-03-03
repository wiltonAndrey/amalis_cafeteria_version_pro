import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Navbar } from '../components/layout/Navbar';

describe('Navbar responsive breakpoints', () => {
  it('usa el mismo breakpoint para el boton hamburguesa y el drawer', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const hamburger = screen.getByLabelText(/abrir men[uú]/i);
    const drawer = screen.getByRole('dialog');

    expect(hamburger).toHaveClass('lg:hidden');
    expect(drawer).toHaveClass('lg:hidden');
    expect(drawer).not.toHaveClass('md:hidden');
  });
});
