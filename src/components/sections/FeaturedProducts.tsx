
import React from 'react';
import { PRODUCTS } from '../../constants';
import { ProductCard } from '../ui/ProductCard';
import { Reveal } from '../ui/Reveal';
import { ResponsiveCarouselGrid } from '../ui/MobileCarousel';

const FeaturedProducts: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <Reveal width="100%">
          <h2 className="text-caramel font-accent text-3xl mb-2 tracking-wide">Nuestras Especialidades</h2>
        </Reveal>
        <Reveal width="100%" delay={0.3}>
          <h3 className="text-4xl md:text-6xl font-serif text-cream font-bold tracking-tight">Los 4 Pilares</h3>
        </Reveal>
        <Reveal width="100%" delay={0.5}>
          <p className="mt-4 text-cream/70 max-w-lg mx-auto text-lg">
            Frescura diaria, paciencia infinita. Descubre los sabores que nos definen.
          </p>
        </Reveal>
      </div>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product, idx) => (
          <Reveal key={product.id} delay={idx * 0.1} fullHeight width="100%">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </ResponsiveCarouselGrid>

      <div className="mt-16 text-center">
        <Reveal width="100%" delay={0.6}>
          <button className="text-cream font-bold text-lg inline-flex items-center gap-2 group cursor-pointer">
            Ver Carta Completa
            <span className="w-8 h-8 rounded-full bg-caramel/20 flex items-center justify-center text-caramel group-hover:translate-x-2 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </Reveal>
      </div>
    </div>
  );
};

export default FeaturedProducts;
