export interface Alojamiento {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo: 'Apartamento' | 'Casa' | 'Pensionado';
  estado: 'disponible' | 'archivado' | 'alquilado';
  // Agregaremos Ubicacion y Caracteristicas cuando las termines en el backend
}