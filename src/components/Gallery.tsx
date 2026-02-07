
import React from 'react';
import { GALLERY_ITEMS } from '../constants';
import { Reveal } from './ui/Reveal';
import { GalleryCarousel } from './ui/GalleryCarousel';

const Gallery: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="max-w-xl">
          <Reveal width="100%">
            <h2 className="text-caramel font-accent text-3xl mb-2 tracking-wide">Nuestra Galería</h2>
          </Reveal>
          <Reveal width="100%" delay={0.2}>
            <h3 className="text-4xl md:text-5xl font-serif text-cream font-bold">Sumérgete en nuestra atmósfera</h3>
          </Reveal>
        </div>

      </div>

      <GalleryCarousel className="grid-cols-4 gap-4 auto-rows-[200px]">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-3xl group h-full ${item.span || ''}`}
          >
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-full object-cover transition-all duration-[2000ms] ease-in-out group-hover:scale-110 img-unified"
              loading="lazy"
              decoding="async"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
              <span className="text-white font-serif italic text-xl border-b border-white/50 pb-2">
                {item.alt}
              </span>
            </div>
          </div>
        ))}
      </GalleryCarousel>
    </div>
  );
};

export default Gallery;
