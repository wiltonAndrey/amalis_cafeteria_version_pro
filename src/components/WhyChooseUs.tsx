
import React from 'react';
import { Reveal } from './ui/Reveal';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';

const FEATURE_CARDS = [
  {
    title: 'Tradición',
    desc: 'Creemos que la tradición merece un lugar privilegiado. Aquí huele a pan recién hecho desde bien temprano.',
    img: '/images/sections/editada-09.webp',
    imgAlt: 'Panadero artesano trabajando la masa tradicional',
  },
  {
    title: 'Sin Atajos',
    desc: 'Cero procesos industriales. La verdadera artesanía no tiene modo rápido.',
    img: '/images/products/Croissant-Mantequilla.webp',
    imgAlt: 'Proceso de horneado lento y cuidado',
  },
  {
    title: '100% Manos Vecinas',
    desc: 'Amasamos, horneamos y servimos cada día para que recuperes el placer honesto de lo auténtico.',
    img: '/images/sections/editada-07.webp',
    imgAlt: 'Manos artesanas preparando café y repostería',
  },
  {
    title: 'Placer Honesto',
    desc: 'Lejos de lo industrial. Ingredientes reales para un sabor que conecta con lo local.',
    img: '/images/sections/editada-12.webp',
    imgAlt: 'Cliente disfrutando de un producto artesanal honesto',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <Reveal width="100%">
          <h2 className="text-4xl md:text-5xl font-serif text-cream font-bold">Nuestra Filosofía</h2>
        </Reveal>
      </div>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURE_CARDS.map((card, idx) => (
          <Reveal key={idx} delay={idx * 0.2} width="100%" fullHeight>
            <div className="flex flex-col items-center text-center group h-full">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 md:mb-8 border-4 border-white/10 shadow-xl transform transition-transform group-hover:scale-105 group-hover:rotate-3">
                <img src={card.img} alt={card.imgAlt} className="w-full h-full object-cover img-unified" loading="lazy" decoding="async" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-cream mb-4">{card.title}</h4>
              <p className="text-cream/70 leading-relaxed mb-6">
                {card.desc}
              </p>
              <button className="px-6 py-2 bg-white/10 text-cream font-bold rounded-full shadow-sm border border-white/20 hover:bg-caramel hover:text-white transition-all cursor-pointer mt-auto backdrop-blur-sm">
                Saber más
              </button>
            </div>
          </Reveal>
        ))}
      </ResponsiveCarouselGrid>
    </div>
  );
};

export default WhyChooseUs;
