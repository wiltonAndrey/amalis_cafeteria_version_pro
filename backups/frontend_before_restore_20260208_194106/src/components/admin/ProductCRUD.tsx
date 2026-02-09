import React, { useState } from 'react';
import { MenuProduct } from '../../types';
import AdminProductModal, { AdminProductFormData } from './AdminProductModal';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';

interface Props {
  products: MenuProduct[];
  loading?: boolean;
}

const ProductCRUD: React.FC<Props> = ({ products, loading = false }) => {
  const { items, isMutating, loading: hookLoading, createProduct, updateProduct, deleteProduct } = useProducts(products);
  const [activeProduct, setActiveProduct] = useState<MenuProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const isLoading = loading || hookLoading;

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
    } catch (error) {
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
    } catch (error) {
      showToast('error', 'No se pudo eliminar el producto.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-cream">Productos</h3>
          <p className="text-sm text-cream/60">Crea, edita y gestiona la carta en tiempo real.</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-caramel px-5 py-2 text-xs uppercase tracking-[0.3em] text-brownie transition-all duration-200 hover:bg-honey cursor-pointer"
        >
          Nuevo producto
        </button>
      </div>

      <div className="grid gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              data-testid="product-skeleton"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse"
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
            <p className="text-lg font-serif text-cream">Aún no hay productos</p>
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

        {!isLoading &&
          items.map(product => (
            <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-[220px] space-y-2">
                  <p className="text-cream font-semibold">{product.name}</p>
                  <p className="text-cream/60 text-sm">{product.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-cream/60">
                    <span className="rounded-full border border-caramel/30 px-2 py-1 uppercase tracking-[0.2em]">
                      {product.category}
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-1">
                      {product.price.toFixed(2)} EUR
                    </span>
                    {product.featured && (
                      <span className="rounded-full border border-caramel/50 bg-caramel/20 px-2 py-1">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openEdit(product)}
                    className="px-4 py-2 text-xs uppercase tracking-widest text-cream border border-caramel/40 rounded-full transition-all duration-200 hover:border-caramel hover:text-white cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 text-xs uppercase tracking-widest text-rose-200 border border-rose-400/40 rounded-full transition-all duration-200 hover:border-rose-400 hover:text-rose-100 cursor-pointer"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={activeProduct ?? undefined}
        isSaving={isMutating}
      />
    </div>
  );
};

export default ProductCRUD;

