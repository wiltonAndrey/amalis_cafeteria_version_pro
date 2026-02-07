import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Reveal } from './ui/Reveal';
import { motion } from 'framer-motion';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';

const Testimonials: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <Reveal width="100%">
          <h2 className="text-4xl md:text-5xl font-serif text-cream font-bold mb-6">
            Lo que dicen nuestros clientes
          </h2>
        </Reveal>
        <Reveal width="100%" delay={0.3}>
          <div className="w-24 h-1.5 bg-caramel mx-auto rounded-full"></div>
        </Reveal>
      </div>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {TESTIMONIALS.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            whileHover={{ y: -12 }}
            className="group relative mt-16 bg-white/5 hover:bg-white/10 backdrop-blur-md p-8 pb-10 rounded-[2rem] shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(196,167,125,0.15)] border border-white/10 hover:border-caramel/30 transition-all duration-500 pt-20 flex flex-col h-full"
          >


            {/* Avatar */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-white/5 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 group-hover:shadow-caramel/20 group-hover:ring-4 group-hover:ring-caramel/20">
                  <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="absolute bottom-1 right-1 bg-caramel text-white p-1.5 rounded-full shadow-md border-2 border-transparent group-hover:bg-brownie transition-colors duration-300">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="text-caramel mb-6 flex justify-center gap-1.5 pt-4">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1), type: "spring", stiffness: 200 }}
                  className="w-5 h-5 fill-current drop-shadow-sm"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex-grow flex items-center justify-center">
              <p className="text-cream/80 font-serif italic text-center mb-8 leading-loose text-lg px-2 group-hover:text-cream transition-colors duration-300">
                "{t.content}"
              </p>
            </div>

            {/* Info */}
            <div className="text-center border-t border-white/10 pt-6 mt-auto">
              <h5 className="font-bold text-cream uppercase tracking-widest text-sm mb-2 group-hover:text-caramel transition-colors duration-300">{t.name}</h5>
              <p className="text-caramel/80 text-xs font-bold tracking-widest uppercase">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </ResponsiveCarouselGrid>
    </div>
  );
};

export default Testimonials;
