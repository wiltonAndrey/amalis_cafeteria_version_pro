import React from 'react';
import { Reveal } from '../ui/Reveal';
import { usePhilosophy } from '../../hooks/useCMS';

const CoffeeExperience: React.FC = () => {
    const { data: philosophy, loading } = usePhilosophy();

    if (loading || !philosophy) {
        return <div className="py-32 bg-transparent text-cream text-center">Cargando experiencia...</div>;
    }

    return (
        <div className="relative py-32 bg-transparent text-cream overflow-hidden">


            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Visual Column */}
                    <div className="lg:col-span-5 relative order-2 lg:order-1">
                        <Reveal width="100%" delay={0.3}>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-caramel/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img
                                    src={philosophy.image}
                                    alt={philosophy.title}
                                    className="relative z-10 w-full rounded-[2rem] shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:-translate-y-2 border border-white/5"
                                    loading="lazy"
                                    decoding="async"
                                />

                                {/* Floating Stat Card */}
                                <div className="absolute -right-8 bottom-12 z-20 hidden md:block">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hover:bg-white/20 transition-colors duration-300">
                                        <p className="text-caramel font-accent text-lg mb-1">Temperatura Ideal</p>
                                        <p className="text-3xl font-serif text-white font-bold">93°C</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Editorial Text Column */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <Reveal width="100%">
                            <div className="inline-flex items-center gap-4 mb-8">
                                <span className="w-16 h-[1px] bg-gradient-to-r from-caramel to-transparent"></span>
                                <span className="text-caramel font-mono tracking-[0.2em] uppercase text-xs">Sensory experience</span>
                            </div>
                        </Reveal>

                        <Reveal width="100%" delay={0.2}>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-[0.9] text-white tracking-tight">
                                {philosophy.title}
                            </h2>
                        </Reveal>

                        <Reveal width="100%" delay={0.4}>
                            <div
                                className="space-y-8 text-xl text-white/70 font-light leading-relaxed max-w-2xl pl-4 border-l border-white/10"
                                dangerouslySetInnerHTML={{ __html: philosophy.content }}
                            />
                        </Reveal>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CoffeeExperience;
