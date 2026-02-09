import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProductCRUD from '../components/admin/ProductCRUD';
import { ToastProvider } from '../context/ToastContext';

describe('ProductCRUD', () => {
  it('muestra estado vacio cuando no hay productos', () => {
    render(
      <ToastProvider>
        <ProductCRUD products={[]} loading={false} />
      </ToastProvider>
    );

    expect(screen.getByText(/a(u|ú)n no hay productos/i)).toBeInTheDocument();
  });

  it('muestra skeleton cuando esta cargando', () => {
    render(
      <ToastProvider>
        <ProductCRUD products={[]} loading={true} />
      </ToastProvider>
    );

    expect(screen.getAllByTestId('product-skeleton').length).toBeGreaterThan(0);
  });
});
