export interface QuickAction {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  image: string;
  imageAlt: string;
  imageSource: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "habitacion",
    title: "Busco una habitación",
    description:
      "Encuentra espacios disponibles según tu ciudad, presupuesto y preferencias.",
    route: "/habitaciones",
    icon: "⌂",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Habitación moderna y amueblada",
    imageSource: "Pexels",
  },
  {
    id: "roommate",
    title: "Busco un compañero",
    description:
      "Conecta con personas compatibles con tu estilo de vida y convivencia.",
    route: "/roomies",
    icon: "◉",
    image:
      "https://images.pexels.com/photos/7683827/pexels-photo-7683827.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Jóvenes compartiendo un espacio en un apartamento",
    imageSource: "Pexels",
  },
  {
    id: "publicar",
    title: "Quiero publicar",
    description:
      "Publica una habitación disponible y encuentra personas interesadas.",
    route: "/publicar",
    icon: "+",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Interior de una vivienda preparado para compartir",
    imageSource: "Pexels",
  },
];