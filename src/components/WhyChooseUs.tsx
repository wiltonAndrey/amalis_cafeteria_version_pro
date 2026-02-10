import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';
import { SectionHeading } from './ui/SectionHeading';



import { WHY_CHOOSE_US_FEATURES, HISTORY_SECTION } from '../constants';

const WhyChooseUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <Reveal width="100%">
        <SectionHeading
          eyebrow={HISTORY_SECTION.eyebrow}
          title={HISTORY_SECTION.title}
          highlight={HISTORY_SECTION.highlight}
          description={HISTORY_SECTION.description}
        />
      </Reveal>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8">
        {WHY_CHOOSE_US_FEATURES.map((card, idx) => (
          <Reveal key={idx} delay={idx * 0.2} width="100%" fullHeight>
            <div className="flex flex-col items-center text-center group h-full">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 md:mb-8 border-4 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.32)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 group-hover:rotate-3 group-hover:border-emerald-600/90 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <img src={card.img} alt={card.imgAlt} className="w-full h-full object-cover img-unified transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-cream mb-4">{card.title}</h4>
              <p className="text-cream/75 text-base md:text-xl font-light leading-relaxed mb-6">
                {card.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </ResponsiveCarouselGrid>

      <div className="mt-16 text-center flex flex-col items-center gap-8">
        <Reveal width="100%" delay={0.4}>
          <p className="text-xl md:text-2xl text-caramel font-serif italic max-w-2xl mx-auto opacity-90 leading-relaxed underline decoration-caramel/20 underline-offset-8">
            "{HISTORY_SECTION.footer}"
          </p>
        </Reveal>

        <Reveal width="100%" delay={0.6}>
          <Link to="/carta" className="text-cream font-bold text-lg inline-flex items-center gap-2 group cursor-pointer hover:text-caramel transition-colors">
            {HISTORY_SECTION.ctaButton}
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

export default WhyChooseUs;
