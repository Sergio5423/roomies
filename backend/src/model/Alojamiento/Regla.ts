export class Regla {
  private id: number;
  private nombre: string;
  private descripcion: string;

  constructor(
    id: number,
    nombre: string,
    descripcion: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}