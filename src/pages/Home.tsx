import React, { Suspense, useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';

// Lazy load below-the-fold sections
const WhyChooseUs = React.lazy(() => import('../components/WhyChooseUs'));
const FeaturedProducts = React.lazy(() => import('../components/sections/FeaturedProducts'));
const CoffeeExperience = React.lazy(() => import('../components/sections/CoffeeExperience'));
const Gallery = React.lazy(() => import('../components/Gallery'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const LocationSection = React.lazy(() => import('../components/sections/LocationSection'));

interface DeferredSectionProps {
    id: string;
    className: string;
    placeholderClassName?: string;
    children: React.ReactNode;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
    id,
    className,
    placeholderClassName = 'py-20 min-h-[420px]',
    children
}) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node || shouldRender) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const rootMargin = isMobile ? '0px' : '480px';
        const threshold = isMobile ? 0.15 : 0;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [shouldRender]);

    return (
        <section id={id} ref={sectionRef} className={className}>
            {shouldRender ? children : <div className={placeholderClassName} aria-hidden="true" />}
        </section>
    );
};

const Home: React.FC = () => {
    return (
        <>
            <section id="home" className="snap-section"><Hero /></section>
            <DeferredSection id="about" className="py-20 snap-section">
                <Suspense fallback={<div className="py-20" />}>
                    <WhyChooseUs />
                </Suspense>
            </DeferredSection>
            <DeferredSection id="featured" className="py-20 bg-transparent snap-section">
                <Suspense fallback={<div className="py-20" />}>
                    <FeaturedProducts />
                </Suspense>
            </DeferredSection>
            <DeferredSection id="experience" className="snap-section" placeholderClassName="min-h-[520px]">
                <Suspense fallback={<div className="min-h-[520px]" />}>
                    <CoffeeExperience />
                </Suspense>
            </DeferredSection>
            <DeferredSection id="gallery" className="py-20 bg-transparent snap-section">
                <Suspense fallback={<div className="py-20" />}>
                    <Gallery />
                </Suspense>
            </DeferredSection>
            <DeferredSection id="testimonials" className="py-20 snap-section">
                <Suspense fallback={<div className="py-20" />}>
                    <Testimonials />
                </Suspense>
            </DeferredSection>
            <DeferredSection id="location" className="py-20 bg-transparent snap-section" placeholderClassName="py-20 min-h-[700px]">
                <Suspense fallback={<div className="py-20 min-h-[700px]" />}>
                    <LocationSection />
                </Suspense>
            </DeferredSection>
        </>
    );
};

export default Home;
