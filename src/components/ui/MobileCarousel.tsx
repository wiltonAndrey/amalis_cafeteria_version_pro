import React, { useRef } from 'react';

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

    // Convert children to array to process them
    const items = React.Children.toArray(children);

    return (
        <div className={`w-full ${className}`}>
            {/* Mobile View: Horizontal Scroll */}
            <div
                ref={scrollRef}
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

            {/* Desktop View: Regular Grid (Render children normally using the parent's grid layout) */}
            {/* The parent is responsible for grid layout on desktop, so we just return a fragment or container that doesn't interfere. 
          Actually, for this pattern to work seamlessly, we often want the parent to control the grid.
          However, since this component *replaces* the grid on mobile, on desktop it should probably just act as a fragment 
          OR render a grid container if we want to enforce it.
          
          Better strategy: This component renders the MOBILE version. The DESKTOP version is usually a grid.
          If we want to use this wrapper for BOTH, we need to know the desktop grid classes.
          
          Let's make this component exclusively for the SCROLL container logic. 
          The interactions with the parent grid are tricky if we just return children fragment on desktop because the parent div has the grid classes.
          
          So: We will render TWO versions in the DOM? No, that duplicates content.
          We will use CSS to toggle between flex (mobile) and grid (desktop).
      */}

            <div className={`hidden md:grid ${className}`}>
                {children}
            </div>
        </div>
    );
};

/* 
   Refined Approach:
   Instead of duplicating DOM or complex conditional rendering, we can use a single container that switches styled.
   
   Mobile: flex overflow-x-auto snap-x ...
   Desktop: grid grid-cols-X ... (passed via className)
*/

export const ResponsiveCarouselGrid: React.FC<MobileCarouselProps> = ({
    children,
    className = "", // Should contain the desktop grid classes, e.g. "md:grid-cols-4"
    itemClassName = ""
}) => {
    const items = React.Children.toArray(children);

    return (
        <>
            {/* Mobile View: Horizontal Scroll - visible only on mobile */}
            <div
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

            {/* Desktop View: Grid - hidden on mobile, visible on md and up */}
            <div className={`hidden md:grid gap-8 ${className}`}>
                {children}
            </div>
        </>
    );
};
