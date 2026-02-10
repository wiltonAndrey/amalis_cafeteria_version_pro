import React from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Reveal } from '../ui/Reveal';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { LOCATION_INFO } from '../../constants';

const MAPS_URL = LOCATION_INFO.mapUrl;

const LocationSection: React.FC = () => {
  const { loading, locationFound, requestLocation } = useGeolocation();

  const handleShareClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    requestLocation();
  };

  const titleParts = (LOCATION_INFO.title || 'Encuéntranos en Santa Pola').split(' en ');

  return (
    <div className="max-w-7xl mx-auto px-6 relative">
      {/* Texture Overlay for the whole section */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-20"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>

      <Reveal width="100%">
        <div className="bg-brownie rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7)] group/section transition-all duration-700 min-h-[650px] border border-white/5">

          {/* Left Column: Information & Navigation */}
          <div className="lg:w-5/12 p-10 lg:p-20 flex flex-col justify-center text-beige relative overflow-hidden bg-gradient-to-br from-brownie to-black/40">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.07] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="pattern-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-dots)" />
              </svg>
            </div>

            <SectionHeading
              title={titleParts[0]}
              highlight={titleParts[1] || 'Santa Pola'}
              description={LOCATION_INFO.description}
              className="text-left mb-12"
            />

            <div className="space-y-12 relative z-10">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareClick}
                className={`group/btn inline-flex items-center justify-center gap-3 rounded-2xl px-12 py-5 text-lg font-bold transition-all duration-500 bg-beige text-brownie hover:bg-white hover:scale-[1.03] shadow-[0_20px_40px_-10px_rgba(245,239,231,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.25)] ${loading ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-brownie border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6 transform group-hover/btn:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <span className="tracking-tight">{locationFound ? 'Ruta más rápida activada' : LOCATION_INFO.ctaLabel}</span>
              </a>

              <div className="pt-10 border-t border-white/10">
                <div className="flex items-center gap-4 mb-6 group/addr">
                  <div className="w-12 h-12 rounded-2xl bg-caramel/20 flex items-center justify-center text-caramel border border-caramel/20 group-hover/addr:bg-caramel group-hover/addr:text-white transition-all duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl font-serif text-white tracking-wide">Nuestra Casa</h4>
                    <p className="text-beige/60 text-sm font-medium uppercase tracking-widest">{LOCATION_INFO.reference}</p>
                  </div>
                </div>

                <p className="text-beige/80 text-xl leading-relaxed mb-6 font-light">
                  {LOCATION_INFO.address[0]} <br />
                  <span className="text-white/40">{LOCATION_INFO.address[1]}</span>
                </p>

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-caramel/10 border border-caramel/20 text-caramel font-bold text-sm tracking-widest uppercase">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Abierto hoy: {LOCATION_INFO.hours}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual & Contact Card */}
          <div className="lg:w-7/12 min-h-[500px] lg:h-auto relative overflow-hidden flex items-center justify-center p-6 lg:p-16">
            {/* Immersive Background Image with Transition */}
            <div className="absolute inset-0 grayscale contrast-[1.1] brightness-[0.7] group-hover/section:grayscale-0 group-hover/section:brightness-[0.9] transition-all duration-1000 ease-in-out">
              <img
                src="/images/sections/editada-01.webp"
                className="w-full h-full object-cover scale-105 group-hover/section:scale-100 transition-transform duration-1000"
                alt="Referencia mapa"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brownie via-brownie/20 to-transparent opacity-60"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [-5, 5, -5] }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="bg-white/90 backdrop-blur-2xl p-10 lg:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5),0_0_80px_-10px_rgba(196,167,125,0.3)] w-full max-w-md relative z-20 border border-white/40"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-caramel to-brownie rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>

                <h4 className="font-serif font-bold text-4xl text-brownie mb-4 tracking-tight leading-tight">
                  {LOCATION_INFO.contactCard.title}
                </h4>
                <p className="text-brownie/70 mb-10 leading-relaxed text-lg font-medium">
                  {LOCATION_INFO.contactCard.description}
                </p>

                <div className="w-full group/tel">
                  <a
                    href={`tel:${LOCATION_INFO.phone.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-3 bg-brownie text-white py-6 rounded-2xl font-bold text-2xl hover:bg-caramel transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(62,44,40,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(196,167,125,0.5)] hover:scale-[1.03] active:scale-95 mb-6"
                  >
                    <span>{LOCATION_INFO.contactCard.ctaLabel}</span>
                    <span className="text-caramel group-hover/tel:text-white transition-colors">→</span>
                  </a>
                  <div className="relative group/num inline-block">
                    <p className="text-brownie font-bold tracking-widest text-2xl font-mono">
                      {LOCATION_INFO.phone}
                    </p>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel group-hover/num:w-full transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default LocationSection;
