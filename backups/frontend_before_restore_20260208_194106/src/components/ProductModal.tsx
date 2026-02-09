import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuProduct } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { getFallbackProductImage } from '../utils/error-handling';
import { ProductModalTabs, type ModalTab } from './ProductModalTabs';

interface ProductModalProps {
  product: MenuProduct | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('desc');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(Boolean(product));

  useEffect(() => {
    if (product) {
      setActiveTab('desc');
      closeButtonRef.current?.focus();
    }
  }, [product]);

  useEffect(() => {
    if (!product || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const titleId = `product-modal-title-${product.id}`;

  return createPortal(
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mb-20 md:mb-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/80 backdrop-blur-xl transition-opacity"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-espresso border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[600px]"
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white md:hidden border border-white/10 hover:bg-caramel transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 relative h-[250px] md:h-auto shrink-0 bg-coffee">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover img-unified scale-105"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackProductImage();
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-transparent md:bg-gradient-to-r"></div>

              <div className="absolute bottom-6 left-6 right-6 text-white md:hidden">
                <span className="bg-caramel/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block shadow-lg">
                  {product.category}
                </span>
                <h2 className="text-3xl font-bold font-serif leading-none tracking-tight">
                  {product.name}
                </h2>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col relative bg-espresso">
              <div className="hidden md:block pt-10 px-10 pb-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-caramel text-xs font-bold uppercase tracking-[0.25em]">
                    {product.category}
                  </span>
                  <button
                    onClick={onClose}
                    aria-label="Cerrar modal"
                    className="w-10 h-10 rounded-full bg-white/5 text-beige hover:bg-caramel hover:text-white transition-all duration-300 flex items-center justify-center border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 id={titleId} className="text-4xl font-bold text-cream font-serif mb-2 tracking-tight">
                  {product.name}
                </h2>
                <p className="text-2xl font-normal text-caramel font-serif">
                  {typeof product.price === 'number' ? `${product.price.toFixed(2)}€` : product.price}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scroll">
                <ProductModalTabs
                  product={product}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
                <div className="h-8 md:hidden"></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductModal;
