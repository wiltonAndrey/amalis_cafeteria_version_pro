import React from 'react';
import { PRODUCTS, FEATURED_PRODUCTS_SECTION } from '../../constants';
import { ProductCard } from '../ui/ProductCard';
import { Reveal } from '../ui/Reveal';
import { ResponsiveCarouselGrid } from '../ui/MobileCarousel';
import { SectionHeading } from '../ui/SectionHeading';

const FeaturedProducts: React.FC = () => {
  const goToMenu = () => {
    window.location.assign('/carta');
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Reveal width="100%">
        <SectionHeading
          eyebrow={FEATURED_PRODUCTS_SECTION.eyebrow}
          title={FEATURED_PRODUCTS_SECTION.title}
          highlight={FEATURED_PRODUCTS_SECTION.highlight}
          description={FEATURED_PRODUCTS_SECTION.description}
        />
      </Reveal>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8" desktopMode="carousel">
        {PRODUCTS.map((product, idx) => (
          <Reveal key={product.id} delay={idx * 0.1} fullHeight width="100%">
            <ProductCard product={product} showPrice={false} onClick={goToMenu} aspectRatio="aspect-[4/3]" />
          </Reveal>
        ))}
      </ResponsiveCarouselGrid>

      <div className="mt-16 text-center">
        <Reveal width="100%" delay={0.6}>
          <a href="/carta" className="text-cream font-bold text-lg inline-flex items-center gap-2 group cursor-pointer hover:text-caramel transition-colors">
            {FEATURED_PRODUCTS_SECTION.ctaFooter}
            <span className="w-8 h-8 rounded-full bg-caramel/20 flex items-center justify-center text-caramel group-hover:translate-x-2 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </Reveal>
      </div>
    </div>
  );
};

export default FeaturedProducts;
