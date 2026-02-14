import { LOCATION_INFO } from '../constants/location';

/**
 * Genera e inyecta JSON-LD de tipo LocalBusiness en el <head> del documento.
 * Mejora SEO con datos estructurados que Google puede mostrar en resultados enriquecidos.
 */
export function injectStructuredData(): void {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CafeOrCoffeeShop',
        name: 'Amalis Cafetería',
        description: 'Cafetería, panadería y pastelería artesanal en Santa Pola. Pan recién horneado, bollería, pasteles y café de especialidad.',
        url: 'https://amalis.cafe',
        telephone: `+34${LOCATION_INFO.phone.replace(/\s+/g, '')}`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: LOCATION_INFO.address[0],
            addressLocality: 'Santa Pola',
            addressRegion: 'Alicante',
            postalCode: '03130',
            addressCountry: 'ES',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 38.19156,
            longitude: -0.55558,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '07:00',
            closes: '21:00',
        },
        image: 'https://amalis.cafe/images/sections/pan-artesano-horneado.webp',
        priceRange: '€',
        servesCuisine: ['Café', 'Panadería', 'Pastelería'],
        hasMenu: 'https://amalis.cafe/carta',
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}
