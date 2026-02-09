
import { useEffect, useRef, useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  locationFound: boolean;
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    locationFound: false,
    coordinates: null,
    error: null,
  });
  const delayRef = useRef<number | null>(null);

  const requestLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!("geolocation" in navigator)) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Geolocation not supported" 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Simulamos un delay para UX de carga (opcional en producción)
        if (delayRef.current) {
          window.clearTimeout(delayRef.current);
        }
        delayRef.current = window.setTimeout(() => {
          setState({
            loading: false,
            locationFound: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            error: null,
          });
        }, 1200);
      },
      (error) => {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (delayRef.current) {
        window.clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    };
  }, []);

  return { ...state, requestLocation };
};
