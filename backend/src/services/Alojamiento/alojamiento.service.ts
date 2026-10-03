import { Alojamiento } from '../../models/Alojamiento/Alojamiento';
import { Ubicacion } from '../../models/Alojamiento/Ubicacion';
import { Caracteristica } from '../../models/Alojamiento/Caracteristica';
import { Precio } from '../../models/Alojamiento/Precio';
import { Regla } from '../../models/Alojamiento/Regla';
import { TipoAlojamientoFactory } from '../../models/Factory/TipoAlojamientoFactory';
import type { IAlojamientoRepository } from '../../repository/IAlojamientoRepository';
import type { IPropietarioRepository } from '../../repository/IPropietarioRepository';
import { v4 as uuidv4 } from 'uuid';

export class AlojamientoService {
  constructor(
    private alojamientoRepository: IAlojamientoRepository,
    private propietarioRepository: IPropietarioRepository
  ) { }

  public async publicarAlojamiento(propietarioId: string, datosAlojamiento: any): Promise<Alojamiento> {
    // 1. Verificar que el propietario exista en la base de datos
    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no encontrado");
    }

    // 2. Instanciar el TipoAlojamiento mediante la Fábrica
    const instanciaTipo = TipoAlojamientoFactory.crear(datosAlojamiento.tipoAlojamiento);

    // 3. Mapear reglas asociadas al tipo de alojamiento
    if (datosAlojamiento.reglas && Array.isArray(datosAlojamiento.reglas)) {
      const reglasDom: Regla[] = datosAlojamiento.reglas.map(
        (descripcion: string) => new Regla(uuidv4(), descripcion)
      );
      instanciaTipo.setReglas(reglasDom);
    }

    // 4. Construir Value Objects del dominio
    const u = datosAlojamiento.ubicacion || {};
    const ubicacion = new Ubicacion(
      u.direccion || '',
      u.ciudad || '',
      u.barrio || '',
      u.distancia || '',
      Number(u.latitud ?? 0),
      Number(u.longitud ?? 0)
    );

    const c = datosAlojamiento.caracteristica || datosAlojamiento.caracteristicas || {};
    const caracteristica = new Caracteristica(
      Number(c.numeroCuartos ?? 1),
      Number(c.metrosCuadrados ?? 0),
      Number(c.capacidad ?? 1),
      Boolean(c.amoblado),
      Boolean(c.buscandoRoomie)
    );

    const p = datosAlojamiento.precio || {};
    const precio = new Precio(
      Number(typeof p === 'object' ? p.precioMensual ?? p.monto : p)
    );

    // 5. Instanciar Entidad de Dominio
    const nuevoAlojamiento = new Alojamiento(
      uuidv4(),
      datosAlojamiento.titulo,
      datosAlojamiento.descripcion,
      instanciaTipo, // Instancia concreta que hereda de TipoAlojamiento
      datosAlojamiento.imagenes || [],
      0, // Puntuación promedio inicial
      new Date(),
      "disponible",
      ubicacion,
      caracteristica,
      precio
    );

    // 6. Vincular la publicación con el Propietario en memoria/dominio
    propietario.publicarAlojamiento(nuevoAlojamiento);

    // 7. Persistir en Supabase a través del repositorio
    // Pasar propietarioId como segundo argumento al guardar
    return await this.alojamientoRepository.guardar(nuevoAlojamiento, propietarioId);
  }

  public async actualizarAlojamiento(alojamientoId: string, datosActualizados: any): Promise<Alojamiento> {
    const alojamientoExistente = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamientoExistente) {
      throw new Error("Alojamiento no encontrado");
    }

    // Reconstruir TipoAlojamiento si se envía un cambio, o mantener el actual
    const tipo = datosActualizados.tipoAlojamiento
      ? TipoAlojamientoFactory.crear(datosActualizados.tipoAlojamiento)
      : alojamientoExistente.getTipoAlojamiento();

    // Reconstruir Value Objects
    const u = datosActualizados.ubicacion || {};
    const ubicacion = datosActualizados.ubicacion
      ? new Ubicacion(
        u.direccion || alojamientoExistente.getUbicacion().getDireccion(),
        u.ciudad || alojamientoExistente.getUbicacion().getCiudad(),
        u.barrio || alojamientoExistente.getUbicacion().getBarrio(),
        u.distancia || alojamientoExistente.getUbicacion().getDistancia(),
        Number(u.latitud ?? alojamientoExistente.getUbicacion().getLatitud()),
        Number(u.longitud ?? alojamientoExistente.getUbicacion().getLongitud())
      )
      : alojamientoExistente.getUbicacion();

    const c = datosActualizados.caracteristica || datosActualizados.caracteristicas || {};
    const caracteristicas = datosActualizados.caracteristica || datosActualizados.caracteristicas
      ? new Caracteristica(
        Number(c.numeroCuartos ?? alojamientoExistente.getCaracteristicas().getNumeroCuartos()),
        Number(c.metrosCuadrados ?? alojamientoExistente.getCaracteristicas().getMetrosCuadrados()),
        Number(c.capacidad ?? alojamientoExistente.getCaracteristicas().getCapacidad()),
        c.amoblado ?? alojamientoExistente.getCaracteristicas().getAmoblado(),
        c.buscandoRoomie ?? alojamientoExistente.getCaracteristicas().getBuscandoRoomie()
      )
      : alojamientoExistente.getCaracteristicas();

    const p = datosActualizados.precio || {};
    const precio = datosActualizados.precio
      ? new Precio(Number(typeof p === 'object' ? p.precioMensual ?? p.monto : p))
      : alojamientoExistente.getPrecio();

    // Instanciar el objeto Alojamiento con los datos nuevos para pasarlo al método de la entidad
    const datosNuevos = new Alojamiento(
      alojamientoExistente.getId(),
      datosActualizados.titulo || alojamientoExistente.getTitulo(),
      datosActualizados.descripcion || alojamientoExistente.getDescripcion(),
      tipo,
      datosActualizados.imagenes || alojamientoExistente.getImagenes(),
      datosActualizados.puntuacionPromedio ?? alojamientoExistente.getPuntuacionPromedio(),
      alojamientoExistente.getFechaPublicacion(),
      alojamientoExistente.getEstado(),
      ubicacion,
      caracteristicas,
      precio
    );

    // Mutación en la entidad del dominio
    alojamientoExistente.actualizarAlojamiento(datosNuevos);

    return await this.alojamientoRepository.actualizar(alojamientoExistente);
  }

  public async cambiarEstado(alojamientoId: string, nuevoEstado: string): Promise<Alojamiento> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("Alojamiento no encontrado");
    }

    alojamiento.actualizarEstado(nuevoEstado);

    return await this.alojamientoRepository.actualizar(alojamiento);
  }

  public async listarTodos(): Promise<Alojamiento[]> {
    return await this.alojamientoRepository.listarTodos();
  }

  public async obtenerPorId(id: string): Promise<Alojamiento | null> {
    return await this.alojamientoRepository.obtenerPorId(id);
  }
}