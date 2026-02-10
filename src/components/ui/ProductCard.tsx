import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Badge } from './Badge';
import { CATEGORY_TRANSLATIONS } from '../../constants';
import { MenuProduct, Product } from '../../types';
import { getFallbackProductImage } from '../../utils/error-handling';

type ProductCardItem = Product | MenuProduct;

interface ProductCardProps {
  product: ProductCardItem;
  onClick?: (product: ProductCardItem) => void;
  showPrice?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, showPrice = true }) => {
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
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={() => onClick?.(product)}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 hover:border-caramel/40 hover:shadow-[0_30px_60px_-15px_rgba(196,167,125,0.25)] transition-all duration-500 h-full flex flex-col ${isInteractive ? 'cursor-pointer' : ''}`}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
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
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {('ctaLabel' in product && product.ctaLabel) ? product.ctaLabel : 'Ver detalles'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-transparent to-white/5">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h4 className="text-xl font-serif font-bold text-cream group-hover:text-caramel transition-colors tracking-tight">
            {product.name}
          </h4>
          {showPrice ? <span className="text-caramel font-black text-xl font-serif whitespace-nowrap">{priceDisplay}</span> : null}
        </div>
        <p className="text-beige/60 text-sm leading-relaxed flex-grow font-sans font-light">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};
