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

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Reveal width="100%">
        <div className="bg-brownie rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl hover:shadow-[0_24px_60px_-14px_rgba(0,0,0,0.6)] transition-all duration-500 min-h-[600px]">
          <div className="lg:w-1/2 p-10 lg:p-24 flex flex-col justify-center text-beige relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
              </svg>
            </div>

            <SectionHeading
              title="Busca tu"
              highlight="Tienda"
              description="Comparte tu ubicacion para encontrar tu panaderia mas cercana, ya sea para pedir por adelantado o visitarnos en persona."
              className="text-left mb-12"
            />

            <div className="space-y-10 relative z-10">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareClick}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold transition-all duration-300 bg-beige text-brownie hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(245,239,231,0.2)] ${loading ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-brownie border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {locationFound ? 'Ubicacion Recibida' : 'Compartir Ubicacion'}
              </a>

              <div className="pt-8 border-t border-beige/10">
                <h4 className="font-bold text-xl mb-3 font-serif">Tienda Principal</h4>
                <p className="text-beige/70 text-base leading-relaxed">
                  {LOCATION_INFO.address.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < LOCATION_INFO.address.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                <div className="mt-4 flex items-center gap-2 text-caramel font-bold text-sm tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Abierto hoy: {LOCATION_INFO.hours}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 h-[400px] lg:h-auto relative bg-[#e5e7eb] overflow-hidden group">
            <div className="absolute inset-0 grayscale contrast-[1.1] brightness-[0.9] transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100">
              <img
                src="/images/sections/editada-01.webp"
                className="w-full h-full object-cover"
                alt="Vista aerea de la costa de Santa Pola"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-brownie/50 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-brownie/20 pointer-events-none"></div>

            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center relative z-20 mx-4"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-brownie rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-serif font-bold text-2xl text-brownie mb-2">Estamos aqui</h4>
                  <p className="text-brownie/60 mb-6 leading-relaxed">
                    Visitanos y disfruta del autentico sabor artesanal en un ambiente acogedor.
                  </p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brownie font-bold text-sm uppercase tracking-wider hover:text-caramel transition-colors group/btn"
                  >
                    Como llegar
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default LocationSection;
