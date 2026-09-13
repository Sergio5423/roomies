export interface City {
  id: number;
  name: string;
  department: string;
  latitude: number;
  longitude: number;
}

export const cities: City[] = [
  {
    id: 1,
    name: "Bogotá",
    department: "Bogotá D.C.",
    latitude: 4.6097,
    longitude: -74.0818,
  },
  {
    id: 2,
    name: "Medellín",
    department: "Antioquia",
    latitude: 6.245,
    longitude: -75.5715,
  },
  {
    id: 3,
    name: "Cali",
    department: "Valle del Cauca",
    latitude: 3.4305,
    longitude: -76.5199,
  },
  {
    id: 4,
    name: "Barranquilla",
    department: "Atlántico",
    latitude: 10.9685,
    longitude: -74.7813,
  },
  {
    id: 5,
    name: "Cartagena",
    department: "Bolívar",
    latitude: 10.3982,
    longitude: -75.4933,
  },
  {
    id: 6,
    name: "Cúcuta",
    department: "Norte de Santander",
    latitude: 7.9074,
    longitude: -72.5049,
  },
  {
    id: 7,
    name: "Bucaramanga",
    department: "Santander",
    latitude: 7.125,
    longitude: -73.1189,
  },
  {
    id: 8,
    name: "Ibagué",
    department: "Tolima",
    latitude: 4.4357,
    longitude: -75.2029,
  },
  {
    id: 9,
    name: "Santa Marta",
    department: "Magdalena",
    latitude: 11.2386,
    longitude: -74.1943,
  },
  {
    id: 10,
    name: "Montería",
    department: "Córdoba",
    latitude: 8.7508,
    longitude: -75.8782,
  },
  {
    id: 11,
    name: "Manizales",
    department: "Caldas",
    latitude: 5.0668,
    longitude: -75.5068,
  },
  {
    id: 12,
    name: "Pereira",
    department: "Risaralda",
    latitude: 4.8143,
    longitude: -75.6949,
  },
  {
    id: 13,
    name: "Pasto",
    department: "Nariño",
    latitude: 1.2146,
    longitude: -77.2785,
  },
  {
    id: 14,
    name: "Valledupar",
    department: "Cesar",
    latitude: 10.4654,
    longitude: -73.2531,
  },
];