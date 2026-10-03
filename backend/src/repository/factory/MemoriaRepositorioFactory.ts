import type { IRepositorioFactory } from './IRepositorioFactory';
import { MemoriaAlojamientoRepository } from '../memoria/MemoriaAlojamientoRepository';
import { MemoriaPropietarioRepository } from '../memoria/MemoriaPropietarioRepository';

export class MemoriaRepositorioFactory implements IRepositorioFactory {
  private readonly propietarios = new MemoriaPropietarioRepository();
  private readonly alojamientos = new MemoriaAlojamientoRepository(this.propietarios);
  crearAlojamientoRepository() { return this.alojamientos; }
  crearPropietarioRepository() { return this.propietarios; }
}
