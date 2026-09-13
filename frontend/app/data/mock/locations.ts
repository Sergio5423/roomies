export type LocationType = "room" | "roommate" | "post";

export interface LocationItem {
  id: number;
  type: LocationType;

  // Información de la publicación
  title: string;
  description: string;

  // Información geográfica
  cityId: number;
  neighborhood: string;
  postalCode: string;
  commune: string;

  // Imagen
  image: string;

  // Información adicional de la publicación
  roomType?: string;

  // Contacto mock
  contactPhone?: string;
  contactEmail?: string;
}

export const locations: LocationItem[] = [
  {
    id: 1,
    type: "room",
    title: "Habitación amoblada cerca de la universidad",
    description:
      "Habitación privada en una zona tranquila, con acceso a transporte y servicios cercanos.",
    cityId: 14,
    neighborhood: "Novalito",
    postalCode: "200002",
    commune: "Comuna 6",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Privada",
    contactPhone: "300 123 4567",
    contactEmail: "contacto@roomies.com",
  },

  {
    id: 2,
    type: "room",
    title: "Habitación privada en apartamento",
    description:
      "Espacio cómodo para estudiantes o trabajadores, ubicado cerca de zonas comerciales.",
    cityId: 14,
    neighborhood: "Los Cortijos",
    postalCode: "200003",
    commune: "Comuna 5",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Privada",
    contactPhone: "301 234 5678",
    contactEmail: "loscortijos@roomies.com",
  },

  {
    id: 3,
    type: "room",
    title: "Habitación moderna en Laureles",
    description:
      "Habitación disponible en apartamento compartido, cerca de universidades y transporte.",
    cityId: 2,
    neighborhood: "Laureles",
    postalCode: "050031",
    commune: "Laureles-Estadio",
    image:
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Privada",
    contactPhone: "302 345 6789",
    contactEmail: "laureles@roomies.com",
  },

  {
    id: 4,
    type: "roommate",
    title: "Busco roommate en Novalito",
    description:
      "Busco una persona responsable para compartir apartamento y gastos de vivienda.",
    cityId: 14,
    neighborhood: "Novalito",
    postalCode: "200002",
    commune: "Comuna 6",
    image:
      "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contactPhone: "303 456 7890",
    contactEmail: "novalito@roomies.com",
  },

  {
    id: 5,
    type: "roommate",
    title: "Busco roommate en El Poblado",
    description:
      "Persona interesada en compartir apartamento y dividir los gastos mensuales.",
    cityId: 2,
    neighborhood: "El Poblado",
    postalCode: "050021",
    commune: "El Poblado",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contactPhone: "304 567 8901",
    contactEmail: "poblado@roomies.com",
  },

  {
    id: 6,
    type: "roommate",
    title: "Busco compañero en Teusaquillo",
    description:
      "Busco roommate para compartir apartamento cerca de universidades y transporte público.",
    cityId: 1,
    neighborhood: "Teusaquillo",
    postalCode: "111321",
    commune: "Teusaquillo",
    image:
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contactPhone: "305 678 9012",
    contactEmail: "teusaquillo@roomies.com",
  },

  {
    id: 7,
    type: "post",
    title: "Apartamento disponible en el centro",
    description:
      "Publicación de vivienda con habitaciones disponibles para estudiantes y trabajadores.",
    cityId: 14,
    neighborhood: "Centro",
    postalCode: "200001",
    commune: "Comuna 1",
    image:
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Apartamento compartido",
    contactPhone: "306 789 0123",
    contactEmail: "centro@roomies.com",
  },

  {
    id: 8,
    type: "post",
    title: "Habitación disponible en Robledo",
    description:
      "Espacio disponible en apartamento compartido con fácil acceso a transporte.",
    cityId: 2,
    neighborhood: "Robledo",
    postalCode: "050036",
    commune: "Robledo",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Privada",
    contactPhone: "307 890 1234",
    contactEmail: "robledo@roomies.com",
  },

  {
    id: 9,
    type: "post",
    title: "Apartamento compartido en Chapinero",
    description:
      "Espacio disponible para compartir apartamento en una zona central de Bogotá.",
    cityId: 1,
    neighborhood: "Chapinero",
    postalCode: "110231",
    commune: "Chapinero",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    roomType: "Compartida",
    contactPhone: "308 901 2345",
    contactEmail: "chapinero@roomies.com",
  },
];