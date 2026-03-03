import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, Info, ChevronRight } from 'lucide-react';
import type { MenuProduct } from '../types';

export type ModalTab = 'desc' | 'ing' | 'ale';

interface ProductModalTabsProps {
  product: MenuProduct;
  activeTab: ModalTab;
  onTabChange: (tab: ModalTab) => void;
}

const TAB_LABELS: Record<ModalTab, string> = {
  desc: 'Descripci\u00f3n',
  ing: 'Ingredientes',
  ale: 'Al\u00e9rgenos',
};

const DEFAULT_CHEF_SUGGESTION =
  'Consejo rapido: mejor recien hecho para disfrutar su punto.';

const ALLERGEN_TRACE_NOTE =
  'Informaci\u00f3n sobre trazas: Puede contener trazas de frutos secos, s\u00e9samo y soja debido al proceso artesanal. Por favor, consulte a nuestro personal si tiene alguna duda grave.';

const decodeEscapedUnicode = (value?: string) =>
  value?.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))) ?? '';

export const ProductModalTabs: React.FC<ProductModalTabsProps> = ({
  product,
  activeTab,
  onTabChange,
}) => {
  const chefSuggestion = decodeEscapedUnicode(product.chef_suggestion?.trim()) || DEFAULT_CHEF_SUGGESTION;

  return (
    <>
      <div className="flex space-x-1 bg-white/[0.03] p-1 rounded-2xl mb-8 border border-white/5">
        {(Object.keys(TAB_LABELS) as ModalTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              flex-1 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500
              ${activeTab === tab
                ? 'bg-caramel text-white shadow-lg scale-105'
                : 'text-beige/40 hover:text-beige/70 hover:bg-white/5'
              }
            `}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="min-h-[150px]">
        <AnimatePresence mode="wait">
          {activeTab === 'desc' && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <p className="text-beige/70 leading-relaxed font-light font-sans text-sm md:text-base">
                {decodeEscapedUnicode(product.description)}
              </p>

              <div className="p-6 bg-caramel/5 rounded-2xl border border-caramel/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Lightbulb className="w-12 h-12 text-caramel" />
                </div>
                <h4 className="flex items-center text-cream font-bold mb-3 font-serif">
                  <Lightbulb className="w-5 h-5 text-caramel mr-3" />
                  Sugerencia del Chef
                </h4>
                <p className="text-sm text-beige/50 font-sans font-light leading-relaxed">
                  {chefSuggestion}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'ing' && (
            <motion.div
              key="ing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-3"
            >
              {product.ingredients?.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-center text-beige/80 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-caramel/20 transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 text-caramel mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-light tracking-wide">{decodeEscapedUnicode(ing)}</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'ale' && (
            <motion.div
              key="ale"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-wrap gap-3">
                {product.allergens?.map((ale, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-cta/10 text-cta px-5 py-2.5 rounded-xl text-xs font-bold border border-cta/20 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {decodeEscapedUnicode(ale)}
                  </span>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-3">
                <Info className="w-5 h-5 text-beige/30 shrink-0 mt-0.5" />
                <p className="text-[11px] text-beige/40 italic font-light leading-relaxed">
                  {ALLERGEN_TRACE_NOTE}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
