import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';
import { useHero } from '../hooks/useCMS';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { data: hero, loading } = useHero();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="h-screen bg-coffee flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-coffee">
      <div className="absolute inset-0 z-0">
        <img
          src={hero.backgroundImage}
          alt={hero.imageAlt || "Pan artesanal de masa madre"}
          title={hero.imageTitle || hero.title}
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee/60 via-transparent to-white/30" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl pt-24 md:pt-0">
        <Reveal width="100%">
          <h1 className="font-serif text-white mb-6 leading-tight drop-shadow-lg tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
            {hero.title}
          </h1>
        </Reveal>
        <Reveal width="100%" delay={0.4}>
          <div className="flex flex-col gap-2 mb-10 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-white font-sans font-medium drop-shadow-md">
              {hero.subtitle}
            </p>
            {hero.quote && (
              <p className="text-lg md:text-xl text-white/90 font-sans font-light drop-shadow-md italic">
                "{hero.quote}"
              </p>
            )}
          </div>
        </Reveal>
        <Reveal width="100%" delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="honey" size="lg" onClick={() => navigate('/carta')}>
              Explorar Menú
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollToSection('about')}>
              Nuestra Historia
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Hero;
