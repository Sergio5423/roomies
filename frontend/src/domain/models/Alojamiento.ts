export interface TipoAlojamientoDTO {
  nombre?: string;
  contratoAnual?: boolean;
  serviciosEspecificos?: string[];
  reglasEspecificas?: any[];
  politicaContrato?: Record<string, any>;
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
  monto?: number;
}

export interface LandlordProfileDTO {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  rol?: string;
  role?: string;
  estado?: string;
}

export interface Alojamiento {
  id: string;
  titulo: string;
  descripcion: string;
  tipoAlojamiento?: TipoAlojamientoDTO | string;
  tipo?: string; // Nombre plano si viene simplificado
  imagenes?: string[];
  puntuacionPromedio?: number;
  fechaPublicacion?: string;
  estado?: string; // 'disponible' | 'ocupado'
  ubicacion?: UbicacionDTO;
  caracteristicas?: CaracteristicasDTO;
  caracteristica?: CaracteristicasDTO; // A veces el backend envía en singular
  precio: number | PrecioDTO;
  reglas?: string[] | { id?: string; descripcion: string }[];
  propietarioId?: string;
  landlord_id?: string;
  landlord?: LandlordProfileDTO;
}

export interface CrearAlojamientoPayload {
  titulo: string;
  descripcion: string;
  tipoAlojamiento: string; // 'Apartamento' | 'Casa' | 'Pensionado'
  imagenes: string[];
  ubicacion: UbicacionDTO;
  caracteristica: CaracteristicasDTO;
  precio: {
    precioMensual: number;
  };
  reglas: string[];
}

export interface ActualizarAlojamientoPayload {
  titulo?: string;
  descripcion?: string;
  tipoAlojamiento?: string;
  imagenes?: string[];
  ubicacion?: UbicacionDTO;
  caracteristica?: CaracteristicasDTO;
  precio?: {
    precioMensual: number;
  };
  reglas?: string[];
}