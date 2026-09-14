export interface Roommate {
  id: number;
  nombre: string;
  edad: number;
  ciudad: string;
  descripcion: string;
  imagen: string;
  intereses: string[];
  presupuestoMaximo: number;
  disponible: boolean;
  buscandoHabitacion: boolean;

  habitacionId: number | null;
  habitacionesInteresadasIds: number[];
}