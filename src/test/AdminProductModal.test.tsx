import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import AdminProductModal from '../components/admin/AdminProductModal';
import type { MenuProduct } from '../types';

type EditableMenuProduct = MenuProduct & { chef_suggestion?: string };

const createProduct = (overrides: Partial<EditableMenuProduct> = {}): EditableMenuProduct => ({
  id: '1',
  name: 'Tostada Chef',
  price: 3.2,
  price_unit: 'unit',
  category: 'tostadas',
  sort_order: 2,
  description: 'Descripcion de prueba',
  image: '/images/test-product.webp',
  ingredients: ['Pan'],
  allergens: ['Gluten'],
  featured: false,
  alt_text: 'Texto alternativo',
  image_title: 'Titulo SEO actual',
  chef_suggestion: 'Acompanarla con cafe solo',
  ...overrides,
});

describe('AdminProductModal', () => {
  it('muestra image_title y chef_suggestion al editar un producto', () => {
    render(
      <AdminProductModal
        isOpen={true}
        onClose={() => {}}
        product={createProduct()}
      />
    );

    expect(screen.getByLabelText(/título de la imagen/i)).toHaveValue('Titulo SEO actual');
    expect(screen.getByLabelText(/recomendación del chef/i)).toHaveValue('Acompanarla con cafe solo');
    expect(screen.getByLabelText(/posición en la categoría/i)).toHaveValue(2);
    expect(screen.getByLabelText(/unidad de precio/i)).toHaveValue('unit');
  });

  it('envia image_title, chef_suggestion y sort_order al guardar', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <AdminProductModal
        isOpen={true}
        onClose={() => {}}
        onSave={onSave}
        product={createProduct({ image_title: '', chef_suggestion: '' })}
      />
    );

    fireEvent.change(screen.getByLabelText(/título de la imagen/i), {
      target: { value: 'Nuevo titulo SEO' },
    });
    fireEvent.change(screen.getByLabelText(/recomendación del chef/i), {
      target: { value: 'Servir con mermelada casera' },
    });
    fireEvent.change(screen.getByLabelText(/posición en la categoría/i), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByLabelText(/unidad de precio/i), {
      target: { value: 'kg' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        image_title: 'Nuevo titulo SEO',
        chef_suggestion: 'Servir con mermelada casera',
        price_unit: 'kg',
        sort_order: 4,
      })
    );
  });

  it('precarga kg al editar productos por kilo', () => {
    render(
      <AdminProductModal
        isOpen={true}
        onClose={() => {}}
        product={createProduct({ name: 'Bizcocho de Naranja', category: 'pasteleria', price_unit: 'kg' })}
      />
    );

    expect(screen.getByLabelText(/unidad de precio/i)).toHaveValue('kg');
  });
});
