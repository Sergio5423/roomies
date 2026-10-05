import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),

  route(
    "quienes-somos",
    "routes/about/about.tsx",
  ),

  route(
    "como-funciona",
    "routes/how_y_works/how.tsx",
  ),

  route(
    "ayuda",
    "routes/help/help.tsx",
  ),

  route(
    "terminos",
    "routes/terms/terms.tsx",
  ),

  route(
    "privacidad",
    "routes/privacy/privacy.tsx",
  ),

  
  route(
    "habitaciones",
    "routes/bedroom/bedrooms.tsx",
  ),
  route(
    "login",
    "routes/login/login.tsx",
  ),
  route(
    "publicar",
    "routes/publish/publish.tsx",
  ),
  route(
    "register",
    "routes/register/register.tsx",
  ),
  route(
    "roommates",
    "routes/roommates/roommates.tsx",
  ),
] satisfies RouteConfig;