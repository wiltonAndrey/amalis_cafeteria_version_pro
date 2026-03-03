import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminLogin from '../pages/AdminLogin';

const originalFetch = global.fetch;

const mockResponse = (ok: boolean, payload: any): Response =>
  ({
    ok,
    json: async () => payload,
  } as Response);

describe('AdminLogin text copy', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('muestra textos acentuados y valida con copy correcto', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockResponse(false, { ok: false, error: 'unauthorized' }));

    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inicia sesión para editar la carta\./i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.queryByText('unauthorized')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Completa email y contraseña.');
  });
});
