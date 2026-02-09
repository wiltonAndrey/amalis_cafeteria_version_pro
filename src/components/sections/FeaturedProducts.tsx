import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../constants';
import { ProductCard } from '../ui/ProductCard';
import { Reveal } from '../ui/Reveal';
import { ResponsiveCarouselGrid } from '../ui/MobileCarousel';
import { SectionHeading } from '../ui/SectionHeading';

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Reveal width="100%">
        <SectionHeading
          eyebrow="Nuestras Especialidades"
          title="Los 4"
          highlight="Pilares"
          description="Frescura diaria, paciencia infinita. Descubre los sabores que nos definen."
        />
      </Reveal>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product, idx) => (
          <Reveal key={product.id} delay={idx * 0.1} fullHeight width="100%">
            <ProductCard product={product} showPrice={false} onClick={() => navigate('/carta')} />
          </Reveal>
        ))}
      </ResponsiveCarouselGrid>

      <div className="mt-16 text-center">
        <Reveal width="100%" delay={0.6}>
          <Link to="/carta" className="text-cream font-bold text-lg inline-flex items-center gap-2 group cursor-pointer">
            Ver Carta Completa
            <span className="w-8 h-8 rounded-full bg-caramel/20 flex items-center justify-center text-caramel group-hover:translate-x-2 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
};

export default FeaturedProducts;
