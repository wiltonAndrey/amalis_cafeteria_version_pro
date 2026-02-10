import React, { useRef, useState } from 'react';

interface MobileCarouselProps {
    children: React.ReactNode;
    className?: string;
    itemClassName?: string;
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
            <div className="md:hidden flex justify-center gap-2 mt-2 mb-6">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-caramel' : 'w-1.5 bg-caramel/30'
                            }`}
                    />
                ))}
            </div>

            {/* Desktop View: Regular Grid */}
            <div className={`hidden md:grid ${className}`}>
                {children}
            </div>
        </div>
    );
};

export const ResponsiveCarouselGrid: React.FC<MobileCarouselProps> = ({
    children,
    className = "", // Should contain the desktop grid classes, e.g. "md:grid-cols-4"
    itemClassName = ""
}) => {
    const items = React.Children.toArray(children);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollPosition = container.scrollLeft;
            const itemWidth = container.clientWidth * 0.85;
            const index = Math.round(scrollPosition / itemWidth);
            setActiveIndex(Math.min(Math.max(0, index), items.length - 1));
        }
    };

    return (
        <>
            {/* Mobile View: Horizontal Scroll - visible only on mobile */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
                {items.map((child, idx) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 w-[85vw] snap-center ${itemClassName}`}
                    >
                        {child}
                    </div>
                ))}
                {/* Spacer to allow visualizing the last item fully */}
                <div className="flex-shrink-0 w-4 snap-center" aria-hidden="true" />
            </div>

            {/* Mobile Indicators */}
            <div className="md:hidden flex justify-center gap-2 mt-2 mb-8">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-caramel' : 'w-1.5 bg-caramel/30'
                            }`}
                    />
                ))}
            </div>

            {/* Desktop View: Grid - hidden on mobile, visible on md and up */}
            <div className={`hidden md:grid gap-8 ${className}`}>
                {children}
            </div>
        </>
    );
};
