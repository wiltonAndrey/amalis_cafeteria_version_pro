import React from 'react';
import { TESTIMONIALS, TESTIMONIALS_SECTION } from '../constants';
import { Reveal } from './ui/Reveal';
import { motion } from 'framer-motion';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';
import { SectionHeading } from './ui/SectionHeading';

const Testimonials: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollPosition = container.scrollLeft;
      // Approximate item width including gap
      const itemWidth = container.clientWidth * 0.85;
      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(Math.max(0, index), TESTIMONIALS.length - 1));
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Adjust scroll amount as needed
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-emerald-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-emerald-500 hover:scale-110 focus:outline-none hidden md:block"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-emerald-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-emerald-500 hover:scale-110 focus:outline-none hidden md:block"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-stretch overflow-x-auto gap-6 pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory touch-pan-x"
        >
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -10 }}
              className="flex-shrink-0 w-[85vw] md:w-[450px] lg:w-[32%] snap-center group relative mt-14 bg-white/5 hover:bg-white/10 backdrop-blur-md p-7 pb-8 rounded-[2rem] shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(196,167,125,0.15)] border border-white/10 hover:border-caramel/30 transition-all duration-500 pt-20 flex flex-col h-auto min-h-[420px]"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white/10 shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-emerald-600/90 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                    <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-caramel text-white p-1.5 rounded-full shadow-md border-2 border-transparent group-hover:bg-brownie transition-colors duration-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
                    className="w-5 h-5 fill-current drop-shadow-sm"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              <div className="relative z-10 flex-grow flex items-center justify-center">
                <p className="text-cream/80 font-serif italic text-center mb-7 leading-relaxed text-lg px-1 group-hover:text-cream transition-colors duration-300">
                  "{t.content}"
                </p>
              </div>

              <div className="text-center border-t border-white/10 pt-6 mt-auto">
                <h5 className="font-bold text-cream uppercase tracking-widest text-sm mb-2 group-hover:text-caramel transition-colors duration-300">{t.name}</h5>
                <p className="text-caramel/80 text-xs font-bold tracking-widest uppercase">{t.role}</p>
              </div>
            </motion.div>
          ))}
          {/* Spacer for last item */}
          <div className="flex-shrink-0 w-4 snap-center" aria-hidden="true" />
        </div>

        {/* Mobile Indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-caramel' : 'w-1.5 bg-caramel/30'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
