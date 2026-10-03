import { Usuario } from './Usuario';
import { Alojamiento } from '../Alojamiento/Alojamiento';

export class Propietario extends Usuario {
  private alojamientosPropietario: Alojamiento[];

  constructor(
    id: string,
    first_name: string,
    last_name: string,    
    email: string,
    telefono: string,
    alojamientosPropietario: Alojamiento[] = []
  ) {    
    super(id, first_name, last_name, email, telefono, 'ARRENDATARIO', 'activo');
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

  public eliminarAlojamiento(id: string): boolean {
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