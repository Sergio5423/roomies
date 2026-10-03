import type { IRepositorioFactory } from '../repository/factory/IRepositorioFactory';
import { SupabaseRepositorioFactory } from '../repository/factory/SupabaseRepositorioFactory';

// Punto de composición: Supabase continúa siendo la familia de producción.
export const repositorioFactory: IRepositorioFactory = new SupabaseRepositorioFactory();
