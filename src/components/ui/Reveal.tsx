import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

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
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible');
        }
    }, [isInView, mainControls]);

    const getHiddenVariant = () => {
        switch (direction) {
            case 'left': return { opacity: 0, x: -75 };
            case 'right': return { opacity: 0, x: 75 };
            case 'down': return { opacity: 0, y: -75 };
            case 'up': default: return { opacity: 0, y: 75 };
        }
    };

    return (
        <div ref={ref} style={{ position: 'relative', width, overflow: 'visible' }} className={`${className} ${fullHeight ? 'h-full' : ''}`}>
            <motion.div
                variants={{
                    hidden: getHiddenVariant(),
                    visible: { opacity: 1, x: 0, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.5, delay: delay }}
                className={fullHeight ? 'h-full' : ''}
            >
                {children}
            </motion.div>
        </div>
    );
};
