import React from 'react';
import { MenuProduct } from '../../types';

interface Props {
  products: MenuProduct[];
}

const ProductCRUD: React.FC<Props> = ({ products }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif text-cream">Productos</h3>
      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream font-semibold">{product.name}</p>
                <p className="text-cream/60 text-sm">{product.description}</p>
              </div>
              <button className="px-4 py-2 text-xs uppercase tracking-widest text-cream border border-caramel/40 rounded-full">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCRUD;
