import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminProductModal from '../components/admin/AdminProductModal';
import type { MenuCategoryAdminItem, MenuProduct } from '../types';

const baseProduct: MenuProduct = {
  id: 'prod-1',
  name: 'Napolitana',
  price: 3.5,
  category: 'bolleria_salada',
  description: 'Descripcion',
  image: '/images/uploads/original.png',
  alt_text: 'Alt',
  image_title: 'Title',
  chef_suggestion: 'Chef',
  ingredients: ['harina'],
  allergens: ['gluten'],
  featured: false,
};

describe('AdminProductModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sube imagen de producto con contexto product y actualiza URL/preview', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        url: '/images/products/napolitana-jamon-york.jpg',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(
      <AdminProductModal
        isOpen={true}
        product={baseProduct}
        isSaving={false}
        onClose={() => undefined}
        onSave={() => undefined}
      />,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(fileInput).not.toBeNull();

    const file = new File(['fake-image'], 'Napolitana Jamón York.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput as HTMLInputElement, file);

    await waitFor(() => {
      expect(screen.getByDisplayValue('/images/products/napolitana-jamon-york.jpg')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/upload.php',
      expect.objectContaining({
        method: 'POST',
      }),
    );

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(requestInit?.body).toBeInstanceOf(FormData);

    const body = requestInit?.body as FormData;
    expect(body.get('type')).toBe('product');
    expect(body.get('image')).toBe(file);

    const preview = screen.getByAltText('Napolitana') as HTMLImageElement;
    expect(preview.getAttribute('src')).toBe('/images/products/napolitana-jamon-york.jpg');
  });

  it('usa categorias administrables pasadas por props (no solo constantes hardcodeadas)', () => {
    const adminCategories: MenuCategoryAdminItem[] = [
      { id: 'all', slug: 'all', label: 'Todos', sort_order: 0, active: true, visible_in_menu: true, is_system: true },
      { id: 'bocadillos', slug: 'bocadillos', label: 'Bocadillos', sort_order: 10, active: true, visible_in_menu: true },
      { id: 'bebidas', slug: 'bebidas', label: 'Bebidas', sort_order: 20, active: true, visible_in_menu: true },
    ];

    render(
      <AdminProductModal
        isOpen={true}
        product={baseProduct}
        categories={adminCategories}
        isSaving={false}
        onClose={() => undefined}
        onSave={() => undefined}
      />,
    );

    expect(screen.getByRole('option', { name: 'Bocadillos' })).toBeInTheDocument();
  });
});
