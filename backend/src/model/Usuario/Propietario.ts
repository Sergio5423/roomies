import { Usuario } from './Usuario';
import { Alojamiento } from '../Alojamiento/Alojamiento';
import { EstadoUsuario } from '../estados';

export class Propietario extends Usuario {
  private alojamientosPropietario: Alojamiento[];

  constructor(
    id: number,
    nombreCompleto: string,
    telefono: string,
    rol: string,
    estado: EstadoUsuario,
    email: string,
    alojamientosPropietario: Alojamiento[] = []
  ) {
    super(id, nombreCompleto, telefono, rol, estado, email);
    this.alojamientosPropietario = alojamientosPropietario;
  }

  public publicarAlojamiento(alojamiento: Alojamiento): void {
    this.alojamientosPropietario.push(alojamiento);
  }

  public actualizarAlojamiento(nuevoAlojamiento: Alojamiento): boolean {
    const alojamientoExistente = this.alojamientosPropietario.find(
      (a) => a.getId() === nuevoAlojamiento.getId()
    );

    if (!alojamientoExistente) {
      throw new Error(`No se encontró el alojamiento con ID ${nuevoAlojamiento.getId()} para actualizar.`);
    }

    alojamientoExistente.actualizarAlojamiento(nuevoAlojamiento);
    return true;
  }

  public eliminarAlojamiento(id: number): boolean {
    const indice = this.alojamientosPropietario.findIndex((a) => a.getId() === id);

    if (indice === -1) {
      return false;
    }

    this.alojamientosPropietario.splice(indice, 1);
    return true;
  }

  public getAlojamientos(): Alojamiento[] {
    return [...this.alojamientosPropietario];
  }
}