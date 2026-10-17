// src/factory/TipoAlojamientoFactory.ts
import type { TipoAlojamiento } from '../Alojamiento/TipoAlojamiento';
import { Apartamento } from '../Alojamiento/Apartamento';
import { Casa } from '../Alojamiento/Casa';
import { Pensionado } from '../Alojamiento/Pensionado';

export class TipoAlojamientoFactory {
    // Un registro de creadores. Si agregas un nuevo tipo mañana, solo lo registras aquí.
    private static creadores: Record<string, () => TipoAlojamiento> = {
        'Apartamento': () => new Apartamento(),
        'Casa': () => new Casa(),
        'Pensionado': () => new Pensionado()
    };

    public static crear(tipo: string): TipoAlojamiento {
        const creador = this.creadores[tipo];
        
        if (!creador) {
            throw new Error(`Tipo de alojamiento no soportado o inválido: ${tipo}`);
        }
        
        return creador();
    }
}