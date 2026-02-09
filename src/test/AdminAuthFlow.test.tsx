import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Admin from '../pages/Admin';
import AdminLogin from '../pages/AdminLogin';
import { ToastProvider } from '../context/ToastContext';

const originalFetch = global.fetch;

const mockResponse = (ok: boolean, payload: any): Response =>
  ({
    ok,
    json: async () => payload,
  } as Response);

const renderAdminFlow = (initialPath: string) =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('Admin auth flow', () => {
  it('redirige a login cuando no hay sesion activa', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockResponse(false, { ok: false, error: 'unauthorized' }));

    renderAdminFlow('/admin');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /panel de acceso/i })).toBeInTheDocument();
    });
  });

  it('permite login y muestra el panel admin', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(false, { ok: false, error: 'unauthorized' })) // AdminLogin verify
      .mockResolvedValueOnce(mockResponse(true, { ok: true, admin: { id: '1', email: 'admin@example.com' } })) // login
      .mockResolvedValueOnce(mockResponse(true, { ok: true, admin: { id: '1', email: 'admin@example.com' } })) // Admin verify
      .mockResolvedValueOnce(mockResponse(true, { menuProducts: [] })); // useProducts refresh

    global.fetch = fetchMock as unknown as typeof fetch;

    const user = userEvent.setup();
    renderAdminFlow('/admin/login');

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/contrase\u00f1a/i), 'ChangeMe123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /panel de administracion/i })).toBeInTheDocument();
    });
  });
});

