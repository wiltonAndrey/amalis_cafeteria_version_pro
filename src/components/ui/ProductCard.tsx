import React from 'react';
import { Badge } from './Badge';
import { CATEGORY_TRANSLATIONS } from '../../constants';
import { MenuProduct, Product } from '../../types';
import { getFallbackProductImage } from '../../utils/error-handling';

type ProductCardItem = Product | MenuProduct;

interface ProductCardProps {
  product: ProductCardItem;
  onClick?: (product: ProductCardItem) => void;
  showPrice?: boolean;
  aspectRatio?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, showPrice = true, aspectRatio = 'aspect-[16/9]' }) => {
  const imageUrl = 'imageUrl' in product ? product.imageUrl : product.image;
  const imageAlt = 'imageAlt' in product && product.imageAlt ? product.imageAlt : product.name;
  const priceDisplay = typeof product.price === 'number' ? `${product.price.toFixed(2)} EUR` : product.price;
  const categoryLabel = CATEGORY_TRANSLATIONS[product.category] || product.category;
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(product);
    }
  };

  return (
    <div
      onClick={() => onClick?.(product)}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 hover:border-caramel/40 hover:shadow-[0_30px_60px_-15px_rgba(196,167,125,0.25)] transition-all duration-500 h-full flex flex-col hover:-translate-y-2.5 active:scale-[0.98] ${isInteractive ? 'cursor-pointer' : ''}`}
    >
      <div className={`${aspectRatio} overflow-hidden relative`}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackProductImage();
          }}
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-espresso/80 backdrop-blur-md border-white/10 text-caramel uppercase tracking-widest text-[10px] py-1 px-3">
            {('badge' in product && product.badge) ? product.badge : categoryLabel}
          </Badge>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="bg-caramel text-white px-5 py-2.5 rounded-full flex items-center space-x-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">
              {('ctaLabel' in product && product.ctaLabel) ? product.ctaLabel : 'Ver detalles'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-transparent to-white/5">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="text-xl font-serif font-bold text-cream group-hover:text-caramel transition-colors tracking-tight">
            {product.name}
          </h3>
          {showPrice ? <span className="text-caramel font-black text-xl font-serif whitespace-nowrap">{priceDisplay}</span> : null}
        </div>
        <p className="text-beige/60 text-sm leading-relaxed flex-grow font-sans font-light">
          {product.description}
        </p>
      </div>
    </div>
  );
};
