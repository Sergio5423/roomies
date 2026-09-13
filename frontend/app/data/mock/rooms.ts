
export interface Room {
  id: number;
  title: string;
  city: string;
  neighborhood: string;
  price: number;
  roomType: string;
  available: boolean;
  image: string;
  imageAlt: string;
  features: string[];
}

export const rooms: Room[] = [
  {
    id: 1,
    title: "Habitación amoblada cerca de la universidad",
    city: "Valledupar",
    neighborhood: "Novalito",
    price: 650000,
    roomType: "Privada",
    available: true,
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación moderna y amoblada",
    features: ["Amoblada", "WiFi", "Baño compartido"],
  },
  {
    id: 2,
    title: "Habitación privada en apartamento",
    city: "Valledupar",
    neighborhood: "Los Cortijos",
    price: 780000,
    roomType: "Privada",
    available: true,
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Interior de apartamento moderno",
    features: ["Amoblada", "Cocina", "Zona de estudio"],
  },
  {
    id: 3,
    title: "Habitación económica para estudiante",
    city: "Valledupar",
    neighborhood: "La Popa",
    price: 520000,
    roomType: "Privada",
    available: true,
    image:
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación sencilla y luminosa",
    features: ["WiFi", "Servicios incluidos", "Cerca a transporte"],
  },
  {
    id: 4,
    title: "Habitación moderna con baño privado",
    city: "Medellín",
    neighborhood: "Laureles",
    price: 950000,
    roomType: "Privada",
    available: true,
    image:
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación moderna con cama doble",
    features: ["Baño privado", "WiFi", "Amoblada"],
  },
  {
    id: 5,
    title: "Espacio compartido para estudiantes",
    city: "Medellín",
    neighborhood: "Robledo",
    price: 480000,
    roomType: "Compartida",
    available: true,
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación compartida",
    features: ["Amoblada", "Cocina", "WiFi"],
  },
  {
    id: 6,
    title: "Habitación tranquila en zona residencial",
    city: "Bogotá",
    neighborhood: "Teusaquillo",
    price: 850000,
    roomType: "Privada",
    available: true,
    image:
      "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación en apartamento residencial",
    features: ["Baño privado", "Zona de estudio", "Seguridad"],
  },
];

