
export interface BannerSlide {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  route: string;
  image: string;
}

export const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    eyebrow: "ENCUENTRA TU ESPACIO",
    title: "Encuentra un lugar que se sienta como hogar.",
    description:
      "Explora habitaciones, conoce sus características y encuentra una opción que se adapte a ti.",
    button: "Explorar habitaciones",
    route: "/habitaciones",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 2,
    eyebrow: "ENCUENTRA TU ROOMIE",
    title: "Comparte tu espacio con alguien compatible contigo.",
    description:
      "Conoce personas con intereses, preferencias y formas de convivencia similares a las tuyas.",
    button: "Encontrar roomies",
    route: "/roomies",
    image:
      "https://images.pexels.com/photos/7683827/pexels-photo-7683827.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: 3,
    eyebrow: "PUBLICA TU HABITACIÓN",
    title: "¿Tienes un espacio disponible?",
    description:
      "Publica tu habitación y conecta con personas que buscan un lugar donde vivir.",
    button: "Publicar habitación",
    route: "/publicar",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

