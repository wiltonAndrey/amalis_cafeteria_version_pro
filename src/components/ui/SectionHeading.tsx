import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  description,
  className = '',
}) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-10 h-px bg-caramel/70" aria-hidden="true" />
          <span className="text-caramel font-accent tracking-wide text-lg">{eyebrow}</span>
          <span className="w-10 h-px bg-caramel/70" aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="text-4xl md:text-6xl font-serif text-cream font-bold tracking-tight leading-[1.05]">
        {title}{' '}
        {highlight ? (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel to-orange-300 italic pr-2">
            {highlight}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p className="mt-5 text-cream/75 mx-auto max-w-3xl text-lg md:text-xl font-light leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
};
