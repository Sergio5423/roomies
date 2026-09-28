// PropietarioRepositoryInMemory.ts
import type { IPropietarioRepository } from './IPropietarioRepository';
import { Propietario } from '../model/Usuario/Propietario';

export class PropietarioRepositoryInMemory implements IPropietarioRepository {
    // Usamos un Map para simular la tabla de la base de datos
    private propietarios: Map<number, Propietario> = new Map();
    
    // Simulamos un contador autoincremental para las llaves primarias
    private secuenciaId: number = 1;

    public async obtenerPorId(id: number): Promise<Propietario | null> {
        // Simulamos el retraso de red de una base de datos real (opcional)
        // await new Promise(resolve => setTimeout(resolve, 50)); 
        
        const propietario = this.propietarios.get(id);
        return propietario || null;
    }

    public async obtenerTodos(): Promise<Propietario[]> {
        return Array.from(this.propietarios.values());
    }

    public async guardar(propietario: Propietario): Promise<Propietario> {
        // Si el propietario es nuevo y no tiene ID, le asignamos uno de la secuencia
        if (!(propietario as any).id) {
            // Se usa casting si la propiedad 'id' está protegida o es readonly en la clase
            (propietario as any).id = this.secuenciaId++;
        }
        
        this.propietarios.set((propietario as any).id, propietario);
        return propietario;
    }

    public async actualizar(propietario: Propietario): Promise<Propietario> {
        const id = (propietario as any).id;
        if (!this.propietarios.has(id)) {
            throw new Error(`El propietario con ID ${id} no existe en la base de datos.`);
        }
        
        this.propietarios.set(id, propietario);
        return propietario;
    }

    public async eliminar(id: number): Promise<boolean> {
        return this.propietarios.delete(id);
    }
}