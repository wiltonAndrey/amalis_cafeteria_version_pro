import type { LocationInfo } from '../types';
import { BUSINESS_MAP_URL } from './core';

export const LOCATION_INFO: LocationInfo = {
  title: 'Encuéntranos en Santa Pola',
  description:
    'Activa tu ubicación y te abrimos la ruta más rápida hasta nuestra puerta. Estamos en el centro, a dos calles del Castillo de Santa Pola.',
  ctaLabel: 'Descubre nuestra ubicación',
  address: ['Carrer Almirante Antequera, 11', '03130 Santa Pola, Alicante'],
  reference: 'A 2 calles del Castillo de Santa Pola',
  mapUrl: BUSINESS_MAP_URL,
  hours: '7:00–21:00',
  phone: '656 91 35 39',
  contactCard: {
    title: '¿Necesitas un encargo?',
    description: 'Llámanos y te confirmamos disponibilidad al momento.',
    ctaLabel: 'Llamar ahora',
  },
};
