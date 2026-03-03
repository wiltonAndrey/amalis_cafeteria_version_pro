import React, { useEffect, useMemo, useState } from 'react';
import { AdminMenuCategory, MenuCategory, MenuProduct } from '../../types';
import { ADMIN_MENU_CATEGORY_OPTIONS, normalizeAdminMenuCategory } from '../../utils/menu-categories';

export interface AdminProductFormData {
  id?: string;
  name: string;
  price: number;
  category: MenuCategory;
  sort_order?: number;
  description: string;
  chef_suggestion?: string;
  image: string;
  alt_text?: string;
  image_title?: string;
  ingredients: string[];
  allergens: string[];
  featured: boolean;
}

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: AdminProductFormData) => void | Promise<void>;
  product?: MenuProduct | null;
  isSaving?: boolean;
}

const DEFAULT_IMAGE = '/images/sections/pan-artesano-horneado.webp';

const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  isSaving = false,
}) => {
  const categories = useMemo(() => [...ADMIN_MENU_CATEGORY_OPTIONS], []);
  const defaultCategory = (categories[0]?.id ?? 'tostadas') as AdminMenuCategory;
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: defaultCategory,
    sort_order: '',
    description: '',
    chef_suggestion: '',
    image: '',
    alt_text: '',
    image_title: '',
    ingredients: '',
    allergens: '',
    featured: false,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm({
      name: product?.name ?? '',
      price: product?.price != null ? String(product.price) : '',
      category: normalizeAdminMenuCategory(product?.category, defaultCategory),
      sort_order: product?.sort_order != null ? String(product.sort_order) : '',
      description: product?.description ?? '',
      chef_suggestion: product?.chef_suggestion ?? '',
      image: product?.image ?? '',
      alt_text: product?.alt_text ?? '',
      image_title: product?.image_title ?? '',
      ingredients: product?.ingredients?.join(', ') ?? '',
      allergens: product?.allergens?.join(', ') ?? '',
      featured: Boolean(product?.featured),
    });
    setError(null);
  }, [isOpen, product, defaultCategory]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === 'featured' ? (event.target as HTMLInputElement).checked : event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      if (data.ok && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError('No se pudo subir la imagen. Intenta con otro archivo.');
    } finally {
      setUploading(false);
    }
  };

  const parseList = (value: string) =>
    value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(form.price);
    const rawSortOrder = form.sort_order.trim();
    const hasSortOrder = rawSortOrder !== '';
    const sortOrderValue = hasSortOrder ? Number(rawSortOrder) : null;

    if (!form.name.trim() || !form.description.trim() || !form.category || Number.isNaN(priceValue) || priceValue <= 0) {
      setError('Completa nombre, categoría, descripción y precio válido.');
      return;
    }

    if (
      hasSortOrder &&
      (
        Number.isNaN(sortOrderValue) ||
        !Number.isInteger(sortOrderValue) ||
        sortOrderValue === null ||
        sortOrderValue < 1
      )
    ) {
      setError('La posición en la categoría debe ser un número entero mayor que 0.');
      return;
    }

    const payload: AdminProductFormData = {
      id: product?.id,
      name: form.name.trim(),
      price: priceValue,
      category: form.category as MenuCategory,
      sort_order: sortOrderValue ?? undefined,
      description: form.description.trim(),
      chef_suggestion: form.chef_suggestion.trim(),
      image: form.image.trim() || DEFAULT_IMAGE,
      alt_text: form.alt_text.trim(),
      image_title: form.image_title.trim(),
      ingredients: parseList(form.ingredients),
      allergens: parseList(form.allergens),
      featured: Boolean(form.featured),
    };

    if (onSave) {
      await onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-espresso/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-product-modal-title"
      >
        <div className="absolute -top-32 -right-24 h-64 w-64 rounded-full bg-caramel/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        <div className="relative space-y-8 p-6 md:p-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-caramel/80">Panel</p>
              <h2 id="admin-product-modal-title" className="text-3xl font-serif text-cream">
                {product ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <p className="text-sm text-cream/60">
                Ajusta nombre, precio y detalles para mantener la carta siempre fresca.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cream/80 transition-all duration-200 hover:border-caramel/60 hover:text-cream motion-reduce:transition-none cursor-pointer"
            >
              Cerrar
            </button>
          </header>

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-espresso/60 p-5 shadow-lg shadow-black/20">
                <div className="space-y-4">
                  <label className="block space-y-2 text-sm text-cream/80">
                    <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Nombre</span>
                    <input
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="Coca de verduras"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                      required
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="block space-y-2 text-sm text-cream/80">
                      <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Precio</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange('price')}
                        placeholder="2.50"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                        required
                      />
                    </label>
                    <label className="block space-y-2 text-sm text-cream/80">
                      <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Categoría</span>
                      <select
                        value={form.category}
                        onChange={handleChange('category')}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                        required
                      >
                        {categories.map(item => (
                          <option key={item.id} value={item.id} className="bg-espresso text-cream">
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-2 text-sm text-cream/80">
                      <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Posición en la categoría</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={form.sort_order}
                        onChange={handleChange('sort_order')}
                        placeholder="1"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-espresso/60 p-5 shadow-lg shadow-black/20">
                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Descripción (SEO)</span>
                  <textarea
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe sabor, textura y propuesta."
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                    required
                  />
                  <span className="text-xs text-cream/40">Esta descripción ayuda al posicionamiento en buscadores.</span>
                </label>
              </div>

              <div className="rounded-2xl border border-white/10 bg-espresso/60 p-5 shadow-lg shadow-black/20">
                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Recomendación del chef</span>
                  <textarea
                    value={form.chef_suggestion}
                    onChange={handleChange('chef_suggestion')}
                    placeholder="Maridaje, sugerencia de servicio o combinacion recomendada."
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-espresso/60 p-5 shadow-lg shadow-black/20 space-y-4">
                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Imagen</span>
                  <div className="flex gap-2">
                    <input
                      value={form.image}
                      onChange={handleChange('image')}
                      placeholder="/images/uploads/producto.webp"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                    />
                    <label className="cursor-pointer rounded-xl border border-caramel/40 bg-caramel/10 px-4 py-3 text-caramel hover:bg-caramel/20 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                      {uploading ? '...' : 'Subir'}
                    </label>
                  </div>
                </label>

                {form.image && (
                  <div className="overflow-hidden rounded-xl border border-white/10 aspect-video">
                    <img
                      src={form.image}
                      alt={form.name || 'Vista previa del producto'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Texto Alternativo (SEO)</span>
                  <input
                    value={form.alt_text}
                    onChange={handleChange('alt_text')}
                    placeholder="Descripción breve de la imagen para Google"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                  />
                </label>

                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Título de la imagen (SEO)</span>
                  <input
                    value={form.image_title}
                    onChange={handleChange('image_title')}
                    placeholder="Título descriptivo para SEO"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                  />
                </label>

                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Ingredientes</span>
                  <input
                    value={form.ingredients}
                    onChange={handleChange('ingredients')}
                    placeholder="Harina, tomate, aceite"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                  />
                </label>

                <label className="block space-y-2 text-sm text-cream/80">
                  <span className="text-xs uppercase tracking-[0.3em] text-caramel/80">Alérgenos</span>
                  <input
                    value={form.allergens}
                    onChange={handleChange('allergens')}
                    placeholder="Gluten, lácteos"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-caramel/60 focus:outline-none focus:ring-2 focus:ring-caramel/30"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-white/10 bg-espresso/60 p-5 shadow-lg shadow-black/20">
                <label className="flex items-center justify-between gap-4 text-sm text-cream/80">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-caramel/80">Destacado</p>
                    <p className="text-xs text-cream/50">Aparece en la portada y sección especial.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleChange('featured')}
                    aria-label="Producto destacado"
                    className="h-4 w-4 cursor-pointer accent-caramel"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <p className="text-sm text-rose-200">{error ?? ' '}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.3em] text-cream/80 transition-all duration-200 hover:border-caramel/60 hover:text-cream motion-reduce:transition-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploading}
                  className="rounded-full bg-caramel px-6 py-2 text-xs uppercase tracking-[0.3em] text-brownie transition-all duration-200 hover:bg-honey disabled:opacity-60 motion-reduce:transition-none cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductModal;
