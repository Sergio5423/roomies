import type { IAlojamientoRepository } from "./IAlojamientoRepository";
import { Alojamiento } from "../model/Alojamiento/Alojamiento";
import crypto from 'crypto'; // Utilidad nativa de Node.js para IDs únicos

export class AlojamientoRepositoryInMemory implements IAlojamientoRepository {
    
    private alojamientos: Map<string, Alojamiento> = new Map();

    public async guardar(alojamiento: Alojamiento): Promise<Alojamiento> {
        if (!(alojamiento as any).id) {
            
            (alojamiento as any).id = crypto.randomUUID(); 
        }
        
        this.alojamientos.set((alojamiento as any).id, alojamiento);
        return alojamiento;
    }

    public async obtenerPorId(id: string): Promise<Alojamiento | null> {
        return this.alojamientos.get(id) || null;
    }

    public async listarTodos(): Promise<Alojamiento[]> {
        return Array.from(this.alojamientos.values());
    }

    public async eliminar(id: string): Promise<boolean> {
        return this.alojamientos.delete(id);
    }

    public async actualizar(alojamiento: Alojamiento): Promise<Alojamiento> {
        const id = (alojamiento as any).id;
        if (!id || !this.alojamientos.has(id)) {
            throw new Error(`El alojamiento con ID ${id} no existe.`);
        }
        
        this.alojamientos.set(id, alojamiento);
        return alojamiento;
    }
}