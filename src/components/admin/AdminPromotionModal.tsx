import React, { useEffect, useState } from 'react';
import type { PromotionCard } from '../../types';
import type { PromotionUpdateInput } from '../../hooks/usePromotionAdmin';

interface Props {
  open: boolean;
  card: PromotionCard | null;
  saving: boolean;
  onClose: () => void;
  onSave: (input: PromotionUpdateInput) => Promise<void> | void;
}

const createEmptyCard = (): PromotionCard => ({
  id: '',
  badge: '',
  image: '',
  image_alt: '',
  image_title: '',
  title: '',
  price: 0,
  description: '',
  items: [''],
  availability_text: '',
  cta_url: '',
  cta_label: '',
});

const AdminPromotionModal: React.FC<Props> = ({ open, card, saving, onClose, onSave }) => {
  const [form, setForm] = useState<PromotionCard>(createEmptyCard());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setForm({
        ...card,
        items: card.items.length > 0 ? card.items : [''],
      });
      setError(null);
    }
  }, [card]);

  if (!open || !card) {
    return null;
  }

  const updateField = <K extends keyof PromotionCard>(key: K, value: PromotionCard[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) => (idx === index ? value : item)),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, ''] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => {
      const items = prev.items.filter((_, idx) => idx !== index);
      return { ...prev, items: items.length > 0 ? items : [''] };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const normalizedItems = form.items.map((item) => item.trim()).filter(Boolean);
    if (normalizedItems.length === 0) {
      setError('Debes agregar al menos un item.');
      return;
    }
    await onSave({
      ...form,
      price: Number(form.price),
      items: normalizedItems,
    });
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('file_read_failed'));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append('image', file);
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body,
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload?.ok && typeof payload?.url === 'string' && payload.url !== '') {
        updateField('image', payload.url);
      } else {
        const dataUrl = await fileToDataUrl(file);
        if (dataUrl) {
          updateField('image', dataUrl);
        }
      }
    } catch (_error) {
      try {
        const dataUrl = await fileToDataUrl(file);
        if (dataUrl) {
          updateField('image', dataUrl);
        }
      } catch {
        setError('No se pudo cargar la imagen.');
      }
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 p-4 overflow-y-auto">
      <button
        type="button"
        aria-label="Cerrar modal de promocion"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative max-w-3xl mx-auto bg-[var(--color-espresso)] border border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-serif text-cream">Editar promocion</h4>
          <button type="button" className="text-sm text-cream/70 cursor-pointer" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Badge</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.badge} onChange={(event) => updateField('badge', event.target.value)} />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Titulo</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Precio</span>
            <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.price} onChange={(event) => updateField('price', Number(event.target.value))} />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Imagen</span>
            <div className="flex gap-2">
              <input
                aria-label="URL de imagen de promocion"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                value={form.image}
                onChange={(event) => updateField('image', event.target.value)}
              />
              <label className="px-4 py-3 border border-caramel/40 rounded-xl text-caramel text-xs uppercase tracking-widest cursor-pointer">
                <input
                  aria-label="Subir imagen de promocion"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading ? 'Subiendo' : 'Subir'}
              </label>
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Image alt</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.image_alt} onChange={(event) => updateField('image_alt', event.target.value)} />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Image title</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.image_title} onChange={(event) => updateField('image_title', event.target.value)} />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-xs uppercase tracking-widest text-cream/70">Descripcion</span>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 min-h-24" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>

          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-cream/70">Items</span>
              <button type="button" onClick={addItem} className="text-xs text-caramel">
                Agregar item
              </button>
            </div>
            {form.items.map((item, index) => (
              <div className="flex gap-2" key={`${form.id}-item-${index}`}>
                <input
                  aria-label={`Item ${index + 1}`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                  value={item}
                  onChange={(event) => updateItem(index, event.target.value)}
                />
                <button type="button" className="px-3 border border-white/10 rounded-xl text-cream/70" onClick={() => removeItem(index)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">Availability text</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.availability_text} onChange={(event) => updateField('availability_text', event.target.value)} />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-cream/70">CTA label</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.cta_label} onChange={(event) => updateField('cta_label', event.target.value)} />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-xs uppercase tracking-widest text-cream/70">CTA URL</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3" value={form.cta_url} onChange={(event) => updateField('cta_url', event.target.value)} />
          </label>

          <div className="md:col-span-2 flex justify-end pt-2">
            {error && <p className="mr-auto text-sm text-red-300">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-5 py-3 rounded-xl border border-white/10 text-cream/80 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-5 py-3 rounded-xl bg-caramel text-coffee font-bold disabled:opacity-60 cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPromotionModal;
