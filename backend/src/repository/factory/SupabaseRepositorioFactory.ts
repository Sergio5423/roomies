import type { IRepositorioFactory } from './IRepositorioFactory';
import { SupabaseAlojamientoRepository } from '../SupabaseAlojamientoRepository';
import { SupabasePropietarioRepository } from '../SupabasePropietarioRepository';

export class SupabaseRepositorioFactory implements IRepositorioFactory {
  private readonly alojamientos = new SupabaseAlojamientoRepository();
  private readonly propietarios = new SupabasePropietarioRepository();
  crearAlojamientoRepository() { return this.alojamientos; }
  crearPropietarioRepository() { return this.propietarios; }
}
