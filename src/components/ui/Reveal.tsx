import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    fullHeight?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
    children,
    width = 'fit-content',
    delay = 0.25,
    direction = 'up',
    className = '',
    fullHeight = false
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    const getInitialTransform = () => {
        switch (direction) {
            case 'left': return 'translateX(-75px)';
            case 'right': return 'translateX(75px)';
            case 'down': return 'translateY(-75px)';
            case 'up': default: return 'translateY(75px)';
        }
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width,
                overflow: 'visible',
            }}
            className={`${className} ${fullHeight ? 'h-full' : ''}`}
        >
            <div
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
                    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
                    willChange: isVisible ? 'auto' : 'opacity, transform',
                }}
                className={fullHeight ? 'h-full' : ''}
            >
                {children}
            </div>
        </div>
    );
};
