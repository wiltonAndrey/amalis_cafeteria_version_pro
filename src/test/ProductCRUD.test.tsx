import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ProductCRUD from '../components/admin/ProductCRUD';
import { ToastProvider } from '../context/ToastContext';
import type { MenuProduct } from '../types';

const createProduct = (overrides: Partial<MenuProduct> = {}): MenuProduct => ({
  id: '1',
  name: 'Almohabana',
  price: 1.5,
  category: 'pasteleria',
  description: 'Una descripcion de prueba para el panel.',
  image: '/images/test-product.webp',
  ingredients: [],
  allergens: [],
  ...overrides,
});

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

  it('muestra un resumen del modulo y una lista semantica cuando hay productos', () => {
    render(
      <ToastProvider>
        <ProductCRUD
          products={[
            createProduct(),
            createProduct({ id: '2', name: 'Pizza de Jamon York y Queso', category: 'bolleria-salada' }),
          ]}
          loading={false}
        />
      </ToastProvider>
    );

    expect(screen.getByText('2 productos')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /lista de productos/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('muestra el sort_order de forma explicita en cada card cuando existe', () => {
    render(
      <ToastProvider>
        <ProductCRUD products={[createProduct({ sort_order: 7 })]} loading={false} />
      </ToastProvider>
    );

    expect(screen.getByText('Orden 7')).toBeInTheDocument();
  });

  it('filtra la lista por categoria desde el panel admin', () => {
    render(
      <ToastProvider>
        <ProductCRUD
          products={[
            createProduct({ id: '1', name: 'Tostada Clasica', category: 'tostadas' }),
            createProduct({ id: '2', name: 'Croissant', category: 'bolleria-dulce' }),
          ]}
          loading={false}
        />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /tostadas/i }));

    expect(screen.getByText('Tostada Clasica')).toBeInTheDocument();
    expect(screen.queryByText('Croissant')).not.toBeInTheDocument();
  });

  it('agrupa visualmente los productos por categoria con encabezados', () => {
    render(
      <ToastProvider>
        <ProductCRUD
          products={[
            createProduct({ id: '1', name: 'Tostada Clasica', category: 'tostadas' }),
            createProduct({ id: '2', name: 'Croissant', category: 'bolleria-dulce' }),
            createProduct({ id: '3', name: 'Napolitana', category: 'bolleria-dulce' }),
          ]}
          loading={false}
        />
      </ToastProvider>
    );

    expect(screen.getByRole('heading', { name: 'Tostadas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bollería dulce' })).toBeInTheDocument();
  });
});
