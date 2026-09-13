export interface TrustItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const trustItems: TrustItem[] = [
  {
    id: 1,
    title: "Perfiles verificados",
    description:
      "Consulta información de los usuarios antes de iniciar una convivencia.",
    icon: "✓",
  },
  {
    id: 2,
    title: "Información clara",
    description:
      "Encuentra habitaciones con detalles sobre ubicación, precio y condiciones.",
    icon: "⌂",
  },
  {
    id: 3,
    title: "Preferencias de convivencia",
    description:
      "Compara intereses y preferencias para encontrar personas compatibles contigo.",
    icon: "♡",
  },
  {
    id: 4,
    title: "Reseñas de usuarios",
    description:
      "Conoce experiencias de otros usuarios y toma decisiones con mayor confianza.",
    icon: "★",
  },
];