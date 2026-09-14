# Diseño: API HTTP para Roomies (Alojamiento + Usuario + Auth)

**Fecha:** 2026-09-14
**Estado:** Aprobado en brainstorming, pendiente de revisión final antes de generar el plan de implementación.
**Alcance:** Sub-proyecto #1 de la conversión del backend en una API funcional (ver decisión de descomposición más abajo).

## Contexto

El backend (`backend/`) pasó por una auditoría y 10 fases de refactorización SOLID (documentadas en `backend/README.md`) que dejaron el dominio de **Alojamiento** y **Usuario** bien diseñado, pero **sin ninguna capa HTTP real**: no hay servidor, ni rutas, ni forma de que el frontend (`frontend/`, React Router) se comunique con él. `express` está declarado como dependencia pero no se usa en ningún lado.

El producto es una plataforma estilo Airbnb para alojamiento y roomies, enfocada en estudiantes de la Universidad Popular del Cesar en Valledupar.

El frontend ya tiene una arquitectura de puertos/adaptadores (`domain/habitaciones`, `domain/roomies`, `infrastructure/repositories/Mock*`, un `infrastructure/api/apiClient.ts` vacío) pensada para enchufar una API real más adelante, pero hoy todo corre contra datos mock.

## Descomposición del proyecto completo

Este spec cubre **solo el sub-proyecto #1**. El resto queda para specs futuros e independientes:

1. **Este spec**: capa HTTP + autenticación + persistencia real para lo que ya existe (Alojamiento, Usuario, Favoritos).
2. **Futuro**: subsistema Roommate/PublicacionRoomie (hoy no tiene repositorio/service/controller en el backend).
3. **Futuro**: rutas HTTP para el #2.
4. **Futuro**: conectar el frontend de verdad (`apiClient.ts`, reemplazar los repositorios Mock).

## Decisiones ya validadas con el usuario

- **Persistencia:** PostgreSQL real (no en memoria), vía **Prisma**. Corre en **Docker Compose** para desarrollo/evaluación.
- **Shape de respuesta:** la API expone el shape natural del dominio del backend (no se adapta al shape `Accommodation`/`Roommate` del frontend, que tiene campos como `slug`, `propietario` embebido, `banioPrivado`, `aceptaRoomie` que no existen hoy). Esa adaptación es trabajo del sub-proyecto #4/#5.
- **Autenticación:** JWT (access token 15 min + refresh token 7 días, rotable/revocable) con contraseñas hasheadas con bcrypt. Es el mecanismo estándar más razonable para una API REST consumida por un SPA.
- **Autorización:** cada usuario solo puede gestionar sus propias acciones (publicar/cambiar estado de sus propios alojamientos, gestionar sus propios favoritos). Buscar y ver alojamientos es público, sin login.
- **Validación de requests:** Zod.
- **Testing:** Vitest (unitarios + integración con supertest), reemplaza los smoke-tests manuales para todo lo nuevo.
- **Estructura de carpetas:** se extiende la convención actual (`model/`, `service/`, `controller/`, `repository/`) agregando `src/http/` (Presentation) e `src/infrastructure/` (Prisma, JWT, bcrypt) — **no** se renombra nada de lo ya refactorizado en las Fases 1-10.
- **Roles como capacidades, no como subtipos** (corrección importante descubierta durante el diseño): un mismo usuario puede ser arrendador e inquilino a la vez (como en Airbnb). `Propietario`/`Inquilino` dejan de ser subclases de `Usuario` con `instanceof`; pasan a ser perfiles de capacidad opcionales (`PerfilPropietario`, `PerfilInquilino`) que se auto-provisionan la primera vez que el usuario publica un alojamiento o guarda un favorito, respectivamente. El campo `rol: string` de `Usuario` se elimina.

## Cambios al dominio existente (`backend/src/model`)

Estos son los únicos cambios a código ya refactorizado en las Fases 1-10:

- **`Usuario`**: deja de ser `abstract`. Se agrega `passwordHash: string` (el campo ya estaba previsto, comentado: `//private passwordHash: PasswordHash`). Se elimina el campo `rol: string`.
- **`Propietario` y `Inquilino` (como subclases de `Usuario`) se eliminan.** Se reemplazan por dos clases nuevas, independientes de `Usuario`:
  - `PerfilPropietario` — `id`, `usuarioId`, `fechaCreacion`. Sin comportamiento propio por ahora (existe como marca de capacidad; punto de extensión futuro, p. ej. verificación o calificación como anfitrión).
  - `PerfilInquilino` — `id`, `usuarioId`, `fechaCreacion`. Misma idea.
- **`Alojamiento.propietarioId`** ahora referencia `Usuario.id` directamente (no cambia respecto a la Fase 8, solo se reconfirma: el dueño es un `Usuario`, no un tipo especial de usuario).
- **`Favorito`** (clase de dominio nueva): `id`, `usuarioId`, `alojamientoId`, `fechaGuardado`. Reemplaza el arreglo `favoritos: Alojamiento[]` que tenía `Inquilino` (ya no existe esa clase).
- **Excepciones nuevas** en `src/model/errors.ts`: `UnauthorizedError` (401), `ForbiddenError` (403).
- `Solicitud` y `PublicacionRoomie` **no se tocan** en este spec — siguen sin repositorio/servicio propio (eso es el sub-proyecto #2).

## Servicios afectados (`backend/src/service`)

- **`FavoritosService.agregarAlojamientoAFavoritos(usuarioId, alojamientoId)`**: ya no valida `instanceof Inquilino`. En su lugar, obtiene o auto-provisiona el `PerfilInquilino` del usuario (vía `IPerfilInquilinoRepository`) y guarda el `Favorito` (vía `IFavoritoRepository`, nuevo).
- **`PublicacionAlojamientoService.publicarAlojamientoPropietario(usuarioId, alojamiento)`**: ya no valida `instanceof Propietario`. Obtiene o auto-provisiona el `PerfilPropietario` del usuario, valida que `alojamiento.propietarioId === usuarioId` (igual que en la Fase 8) y guarda.
- **`PublicacionAlojamientoService.listarAlojamientosDePropietario(usuarioId)`**: si el usuario no tiene `PerfilPropietario`, devuelve `[]` (no es un error — nadie "es" propietario, simplemente no ha publicado nada).
- **`AlojamientoService.cambiarEstadoAlojamiento(id, nuevoEstado, solicitanteId)`** (firma nueva, gana `solicitanteId`): valida que `alojamiento.propietarioId === solicitanteId`; si no, lanza `ForbiddenError`.
- **`AuthService`** (nuevo): `registrar(datos)` (hashea password con bcrypt, opcionalmente llama a `PerfilService.actualizarPerfilUsuario` si vienen `universidad`/`carrera`, y **responde con tokens igual que `login`** — el usuario queda autenticado inmediatamente después de registrarse, sin un paso adicional), `login(email, password)` (verifica hash, emite access+refresh JWT), `refrescar(refreshToken)` (rota), `cerrarSesion(refreshToken)` (revoca).
  - **Payload del JWT**: `{ sub: usuarioId }`, firmado con `JWT_ACCESS_SECRET` (access) o `JWT_REFRESH_SECRET` (refresh) — ningún rol ni dato de negocio va en el token, solo la identidad.
  - **Verificación del refresh**: además de validar la firma/expiración del JWT, se comprueba que exista una fila no revocada en `RefreshToken` cuyo hash coincida (permite revocar sesiones activas aunque el JWT en sí siga siendo válido criptográficamente).
- **`UsuarioService`** (registro genérico) se mantiene, pero el flujo de registro HTTP pasa por `AuthService`, que lo usa internamente.

## Repositorios nuevos (`backend/src/repository` + `backend/src/infrastructure`)

Interfaces nuevas (en `repository/`, junto a las existentes) con su implementación Prisma (en `infrastructure/`) y, por simetría con el resto del proyecto, una implementación `InMemory*` para tests unitarios rápidos:

- `IPerfilPropietarioRepository`
- `IPerfilInquilinoRepository`
- `IFavoritoRepository`
- `IRefreshTokenRepository`

El **Composition Root** (`bootstrap.ts`) elige la implementación según una variable de entorno (`REPO_DRIVER=prisma` por defecto; `memory` para tests) — ningún `Service` cambia según el driver (DIP intacto, mismo patrón ya usado desde la Fase 1/3).

## Modelo de datos (Prisma / PostgreSQL)

```prisma
model Usuario {
  id            Int       @id @default(autoincrement())
  nombreCompleto String
  telefono      String
  estado        EstadoUsuario @default(ACTIVO)
  email         String    @unique
  passwordHash  String
  perfil            Perfil?
  perfilPropietario PerfilPropietario?
  perfilInquilino   PerfilInquilino?
  alojamientos      Alojamiento[]
  favoritos         Favorito[]
  refreshTokens     RefreshToken[]
}

model Perfil {
  id            Int      @id @default(autoincrement())
  usuarioId     Int      @unique
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])
  foto          String?
  biografia     String?
  edad          Int?
  universidad   String?
  carrera       String?
}

model PerfilPropietario {
  id            Int      @id @default(autoincrement())
  usuarioId     Int      @unique
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])
  fechaCreacion DateTime @default(now())
}

model PerfilInquilino {
  id            Int      @id @default(autoincrement())
  usuarioId     Int      @unique
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])
  fechaCreacion DateTime @default(now())
}

model Alojamiento {
  id                  Int       @id @default(autoincrement())
  propietarioId       Int
  propietario         Usuario   @relation(fields: [propietarioId], references: [id])
  titulo              String
  descripcion         String
  tipoAlojamiento     TipoAlojamiento
  contratoAnual       Boolean
  serviciosIncluidos  String[]
  estado              EstadoAlojamiento @default(DISPONIBLE)
  imagenes            String[]
  puntuacionPromedio  Float     @default(0)
  fechaPublicacion    DateTime  @default(now())
  // Ubicacion (aplanada como columnas para permitir filtros futuros por ciudad/barrio)
  direccion           String
  ciudad              String
  barrio              String
  distancia           String
  latitud             Float
  longitud            Float
  // Caracteristica (aplanada)
  numeroCuartos       Int
  metrosCuadrados     Int
  capacidad           Int
  amoblado            Boolean
  buscandoRoomie      Boolean
  // Precio (aplanado, columna indexable para filtros futuros por rango)
  precioMensual       Float
  reglas              Regla[]
  favoritos           Favorito[]
}

model Regla {
  id            Int         @id @default(autoincrement())
  alojamientoId Int
  alojamiento   Alojamiento @relation(fields: [alojamientoId], references: [id])
  nombre        String
  descripcion   String
}

model Favorito {
  id            Int         @id @default(autoincrement())
  usuarioId     Int
  usuario       Usuario     @relation(fields: [usuarioId], references: [id])
  alojamientoId Int
  alojamiento   Alojamiento @relation(fields: [alojamientoId], references: [id])
  fechaGuardado DateTime    @default(now())

  @@unique([usuarioId, alojamientoId])
}

model RefreshToken {
  id          Int       @id @default(autoincrement())
  usuarioId   Int
  usuario     Usuario   @relation(fields: [usuarioId], references: [id])
  tokenHash   String
  expiresAt   DateTime
  revokedAt   DateTime?
}

enum EstadoUsuario {
  ACTIVO
}

enum EstadoAlojamiento {
  DISPONIBLE
  OCUPADO
}

enum TipoAlojamiento {
  APARTAMENTO
  CASA
  PENSIONADO
}
```

El repositorio Prisma de Alojamiento arma/desarma `Ubicacion`/`Caracteristica`/`Precio`/`Apartamento|Casa|Pensionado` a partir de estas columnas — el dominio (`Alojamiento`, los value objects, `TipoAlojamientoBase`) no cambia de forma; solo cambia quién los persiste.

## Rutas HTTP

Prefijo base: `/api`. Todas las respuestas son JSON; el status HTTP viene del mapeo de errores existente (extendido).

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/registro` | No | Crea `Usuario` (+ `Perfil` si vienen datos académicos) |
| POST | `/auth/login` | No | `{ email, password }` → tokens |
| POST | `/auth/refresh` | No | Rota el refresh token |
| POST | `/auth/logout` | No | Revoca el refresh token |
| GET | `/alojamientos` | No | Lista todos |
| GET | `/alojamientos/:id` | No | Detalle |
| POST | `/alojamientos` | Sí | Publica (auto-provisiona `PerfilPropietario`) |
| GET | `/alojamientos/mios` | Sí | Mis alojamientos publicados |
| PATCH | `/alojamientos/:id/estado` | Sí | Solo el dueño de *ese* alojamiento |
| POST | `/favoritos` | Sí | `{ alojamientoId }` (auto-provisiona `PerfilInquilino`) |
| GET | `/favoritos` | Sí | Mis favoritos — cada elemento incluye el `Alojamiento` completo asociado (no solo su id), para que el frontend no necesite una petición adicional por favorito |

`AlojamientoController.crear` (create genérico sin dueño verificado) no se expone por HTTP — solo se usa internamente/en smoke tests, para no abrir un hueco de seguridad.

## Manejo de errores

`errorHandlerMiddleware` es el único lugar que traduce excepciones a `{status, body}` — ningún router hace su propio mapeo (evita reintroducir el antipatrón de la Fase 4). Extiende `mapErrorToHttpStatus`:

- `NotFoundError` → 404 (ya existente)
- `UnauthorizedError` → 401 (token ausente/inválido/expirado, credenciales incorrectas)
- `ForbiddenError` → 403 (autenticado, pero no es el dueño del recurso)
- Error de validación Zod → 400, con detalle de campo
- Cualquier otro error → 400 (comportamiento preexistente, sin cambios)

## Testing

- **Unitarios (Vitest)**: `AuthService` (hash/verificación, firma/verificación JWT), autorización nueva (`ForbiddenError` en `cambiarEstadoAlojamiento`), auto-provisión de perfiles. Corren contra repositorios `InMemory*`.
- **Integración (Vitest + supertest)**: contra la app Express real + Postgres de Docker Compose con una base de datos de test separada (`DATABASE_URL_TEST`, reseteada con `prisma migrate reset` antes de la suite). Cubre: registro → login → publicar → cambiar estado (dueño vs. no-dueño) → favoritos.
- Los smoke-tests manuales (`main.ts`, `src/index.ts`, `src/indexUsuario.ts`) de las Fases 1-10 se conservan tal cual (documentan la evolución del dominio) pero dejan de ser la forma de verificar código nuevo.

## Configuración / entorno

- `docker-compose.yml` en `backend/` con un servicio `postgres` (puerto configurable, credenciales vía `.env`).
- `.env` (no versionado, con `.env.example` versionado): `DATABASE_URL`, `DATABASE_URL_TEST`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN=15m`, `JWT_REFRESH_EXPIRES_IN=7d`, `CORS_ORIGIN` (URL del frontend en dev), `REPO_DRIVER=prisma`.
- Nuevo script `npm run dev:http` (o se reutiliza `dev`) que levanta el servidor Express en vez de los smoke-tests de consola; los smoke-tests existentes quedan como scripts aparte (`npm run demo:alojamiento`, etc.) para no perder esa documentación ejecutable.

## Riesgos

- Eliminar `Propietario`/`Inquilino` como subclases es el cambio de mayor alcance de este spec — toca `main.ts`, `src/index.ts`, `src/indexUsuario.ts` (que hoy los instancian) y cualquier lugar que dependa de `instanceof`. Se migran como parte de la implementación, verificando que los smoke-tests sigan corriendo con el nuevo modelo.
- Introducir Postgres/Prisma/Docker agrega infraestructura real que antes no existía — el riesgo se mitiga con `docker-compose.yml` versionado y `.env.example` documentado.
- Auto-provisión de perfiles (`PerfilPropietario`/`PerfilInquilino`) es un comportamiento nuevo (no existía antes ni como concepto) — se documenta explícitamente aquí para que quede claro que es una decisión de este spec, no un hallazgo de la auditoría original.

## Fuera de alcance (explícitamente, para no sobre-diseñar)

- Filtros de búsqueda (`FiltroPrecio`, `FiltroUbicacion`, etc.) — el modelo de datos los deja listos (columnas planas), pero no se implementan en este spec.
- Verificación de email, recuperación de contraseña, MFA.
- Roommate / `PublicacionRoomie` (sub-proyecto #2).
- Conexión real del frontend (`apiClient.ts`, sub-proyecto #4/#5).
- Endpoint de actualización de perfil fuera del registro inicial (`PerfilService` ya existe pero solo se usa en el flujo de registro de este spec).
