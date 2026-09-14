import { Usuario } from './Usuario';
import { EstadoUsuario } from '../estados';

// NOTA (Fase 8): Propietario ya no guarda su propio arreglo de Alojamientos ni métodos
// para gestionarlo (antes: publicarAlojamiento/actualizarAlojamiento/eliminarAlojamiento/
// getAlojamientos) — ver Problema 9 del informe de auditoría. Esa relación se duplicaba
// con IAlojamientoRepository, que ahora es la única fuente de verdad (ver
// Alojamiento.propietarioId y IAlojamientoRepository.listarPorPropietarioId). Consultar
// los alojamientos de un propietario es responsabilidad de PublicacionAlojamientoService,
// no de esta entidad.
export class Propietario extends Usuario {
  constructor(
    id: number,
    nombreCompleto: string,
    telefono: string,
    rol: string,
    estado: EstadoUsuario,
    email: string
  ) {
    super(id, nombreCompleto, telefono, rol, estado, email);
  }
}
