import type { IAlojamientoRepository } from '../IAlojamientoRepository';
import type { IPropietarioRepository } from '../IPropietarioRepository';
import type { Alojamiento } from '../../models/Alojamiento/Alojamiento';

export class MemoriaAlojamientoRepository implements IAlojamientoRepository {
  private readonly alojamientos = new Map<string, Alojamiento>();
  constructor(private readonly propietarios: IPropietarioRepository) {}
  async guardar(alojamiento: Alojamiento, propietarioId: string) {
    if (!await this.propietarios.obtenerPorId(propietarioId)) throw new Error('Propietario no encontrado.');
    if (this.alojamientos.has(alojamiento.getId())) throw new Error('El alojamiento ya existe.');
    this.alojamientos.set(alojamiento.getId(), alojamiento);
    return alojamiento;
  }
  async obtenerPorId(id: string) { return this.alojamientos.get(id) ?? null; }
  async listarTodos() {
    return [...this.alojamientos.values()].sort((a, b) =>
      b.getFechaPublicacion().getTime() - a.getFechaPublicacion().getTime());
  }
  async actualizar(alojamiento: Alojamiento) {
    if (!this.alojamientos.has(alojamiento.getId())) throw new Error('Alojamiento no encontrado.');
    this.alojamientos.set(alojamiento.getId(), alojamiento);
    return alojamiento;
  }
  async eliminar(id: string) { return this.alojamientos.delete(id); }
}
