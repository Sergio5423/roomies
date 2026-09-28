//src/model/service/AlojamientoService.ts
import { Alojamiento } from '../../model/Alojamiento/Alojamiento';
import { Regla } from '../../model/Alojamiento/Regla';
import { Propietario } from '../../model/Usuario/Propietario';
import type { IAlojamientoRepository } from '../../repository/IAlojamientoRepository';
import type { IPropietarioRepository } from '../../repository/IPropietarioRepository';
import { TipoAlojamientoFactory } from '../../model/Factory/TipoAlojamientoFactory'
import { v4 as uuidv4 } from 'uuid';

export class AlojamientoService {
  // Inyección de dependencias para los repositorios
  constructor(
    private alojamientoRepository: IAlojamientoRepository,
    private propietarioRepository: IPropietarioRepository
  ) { }

  // El diagrama indica que el Propietario publica el alojamiento
  public async publicarAlojamiento(propietarioId: number, datosAlojamiento: any): Promise<Alojamiento> {

    // 1. La Fábrica traduce el string plano a una instancia real 
    const instanciaTipo = TipoAlojamientoFactory.crear(datosAlojamiento.tipoAlojamiento);

    const propietario = await this.propietarioRepository.obtenerPorId(propietarioId);
    if (!propietario) {
      throw new Error("Propietario no encontrado");
    }
    const id: string = uuidv4();
    const imagenes: string[] = []; //IMPLEMENTAR
    const puntuacionPromedio: number = 0; //IMPLEMENTAR
    const fechaActual: Date = new Date();
    const estado: string = "disponible";

    // 2. ¡Aquí actúa el Polimorfismo! 
    // Al servicio no le importa si 'instanciaTipo' es Casa, Apartamento o Pensionado.
    // Sabe que, por contrato (interfaz), el método agregarRegla() existe.
    if (datosAlojamiento.reglas && Array.isArray(datosAlojamiento.reglas)) {
      const Reglas: Regla[] = [];
      datosAlojamiento.reglas.forEach((descripcionRegla: string) => {
        Reglas.push(new Regla(uuidv4(), descripcionRegla));        
      });
      instanciaTipo.setReglas(Reglas);
    }

    // Aquí instanciamos el objeto de dominio en el backend con los datos del frontend
    const nuevoAlojamiento = new Alojamiento(
      id,
      datosAlojamiento.titulo,
      datosAlojamiento.descripcion,
      datosAlojamiento.tipoAlojamiento, // Apartamento, Casa, o Pensionado
      imagenes,
      puntuacionPromedio,
      fechaActual,
      estado,
      datosAlojamiento.ubicacion,       // Value Object
      datosAlojamiento.caracteristica,   // Value Object
      datosAlojamiento.precio          // Value Object
    );

    propietario.publicarAlojamiento(nuevoAlojamiento);

    return await this.alojamientoRepository.guardar(nuevoAlojamiento);
  }

  // Corresponde a ActualizarAlojamiento(datos:Alojamiento)
  public async actualizarAlojamiento(alojamientoId: string, datosActualizados: any): Promise<Alojamiento> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("Alojamiento no encontrado");
    }

    // Lógica de negocio encapsulada en el modelo
    alojamiento.actualizarAlojamiento(datosActualizados);

    return await this.alojamientoRepository.actualizar(alojamiento);
  }

  // Corresponde a CambiarEstado(nuevoEstado:String)
  public async cambiarEstado(alojamientoId: string, nuevoEstado: string): Promise<Alojamiento> {
    const alojamiento = await this.alojamientoRepository.obtenerPorId(alojamientoId);
    if (!alojamiento) {
      throw new Error("Alojamiento no encontrado");
    }

    alojamiento.actualizarEstado(nuevoEstado);

    return await this.alojamientoRepository.actualizar(alojamiento);
  }
}