import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants';
import { MenuCategory, MenuProduct } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import ProductModal from '../components/ProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { handleError } from '../utils/error-handling';
import {
    BadgeCheck,
    Cake,
    Coffee,
    Cookie,
    Flame,
    Pizza,
    PieChart,
    Star,
    Tag,
    Utensils,
    UtensilsCrossed,
    type LucideIcon
} from 'lucide-react';

const CATEGORY_ICONS: Record<MenuCategory, LucideIcon> = {
    all: Star,
    cocas: Pizza,
    empanadillas: PieChart,
    bolleria: Cookie,
    bizcochos: Cake,
    pasteles: UtensilsCrossed,
    tostadas: Flame,
    ofertas: Tag
};



const Menu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
    const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const lastMoveRef = useRef(0);

    const sliderRef = useRef<HTMLDivElement>(null);
    const pendingCategoryRef = useRef<MenuCategory | null>(null);

    const filteredProducts = useMemo(() => {
        return activeCategory === 'all'
            ? MENU_PRODUCTS
            : MENU_PRODUCTS.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const handleScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftArrow(scrollLeft > 15);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 15);
        }
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if (!sliderRef.current) return;

        // Capturamos la categoría sobre la que se inicia el toque (Manejo de Errores: Preservar Contexto)
        const target = e.target as HTMLElement;
        const btn = target.closest('[data-category]');
        pendingCategoryRef.current = btn?.getAttribute('data-category') as MenuCategory || null;

        startXRef.current = e.pageX - sliderRef.current.offsetLeft;
        scrollLeftRef.current = sliderRef.current.scrollLeft;
        lastMoveRef.current = 0;
        setIsDragging(true);

        try {
            sliderRef.current.setPointerCapture(e.pointerId);
            sliderRef.current.style.scrollSnapType = 'none';
            sliderRef.current.style.scrollBehavior = 'auto';
        } catch (err) {
            handleError(err, 'slider_pointer_capture');
        }
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startXRef.current) * 1.8; // Velocidad optimizada
        sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
        lastMoveRef.current = Math.abs(walk);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!sliderRef.current) return;

        setIsDragging(false);
        try {
            sliderRef.current.releasePointerCapture(e.pointerId);
        } catch (err) {
            // Manejo silencioso: el puntero puede no estar capturado o ya liberado
        }

        // Restauramos el comportamiento de scroll suave
        sliderRef.current.style.scrollSnapType = 'x proximity';
        sliderRef.current.style.scrollBehavior = 'smooth';

        // SI el movimiento fue mínimo (menos de 20px), es un CLICK
        if (lastMoveRef.current < 20 && pendingCategoryRef.current) {
            setActiveCategory(pendingCategoryRef.current);
        }

        // Limpiamos la categoría pendiente (Manejo de Errores: Limpiar Recursos)
        pendingCategoryRef.current = null;
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
            return () => slider.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Centrado automático de la categoría seleccionada
    useEffect(() => {
        if (sliderRef.current && !isDragging) {
            try {
                const activeBtn = sliderRef.current.querySelector(`[data-category="${activeCategory}"]`);
                if (activeBtn) {
                    activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            } catch (err) {
                handleError(err, 'slider_scroll_into_view');
            }
        }
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)]">

            <section className="pt-24 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-caramel)]/10 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-coffee)]/20 rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10 px-6">
                    <header className="mb-12">
                        <span className="inline-flex items-center text-[var(--color-caramel)] font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs mb-4">
                            <BadgeCheck className="w-4 h-4 mr-3" />
                            Artesanos de Santa Pola
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--color-cream)] mb-6 font-serif tracking-tight">
                            Nuestra <span className="text-[var(--color-caramel)]">Carta</span>
                        </h1>
                    </header>

                    <nav className="relative max-w-5xl mx-auto px-4 select-none group">
                        <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--color-espresso)] to-transparent z-20 pointer-events-none transition-opacity duration-500 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--color-espresso)] to-transparent z-20 pointer-events-none transition-opacity duration-500 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div
                            ref={sliderRef}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                            className={`
                                flex justify-start items-stretch space-x-4 overflow-x-auto pb-10 pt-4 no-scrollbar
                                touch-action-pan-y will-change-scroll
                                ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                            `}
                            style={{
                                scrollSnapType: 'x proximity',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {MENU_CATEGORIES.map((cat) => {
                                const Icon = CATEGORY_ICONS[cat.id] || Coffee;
                                return (
                                    <motion.button
                                        key={cat.id}
                                        data-category={cat.id}
                                        type="button"
                                        aria-pressed={activeCategory === cat.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        layout
                                        className={`
                                            relative shrink-0 flex flex-col items-center justify-center space-y-3 px-8 py-6 rounded-2xl transition-all duration-500 snap-center min-w-[140px] border cursor-pointer
                                            ${activeCategory === cat.id
                                                ? 'text-white border-[var(--color-caramel)]'
                                                : 'bg-white/5 text-[var(--color-beige)]/60 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }
                                        `}
                                    >
                                        {activeCategory === cat.id && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-[var(--color-caramel)] rounded-2xl shadow-[0_10px_30px_-5px_var(--color-caramel)] z-0"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="relative z-10 flex flex-col items-center space-y-3">
                                            <Icon className={`w-8 h-8 transition-transform duration-500 ${activeCategory === cat.id ? 'text-white scale-110' : 'text-[var(--color-beige)]/40'}`} />
                                            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em]">{cat.label}</span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </section>

            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                        className="h-full"
                                    >
                                        <ProductCard product={product} onClick={setSelectedProduct} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <Utensils className="text-[var(--color-caramel)] text-4xl mb-6 opacity-80" />
                            <h3 className="text-2xl font-bold text-[var(--color-cream)] font-serif">Próximamente...</h3>
                            <p className="text-[var(--color-beige)]/60 mt-2 font-sans">Estamos preparando nuevas delicias para esta categoría.</p>
                        </div>
                    )}
                </div>
            </section>

            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

        </div>
    );
};

export default Menu;
