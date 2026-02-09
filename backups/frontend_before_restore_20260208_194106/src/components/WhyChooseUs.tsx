import React from 'react';
import { Reveal } from './ui/Reveal';
import { ResponsiveCarouselGrid } from './ui/MobileCarousel';
import { useFeatures } from '../hooks/useCMS';

const WhyChooseUs: React.FC = () => {
  const { data: features, loading } = useFeatures();

  if (loading) {
    return <div className="py-20 text-center text-cream">Cargando filosofía...</div>;
  }

  // Sort by sortOrder just in case API doesn't
  const sortedFeatures = [...features].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <Reveal width="100%">
          <h2 className="text-4xl md:text-5xl font-serif text-cream font-bold">Nuestra Filosofía</h2>
        </Reveal>
      </div>

      <ResponsiveCarouselGrid className="md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sortedFeatures.map((feature, idx) => (
          <Reveal key={feature.id} delay={idx * 0.2} width="100%" fullHeight>
            <div className="flex flex-col items-center text-center group h-full">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 md:mb-8 border-4 border-white/10 shadow-xl transform transition-transform group-hover:scale-105 group-hover:rotate-3">
                <img src={feature.icon} alt={feature.title} className="w-full h-full object-cover img-unified" loading="lazy" decoding="async" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-cream mb-4">{feature.title}</h4>
              <p className="text-cream/70 leading-relaxed mb-6">
                {feature.description}
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
