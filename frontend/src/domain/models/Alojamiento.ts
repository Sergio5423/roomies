export interface TipoAlojamientoDTO {
  nombre: string;
  contratoAnual?: boolean;
  serviciosEspecificos?: string[];
  reglasEspecificas?: string[];
}

export interface UbicacionDTO {
  direccion: string;
  ciudad: string;
  barrio?: string;
  distancia?: string;
  latitud?: number;
  longitud?: number;
}

export interface CaracteristicasDTO {
  numeroCuartos: number;
  metrosCuadrados: number;
  capacidad?: number;
  amoblado?: boolean;
  buscandoRoomie?: boolean;
}

export interface PrecioDTO {
  precioMensual: number;
}

export interface Alojamiento {
  id: string;
  titulo: string;
  descripcion: string;
  tipoAlojamiento?: TipoAlojamientoDTO;
  tipo?: string; // Por si se envía plano
  imagenes?: string[];
  puntuacionPromedio?: number;
  fechaPublicacion?: string;
  estado?: string;
  ubicacion?: UbicacionDTO;
  caracteristicas?: CaracteristicasDTO;
  precio: number | PrecioDTO;
}