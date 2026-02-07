import React from 'react';
import { Eye, Star } from 'lucide-react';
import { MenuProduct } from '../types';
import { getFallbackProductImage } from '../utils/error-handling';

interface ProductCardProps {
  product: MenuProduct;
  onClick: (product: MenuProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isRemoteImage = /^https?:\/\//.test(product.image);
  const optimizedImage = isRemoteImage
    ? `${product.image}${product.image.includes('?') ? '&' : '?'}w=600&q=75&fm=webp`
    : product.image;

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      aria-label={`Ver detalles de ${product.name}`}
      className="group bg-white/5 backdrop-blur-md rounded-3xl p-4 border border-white/10 overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 text-left"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--color-secondary)]">
        <img
          src={optimizedImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 img-unified"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackProductImage();
          }}
        />

        {product.featured && (
          <div className="absolute top-4 left-4 bg-[var(--color-espresso)]/90 backdrop-blur-md border border-white/10 text-[var(--color-caramel)] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center">
            <Star className="w-3 h-3 mr-2" />
            Favorito
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4 flex justify-between items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
          <div className="bg-[var(--color-espresso)] text-[var(--color-cream)] font-bold px-4 py-2 rounded-xl text-sm shadow-xl border border-white/10">
            {product.price.toFixed(2)}€
          </div>
          <div className="w-10 h-10 bg-[var(--color-caramel)] text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-espresso)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      </div>

      <div className="pt-6 pb-2 px-2 text-center">
        <div className="text-[var(--color-caramel)] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 opacity-90">
          {product.category}
        </div>
        <h3 className="text-xl font-bold text-[var(--color-cream)] font-serif mb-3 group-hover:text-[var(--color-caramel)] transition-colors tracking-wide leading-tight">
          {product.name}
        </h3>
        <p className="text-[var(--color-beige)]/70 text-sm font-sans font-light leading-relaxed px-2 line-clamp-2">
          {product.description}
        </p>
      </div>
    </button>
  );
};

export default ProductCard;
