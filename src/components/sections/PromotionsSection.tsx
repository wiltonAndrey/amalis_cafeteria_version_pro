import React from 'react';
import { Reveal } from '../ui/Reveal';
import { ResponsiveCarouselGrid } from '../ui/MobileCarousel';
import { Badge } from '../ui/Badge';
import { usePromotionCards } from '../../hooks/usePromotionCards';

const PromotionsSection: React.FC = () => {
    const { cards } = usePromotionCards();

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);

    return (
        <div className="relative py-24 overflow-hidden bg-transparent">
            {/* Background ambients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#C4A77D0D,transparent_55%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <Reveal width="100%">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-8 h-[1px] bg-caramel"></span>
                            <span className="text-caramel font-accent text-lg tracking-wide">Promociones</span>
                            <span className="w-8 h-[1px] bg-caramel"></span>
                        </div>
                    </Reveal>
                    <Reveal width="100%" delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-serif text-cream font-bold tracking-tight mb-4">
                            Packs del Dia
                        </h2>
                    </Reveal>
                    <Reveal width="100%" delay={0.4}>
                        <p className="mt-4 text-cream/70 text-lg font-light max-w-2xl mx-auto">
                            Combinaciones perfectas a un precio cerrado. Disfruta de la experiencia completa.
                        </p>
                    </Reveal>
                </div>

                <ResponsiveCarouselGrid className="md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {cards.map((promo, idx) => (
                        <Reveal key={promo.id} delay={idx * 0.1} fullHeight width="100%">
                            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col border border-white/10 hover:border-caramel/30">
                                {/* Image Section */}
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={promo.image}
                                        alt={promo.image_alt?.trim() || promo.title}
                                        title={promo.image_title?.trim() || promo.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge>{promo.badge}</Badge>
                                    </div>
                                    {/* Overlay gradiente sutil al hacer hover */}
                                    <div className="absolute inset-0 bg-coffee/0 group-hover:bg-coffee/20 transition-colors duration-300"></div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-2xl font-serif font-bold text-cream group-hover:text-caramel transition-colors leading-tight">
                                            {promo.title}
                                        </h3>
                                        <div className="flex flex-col items-end">
                                            <span className="text-caramel font-bold text-xl">{formatPrice(promo.price)}</span>
                                        </div>
                                    </div>

                                    <p className="text-cream/80 text-sm leading-relaxed mb-4">
                                        {promo.description}
                                    </p>

                                    {/* Lista de inclusions */}
                                    <div className="mt-auto pt-4 border-t border-white/10">
                                        <ul className="space-y-2 mb-4">
                                            {promo.items.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-cream/70 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-[10px] uppercase tracking-widest text-cream/50 font-bold">{promo.availability_text}</span>
                                            <a href={promo.cta_url || '#'} className="text-cream font-bold text-sm border-b-2 border-caramel/20 group-hover:border-caramel transition-colors">
                                                {promo.cta_label}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </ResponsiveCarouselGrid>
            </div>
        </div>
    );
};

export default PromotionsSection;
