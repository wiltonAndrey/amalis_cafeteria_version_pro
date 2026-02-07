/**
 * Sistema centralizado de manejo de errores para Amalis Cafetería.
 * Basado en el skill manejando-errores.
 */

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export interface AppError {
    message: string;
    code: string;
    severity: ErrorSeverity;
    timestamp: number;
    originalError?: any;
}

export const handleError = (error: any, context: string): AppError => {
    const appError: AppError = {
        message: error instanceof Error ? error.message : 'Error desconocido',
        code: `ERR_${context.toUpperCase()}`,
        severity: ErrorSeverity.MEDIUM,
        timestamp: Date.now(),
        originalError: error
    };

    console.error(`[${appError.code}] ${appError.message}`, {
        context,
        severity: appError.severity,
        stack: error instanceof Error ? error.stack : undefined
    });

    // Aquí se podría integrar un logger externo o analytics

    return appError;
};

export const getFallbackProductImage = () => {
    return '/images/sections/editada-01.webp';
};
