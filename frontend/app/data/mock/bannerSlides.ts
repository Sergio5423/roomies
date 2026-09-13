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
      "Explora habitaciones y espacios pensados para diferentes estilos de vida y presupuestos.",
    button: "Explorar habitaciones",
    route: "/habitaciones",
    image:
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 2,
    eyebrow: "CONECTA CON PERSONAS",
    title: "Encuentra un roommate compatible contigo.",
    description:
      "Conoce personas con intereses y preferencias de convivencia similares a las tuyas.",
    button: "Encontrar roommate",
    route: "/roommates",
    image:
      "https://images.pexels.com/photos/7683827/pexels-photo-7683827.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: 3,
    eyebrow: "COMPARTE TU ESPACIO",
    title: "¿Tienes una habitación disponible?",
    description:
      "Publica tu espacio y encuentra personas interesadas en vivir contigo.",
    button: "Publicar habitación",
    route: "/publicar",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];