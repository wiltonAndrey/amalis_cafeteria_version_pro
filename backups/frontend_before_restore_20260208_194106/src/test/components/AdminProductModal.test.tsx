import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminProductModal from '../../components/admin/AdminProductModal';

describe('AdminProductModal', () => {
  it('renders form fields', () => {
    render(<AdminProductModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripcion/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('calls onSave with form data', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<AdminProductModal isOpen={true} onClose={() => {}} onSave={onSave} />);

    await user.clear(screen.getByLabelText(/nombre/i));
    await user.type(screen.getByLabelText(/nombre/i), 'Cafe intenso');
    await user.clear(screen.getByLabelText(/precio/i));
    await user.type(screen.getByLabelText(/precio/i), '2.75');
    await user.type(screen.getByLabelText(/descripcion/i), 'Cafe de especialidad');

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Cafe intenso',
        price: 2.75,
        description: 'Cafe de especialidad',
      })
    );
  });
});
