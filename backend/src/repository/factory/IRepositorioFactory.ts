import type { IAlojamientoRepository } from '../IAlojamientoRepository';
import type { IPropietarioRepository } from '../IPropietarioRepository';

export interface IRepositorioFactory {
  crearAlojamientoRepository(): IAlojamientoRepository;
  crearPropietarioRepository(): IPropietarioRepository;
}
