import React, { useState } from 'react';
import { MENU_CATEGORIES } from '../../constants';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../hooks/useProducts';
import { MenuProduct, VisibleMenuCategory } from '../../types';
import { normalizeMenuCategory } from '../../utils/menu-categories';
import { groupMenuProductsForAllView } from '../../utils/menu-products';
import AdminProductModal, { AdminProductFormData } from './AdminProductModal';

interface Props {
  products: MenuProduct[];
  loading?: boolean;
}

const CATEGORY_LABELS = new Map(
  MENU_CATEGORIES.filter((category) => category.id !== 'all').map((category) => [category.id, category.label])
);

const getProductCountLabel = (count: number): string => {
  return `${count} producto${count === 1 ? '' : 's'}`;
};

const getProductCategoryLabel = (product: MenuProduct): string => {
  const normalizedCategory = normalizeMenuCategory(product.category);

  if (normalizedCategory && normalizedCategory !== 'all') {
    return CATEGORY_LABELS.get(normalizedCategory) ?? normalizedCategory;
  }

  return product.category;
};

const ProductCRUD: React.FC<Props> = ({ products, loading = false }) => {
  const { items, isMutating, loading: hookLoading, createProduct, updateProduct, deleteProduct } = useProducts(products);
  const [activeProduct, setActiveProduct] = useState<MenuProduct | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<VisibleMenuCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const isLoading = loading || hookLoading;
  const visibleItems = activeCategoryFilter === 'all'
    ? items
    : items.filter((product) => normalizeMenuCategory(product.category) === activeCategoryFilter);
  const groupedVisibleItems = groupMenuProductsForAllView(visibleItems);
  const productCountLabel = getProductCountLabel(visibleItems.length);

  const openCreate = () => {
    setActiveProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product: MenuProduct) => {
    setActiveProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: AdminProductFormData) => {
    try {
      if (payload.id) {
        await updateProduct(payload);
        showToast('success', 'Producto actualizado.');
      } else {
        await createProduct(payload);
        showToast('success', 'Producto creado.');
      }
      setIsModalOpen(false);
    } catch {
      showToast('error', 'No se pudo guardar el producto.');
    }
  };

  const handleDelete = async (productId: string) => {
    const confirmed = typeof window !== 'undefined' ? window.confirm('Seguro que deseas borrar este producto?') : true;
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      showToast('success', 'Producto eliminado.');
    } catch {
      showToast('error', 'No se pudo eliminar el producto.');
    }
  };

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-serif text-cream">Productos</h3>
            <span className="rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-caramel">
              {productCountLabel}
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-cream/60">
            Crea, edita y reordena la carta con una lista clara, precios visibles y acciones separadas del contenido.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-caramel px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brownie transition-all duration-200 hover:bg-honey cursor-pointer"
        >
          Nuevo producto
        </button>
      </div>

      {!isLoading && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryFilter(category.id)}
              aria-pressed={activeCategoryFilter === category.id}
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 cursor-pointer ${
                activeCategoryFilter === category.id
                  ? 'border-caramel bg-caramel/15 text-caramel'
                  : 'border-white/10 bg-white/[0.03] text-cream/70 hover:border-white/20 hover:text-cream'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              data-testid="product-skeleton"
              className="rounded-3xl border border-white/10 bg-white/5 p-5 animate-pulse"
            >
              <div className="h-4 w-2/3 rounded-full bg-white/10" />
              <div className="mt-3 h-3 w-full rounded-full bg-white/10" />
              <div className="mt-2 h-3 w-5/6 rounded-full bg-white/10" />
              <div className="mt-4 flex gap-2">
                <span className="h-6 w-20 rounded-full bg-white/10" />
                <span className="h-6 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          ))}

        {!isLoading && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
            <p className="text-lg font-serif text-cream">Aun no hay productos</p>
            <p className="mt-2 text-sm text-cream/60">
              Crea el primer producto para empezar a gestionar la carta.
            </p>
            <button
              onClick={openCreate}
              className="mt-4 rounded-full border border-caramel/40 px-5 py-2 text-xs uppercase tracking-[0.3em] text-caramel transition-all duration-200 hover:border-caramel hover:text-cream cursor-pointer"
            >
              Crear producto
            </button>
          </div>
        )}

        {!isLoading && items.length > 0 && visibleItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-caramel">Sin resultados</p>
            <p className="mt-2 text-sm text-cream/60">No hay productos en la categoría seleccionada.</p>
          </div>
        )}

        {!isLoading && visibleItems.length > 0 && (
          <div role="list" aria-label="Lista de productos" className="space-y-8">
            {groupedVisibleItems.map((group) => (
              <section key={group.category} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-caramel/80">Categoria</p>
                    <h4 className="text-xl font-serif text-cream">{group.label}</h4>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/65">
                    {getProductCountLabel(group.products.length)}
                  </span>
                </div>

                <div className="grid gap-4">
                  {group.products.map((product) => (
                    <article
                      key={product.id}
                      role="listitem"
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <p className="text-lg font-semibold leading-tight text-cream">{product.name}</p>
                                <p className="text-sm leading-relaxed text-cream/65">{product.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/70">
                                <span className="rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-caramel">
                                  {getProductCategoryLabel(product)}
                                </span>
                                {typeof product.sort_order === 'number' && (
                                  <span className="rounded-full border border-white/10 px-3 py-1 text-cream/75">
                                    Orden {product.sort_order}
                                  </span>
                                )}
                                {product.featured && (
                                  <span className="rounded-full border border-caramel/50 bg-caramel/20 px-3 py-1 text-caramel">
                                    Destacado
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 md:w-auto md:min-w-[140px]">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/45">Precio</p>
                              <p className="mt-2 text-xl font-semibold text-cream">{product.price.toFixed(2)} EUR</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 lg:w-[220px] lg:flex-col lg:items-stretch">
                          <button
                            onClick={() => openEdit(product)}
                            className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-cream border border-caramel/40 rounded-full transition-all duration-200 hover:border-caramel hover:text-white cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-rose-200 border border-rose-400/40 rounded-full transition-all duration-200 hover:border-rose-400 hover:text-rose-100 cursor-pointer"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={activeProduct ?? undefined}
        isSaving={isMutating}
      />
    </section>
  );
};

export default ProductCRUD;
