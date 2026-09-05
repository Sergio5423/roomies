export class Regla {
  private id: number;
  private nombre: string;
  private descripcion: string;
  private obligatoria: boolean;

  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    obligatoria: boolean
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.obligatoria = obligatoria;
  }
}