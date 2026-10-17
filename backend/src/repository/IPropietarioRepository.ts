import { Propietario } from '../models/Usuario/Propietario';

export interface IPropietarioRepository {
  obtenerPorId(id: string): Promise<Propietario | null>;
  obtenerTodos(): Promise<Propietario[]>;
  guardar(propietario: Propietario): Promise<Propietario>;
  actualizar(propietario: Propietario): Promise<Propietario>;
  eliminar(id: string): Promise<boolean>;
}