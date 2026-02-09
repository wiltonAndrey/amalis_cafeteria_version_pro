import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ToastProvider, useToast } from '../context/ToastContext';

const Trigger: React.FC = () => {
  const { showToast } = useToast();
  return (
    <button type="button" onClick={() => showToast('success', 'Producto guardado')}>
      Mostrar
    </button>
  );
};

describe('ToastContext', () => {
  it('muestra un toast cuando se llama showToast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: /mostrar/i }));
    expect(screen.getByText('Producto guardado')).toBeInTheDocument();
  });
});
