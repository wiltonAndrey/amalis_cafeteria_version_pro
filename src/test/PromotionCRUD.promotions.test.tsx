import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromotionCRUD from '../components/admin/PromotionCRUD';

const baseCard = {
  id: '1',
  badge: 'Mananas',
  image: '/images/one.webp',
  image_alt: 'Alt',
  image_title: 'Title',
  title: 'Promo Admin',
  price: 3.5,
  description: 'Descripcion',
  items: ['Uno', 'Dos'],
  availability_text: 'Hoy',
  cta_label: 'Ver promo',
  cta_url: '/promo',
};

describe('PromotionCRUD', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promotionCards: [baseCard] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ok: true,
            promotionCard: { ...baseCard, title: 'Promo Editada' },
          }),
        }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders admin list and opens modal per card', async () => {
    const user = userEvent.setup();
    render(<PromotionCRUD />);

    await waitFor(() => expect(screen.getByText('Promo Admin')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /editar promocion/i }));
    expect(screen.getByRole('heading', { name: /editar promocion/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/badge/i)).toHaveValue('Mananas');
    expect(screen.getByLabelText(/titulo/i)).toHaveValue('Promo Admin');
  });

  it('updates promotion from modal form', async () => {
    const user = userEvent.setup();
    render(<PromotionCRUD />);

    await waitFor(() => expect(screen.getByText('Promo Admin')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /editar promocion/i }));

    const titleInput = screen.getByLabelText(/titulo/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Promo Editada');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => expect(screen.getByText('Promo Editada')).toBeInTheDocument());

    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/promotions/update.php',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PromotionCRUD />);

    await waitFor(() => expect(screen.getByText('Promo Admin')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /editar promocion/i }));
    expect(screen.getByRole('heading', { name: /editar promocion/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^cerrar$/i }));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /editar promocion/i })).not.toBeInTheDocument();
    });
  });

  it('keeps local update and closes modal when update endpoint returns invalid json', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ promotionCards: [baseCard] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('invalid_json');
          },
        }),
    );

    render(<PromotionCRUD />);
    await waitFor(() => expect(screen.getByText('Promo Admin')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /editar promocion/i }));

    const titleInput = screen.getByLabelText(/titulo/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Promo Local');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /editar promocion/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Promo Local')).toBeInTheDocument();
  });
});
