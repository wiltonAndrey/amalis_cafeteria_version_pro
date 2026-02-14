import React from 'react';
import { TESTIMONIALS, TESTIMONIALS_SECTION } from '../constants';
import { Reveal } from './ui/Reveal';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';
import { SectionHeading } from './ui/SectionHeading';

const Testimonials: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <Reveal width="100%">
        <SectionHeading
          title={TESTIMONIALS_SECTION.title}
          highlight={TESTIMONIALS_SECTION.highlight}
          description={TESTIMONIALS_SECTION.description}
        />
      </Reveal>

      <div className="relative group/slider">
        <ResponsiveCarouselGrid className="md:grid-cols-3 gap-8" desktopMode="carousel">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.id} delay={index * 0.15} width="100%">
              <div
                className="group relative mt-14 bg-white/5 hover:bg-white/10 backdrop-blur-md p-7 pb-8 rounded-[2rem] shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] border border-white/10 hover:border-emerald-600/30 transition-all duration-500 pt-20 flex flex-col h-auto min-h-[420px] hover:-translate-y-2.5"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-600/90 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                      <img
                        src={t.avatarUrl}
                        alt={t.avatarAlt || t.name}
                        title={t.avatarTitle || t.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={96}
                        height={96}
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-caramel text-white p-1.5 rounded-full shadow-md border-2 border-transparent group-hover:bg-brownie transition-colors duration-300">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-caramel mb-5 flex justify-center gap-1.5 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current drop-shadow-sm"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div className="relative z-10 flex-grow flex items-center justify-center">
                  <p className="text-cream/80 font-serif italic text-center mb-7 leading-relaxed text-lg px-1 group-hover:text-cream transition-colors duration-300">
                    "{t.content}"
                  </p>
                </div>

                <div className="text-center border-t border-white/10 pt-6 mt-auto">
                  <p className="font-bold text-cream uppercase tracking-widest text-sm mb-2 group-hover:text-caramel transition-colors duration-300">{t.name}</p>
                  <p className="text-caramel/80 text-xs font-bold tracking-widest uppercase">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ResponsiveCarouselGrid>
      </div>
    </div>
  );
};

export default Testimonials;
