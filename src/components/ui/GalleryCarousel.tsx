import React, { useRef, useState, useEffect, useCallback } from 'react';

interface GalleryCarouselProps {
    children: React.ReactNode;
    className?: string;
}

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
    children,
    className = ""
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const items = React.Children.toArray(children);
    const totalItems = items.length;

    // Handle scroll to update active dot
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.offsetWidth * 0.92; // 92vw
        const newIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(Math.min(Math.max(newIndex, 0), totalItems - 1));
    }, [totalItems]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Scroll to specific index when dot is clicked
    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const itemWidth = container.offsetWidth * 0.92;
        container.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* Mobile View: Large Image Carousel with Dots */}
            <div className="md:hidden">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-6 px-6"
                    style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                >
                    {items.map((child, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-[92vw] h-[280px] snap-center rounded-2xl overflow-hidden"
                        >
                            {child}
                        </div>
                    ))}
                    {/* End spacer */}
                    <div className="flex-shrink-0 w-4" aria-hidden="true" />
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            aria-label={`Ir a imagen ${idx + 1}`}
                            className="h-6 w-6 inline-flex items-center justify-center rounded-full transition-colors duration-300"
                        >
                            <span
                                aria-hidden="true"
                                className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex
                                        ? 'bg-caramel w-6'
                                        : 'bg-brownie/30 w-2.5 hover:bg-brownie/50'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop View: Bento Grid */}
            <div className={`hidden md:grid ${className}`}>
                {children}
            </div>
        </>
    );
};
