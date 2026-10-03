import type { IPropietarioRepository } from '../IPropietarioRepository';
import type { Propietario } from '../../models/Usuario/Propietario';

export class MemoriaPropietarioRepository implements IPropietarioRepository {
  private readonly propietarios = new Map<string, Propietario>();
  async obtenerPorId(id: string) { return this.propietarios.get(id) ?? null; }
  async obtenerTodos() { return [...this.propietarios.values()]; }
  async guardar(propietario: Propietario) {
    if (this.propietarios.has(propietario.getId())) throw new Error('El propietario ya existe.');
    this.propietarios.set(propietario.getId(), propietario);
    return propietario;
  }
  async actualizar(propietario: Propietario) {
    if (!this.propietarios.has(propietario.getId())) throw new Error('Propietario no encontrado.');
    this.propietarios.set(propietario.getId(), propietario);
    return propietario;
  }
  async eliminar(id: string) { return this.propietarios.delete(id); }
}
