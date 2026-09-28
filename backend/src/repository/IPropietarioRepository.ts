import { Propietario } from '../model/Usuario/Propietario';

export interface IPropietarioRepository {
    obtenerPorId(id: number): Promise<Propietario | null>;
    obtenerTodos(): Promise<Propietario[]>;
    guardar(propietario: Propietario): Promise<Propietario>;
    actualizar(propietario: Propietario): Promise<Propietario>;
    eliminar(id: number): Promise<boolean>;
}