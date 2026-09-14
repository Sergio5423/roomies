export interface Accommodation {
  id: number;

  propietario: {
    id: number;
    nombre: string;
    imagen: string;
    puntuacion: number;
  };

  ocupantesIds: number[];

  slug: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  referencia: string;
  precioMensual: number;
  tipoAlojamiento: string;
  metrosCuadrados: number;
  numeroCuartos: number;
  capacidad: number;
  serviciosIncluidos: string[];
  reglas: string[];
  amoblado: boolean;
  banioPrivado: boolean;
  aceptaRoomie: boolean;
  imagenes: string[];
  puntuacionPromedio: number;
  estado: string;
}