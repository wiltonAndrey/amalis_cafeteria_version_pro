import React, { useRef, useState } from 'react';

interface MobileCarouselProps {
    children: React.ReactNode;
    className?: string;
    itemClassName?: string;
}

interface ResponsiveCarouselGridProps extends MobileCarouselProps {
    desktopMode?: 'grid' | 'carousel';
}

export const MobileCarousel: React.FC<MobileCarouselProps> = ({
    children,
    className = "",
    itemClassName = ""
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Convert children to array to process them
    const items = React.Children.toArray(children);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollPosition = container.scrollLeft;
            const itemWidth = container.clientWidth * 0.85; // 85vw
            const index = Math.round(scrollPosition / itemWidth);
            setActiveIndex(Math.min(Math.max(0, index), items.length - 1));
        }
    };

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const itemWidth = container.clientWidth * 0.85;
        container.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth',
        });
        setActiveIndex(index);
    };

    return (
        <div className={`w-full ${className} relative group`}>
            {/* Mobile View: Horizontal Scroll */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {items.map((child, idx) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 w-[85vw] sm:w-[60vw] snap-center ${itemClassName}`}
                    >
                        {child}
                    </div>
                ))}
                {/* Spacer to allow visualizing the last item fully */}
                <div className="flex-shrink-0 w-2 snap-center" />
            </div>

            {/* Scroll Indicators (Dots) */}
            <div className="md:hidden flex justify-center gap-2 mt-2 mb-6" role="tablist" aria-label="Indicadores de carrusel">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToIndex(idx)}
                        aria-label={`Ir al elemento ${idx + 1}`}
                        aria-selected={idx === activeIndex}
                        role="tab"
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full transition-colors duration-300"
                    >
                        <span
                            aria-hidden="true"
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-caramel' : 'w-1.5 bg-caramel/30'}`}
                        />
                    </button>
                ))}
            </div>

            {/* Desktop View: Regular Grid */}
            <div className={`hidden md:grid ${className}`}>
                {children}
            </div>
        </div>
    );
};

export const ResponsiveCarouselGrid: React.FC<ResponsiveCarouselGridProps> = ({
    children,
    className = "", // Should contain the desktop grid classes, e.g. "md:grid-cols-4"
    itemClassName = "",
    desktopMode = 'grid'
}) => {
    const items = React.Children.toArray(children);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const desktopScrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollPosition = container.scrollLeft;
            const itemWidth = container.clientWidth * 0.85;
            const index = Math.round(scrollPosition / itemWidth);
            setActiveIndex(Math.min(Math.max(0, index), items.length - 1));
        }
    };

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const itemWidth = container.clientWidth * 0.85;
        container.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth',
        });
        setActiveIndex(index);
    };

    const scrollDesktop = (direction: 'left' | 'right') => {
        if (desktopScrollRef.current) {
            const container = desktopScrollRef.current;
            const itemWidth = container.clientWidth / 3; // Suponiendo 3 items visibles o ajustar según necesidad
            const currentScroll = container.scrollLeft;

            container.scrollTo({
                left: direction === 'left' ? currentScroll - itemWidth : currentScroll + itemWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            {/* Mobile View: Horizontal Scroll - visible only on mobile */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={`md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 ${desktopMode === 'carousel' ? 'md:flex md:pb-8 md:gap-6 md:mx-0 md:px-0 md:overflow-hidden' : ''}`}
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
                {items.map((child, idx) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 w-[85vw] snap-center ${itemClassName} ${desktopMode === 'carousel' ? 'md:w-[calc(33.333%-16px)] md:snap-start' : ''}`}
                    >
                        {child}
                    </div>
                ))}
                {/* Spacer to allow visualizing the last item fully */}
                <div className="flex-shrink-0 w-4 snap-center md:hidden" aria-hidden="true" />
            </div>

            {/* Mobile Indicators */}
            <div className={`md:hidden flex justify-center gap-2 mt-2 mb-8 ${desktopMode === 'carousel' ? 'md:hidden' : ''}`} role="tablist" aria-label="Indicadores de carrusel">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToIndex(idx)}
                        aria-label={`Ir al elemento ${idx + 1}`}
                        aria-selected={idx === activeIndex}
                        role="tab"
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full transition-colors duration-300"
                    >
                        <span
                            aria-hidden="true"
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-caramel' : 'w-1.5 bg-caramel/30'}`}
                        />
                    </button>
                ))}
            </div>

            {/* Desktop View: Grid - hidden on mobile, visible on md and up if mode is grid */}
            {desktopMode === 'grid' && (
                <div className={`hidden md:grid gap-8 ${className}`}>
                    {children}
                </div>
            )}

            {/* Desktop View: Carousel - visible on md and up if mode is carousel */}
            {desktopMode === 'carousel' && (
                <div className="hidden md:block relative group/carousel">
                    <div
                        ref={desktopScrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide"
                        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
                    >
                        {items.map((child, idx) => (
                            <div
                                key={idx}
                                className={`flex-shrink-0 w-[calc(33.333%-1rem)] snap-start ${itemClassName}`}
                            >
                                {child}
                            </div>
                        ))}
                    </div>
                    {/* Desktop Navigation Arrows */}
                    <button
                        onClick={() => scrollDesktop('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 p-3 rounded-full transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scrollDesktop('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 p-3 rounded-full transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};
