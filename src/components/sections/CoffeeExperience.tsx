import React from 'react';
import { Reveal } from '../ui/Reveal';
import { COFFEE_EXPERIENCE_DATA } from '../../constants';

const CoffeeExperience: React.FC = () => {
  return (
    <div className="relative py-32 bg-transparent text-cream overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-caramel/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-coffee/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <Reveal width="100%" delay={0.3}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-caramel/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src={COFFEE_EXPERIENCE_DATA.image}
                  alt={COFFEE_EXPERIENCE_DATA.imageAlt}
                  className="relative z-10 w-full rounded-[2rem] border border-white/5 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.6)] group-hover:shadow-[0_28px_60px_-16px_rgba(0,0,0,0.75)] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:-translate-y-2"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute -right-8 bottom-12 z-20 hidden md:block">
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-black/70 transition-colors duration-300">
                    <p className="text-caramel font-accent text-lg mb-1 tracking-wide">Temperatura Ideal</p>
                    <p className="text-4xl font-serif text-white font-bold drop-shadow-md">{COFFEE_EXPERIENCE_DATA.temperature}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal width="100%">
              <div className="inline-flex items-center gap-4 mb-8">
                <span className="w-16 h-[1px] bg-gradient-to-r from-caramel to-transparent"></span>
                <span className="text-caramel font-mono tracking-[0.2em] uppercase text-xs">{COFFEE_EXPERIENCE_DATA.badge}</span>
              </div>
            </Reveal>

            <Reveal width="100%" delay={0.2}>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-[0.9] text-white tracking-tight">
                {COFFEE_EXPERIENCE_DATA.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel to-orange-300 italic pr-4">{COFFEE_EXPERIENCE_DATA.highlight}</span>
              </h2>
            </Reveal>

            <Reveal width="100%" delay={0.4}>
              <div className="space-y-8 text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl pl-4 border-l border-white/10">
                <p dangerouslySetInnerHTML={{ __html: COFFEE_EXPERIENCE_DATA.description[0] }} />
                <p>{COFFEE_EXPERIENCE_DATA.description[1]}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeExperience;
