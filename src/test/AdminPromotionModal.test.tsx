import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminPromotionModal from '../components/admin/AdminPromotionModal';
import type { PromotionCard } from '../types';

const baseCard: PromotionCard = {
  id: 'p-1',
  badge: 'Top',
  image: '/images/original.webp',
  image_alt: 'Alt',
  image_title: 'Title',
  title: 'Promo',
  price: 4.5,
  description: 'Desc',
  items: ['Uno'],
  availability_text: 'Hoy',
  cta_url: '/promo',
  cta_label: 'Ver',
};

describe('AdminPromotionModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads image with local fallback when upload endpoint fails', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('upload_missing')));

    render(
      <AdminPromotionModal
        open={true}
        card={baseCard}
        saving={false}
        onClose={() => undefined}
        onSave={() => undefined}
      />,
    );

    const file = new File(['image-content'], 'promo.png', { type: 'image/png' });
    const uploadInput = screen.getByLabelText(/subir imagen de promocion/i);
    await user.upload(uploadInput, file);

    await waitFor(() => {
      const imageInput = screen.getByLabelText(/url de imagen de promocion/i) as HTMLInputElement;
      expect(imageInput.value).toMatch(/^data:image\/png;base64,/);
    });
  });
});
