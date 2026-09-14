# Auditoría de Diseño — Backend Roomies

> Documento generado como parte del corte de **Patrones y Diseño de Software**.
> Objetivo: comprender el sistema **ACTUAL**, detectar antipatrones y violaciones SOLID, y proponer un plan de refactorización incremental.
>
> **⚠️ Este documento es solo diagnóstico. No se modificó ningún archivo de código fuente para producirlo.**

## 0. Método de inspección

Se leyó el 100% de los archivos bajo `backend/src`, además de `backend/main.ts`, `backend/package.json`, `backend/tsconfig.json` y `backend/readme.txt`. Adicionalmente se ejecutó `npx tsc --noEmit` sobre el proyecto para verificar de forma objetiva (no solo por lectura) si el código compila. **El resultado es que el proyecto actual NO compila**, lo cual es en sí mismo el hallazgo más importante de esta auditoría y contextualiza todo lo demás.

### Estructura inspeccionada

```
backend/
├── main.ts                          # entry point real (package.json → "main": "main.ts", scripts dev/start)
├── package.json
├── tsconfig.json
├── readme.txt
└── src/
    ├── index.ts                     # entry point de prueba #2 (Alojamiento)
    ├── indexUsuario.ts              # entry point de prueba #3 (Usuario)
    ├── controller/
    │   ├── AlojamientoController.ts
    │   └── UsuarioController.ts
    ├── service/
    │   ├── AlojamientoService.ts
    │   └── UsuarioService.ts
    ├── repository/
    │   ├── IAlojamientoRepository.ts
    │   ├── IUsuarioRepository.ts          ⚠️ archivo vacío
    │   ├── InMemoryAlojamientoRepository.ts
    │   └── InMemoryUsuarioRepository.ts
    └── model/
        ├── Alojamiento/ (Alojamiento, Apartamento, Casa, Pensionado, ITipoAlojamiento,
        │                 Caracteristica, Precio, Ubicacion, Regla, Preferencia, RangoPresupuesto)
        ├── Usuario/ (Usuario, Propietario, Inquilino, Perfil, InformacionAcademica)
        ├── Solicitud.ts
        ├── Reserva.ts
        ├── Resena.ts
        └── PublicacionRoomie.ts
```

### Dependencia declarada pero no usada

`package.json` declara `express` como dependencia de producción, pero **no existe ninguna importación de `express` en todo `src/`**. No hay servidor HTTP, ni rutas, ni middleware. Los "Controllers" existentes son clases planas invocadas directamente desde funciones `main()` de consola — no hay una capa de Presentation real todavía.

---

## Problema 1

**Archivo:** `src/repository/IUsuarioRepository.ts`
**Clase:** *(ninguna — archivo vacío)*
**Método:** N/A

**Tipo de problema:** Defecto de compilación / abstracción rota.
**Antipatrón:** Abstracción artificial / incompleta (interfaz declarada pero nunca definida).

**Descripción:**
El archivo `IUsuarioRepository.ts` existe pero está completamente vacío (0 bytes, sin `export`). Sin embargo, es importado como tipo (`import type { IUsuarioRepository }`) desde `InMemoryUsuarioRepository.ts` y `UsuarioService.ts`, y `InMemoryUsuarioRepository` declara `implements IUsuarioRepository`.

**Por qué representa un problema:**
La verificación con `tsc --noEmit` confirma dos errores de compilación (`TS2305: Module has no exported member 'IUsuarioRepository'`). Esto significa que **la rama de Usuario del proyecto no compila en su estado actual**, a pesar de que conceptualmente el diseño (Service → Interface ← Repository) es correcto y es justamente el patrón que se quiere preservar (Dependency Inversion). El problema no es de diseño sino de un archivo incompleto, pero bloquea cualquier build o test automatizado.

**Principio SOLID afectado:** Dependency Inversion Principle (DIP) — la abstracción que debería desacoplar `UsuarioService` de la persistencia concreta no existe realmente todavía.

**Severidad:** Alta

**Impacto:** Bloquea `npm run build`, cualquier test automatizado, y cualquier IDE con chequeo de tipos. Es un defecto "silencioso" porque el proyecto sí puede *ejecutarse* con `tsx` (que no siempre detiene la ejecución ante errores de tipos) mientras el error pasa desapercibido.

**Propuesta de refactorización:** Definir el contenido de la interfaz reflejando exactamente los métodos que `InMemoryUsuarioRepository` ya implementa (`guardar`, `buscarPorId`, `buscarPorEmail`, `listarTodos`), siguiendo el mismo patrón que `IAlojamientoRepository`.

**Principio de diseño utilizado:** Dependency Inversion (Service depende de la abstracción, no de la clase concreta).

**Dependencias afectadas:** `UsuarioService`, `InMemoryUsuarioRepository`, `indexUsuario.ts`.

**Riesgos de la modificación:** Bajo. Es completar una interfaz a partir de una implementación ya existente y consistente; no cambia comportamiento.

**Ejemplo conceptual de cómo debería quedar:**
```ts
export interface IUsuarioRepository {
  guardar(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: number): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
}
```

---

## Problema 2

**Archivo:** `main.ts` (raíz del proyecto — entry point real según `package.json`)
**Clase:** N/A (script de prueba manual)
**Método:** `main()`

**Tipo de problema:** Código muerto / desincronizado con el dominio actual.
**Antipatrón:** Duplicated Code + Shotgun Surgery (el dominio cambió y este archivo no se actualizó en ninguno de los puntos que lo usan).

**Descripción:**
`main.ts` es el archivo que `npm run dev` / `npm start` ejecutan (`"main": "main.ts"`, scripts `tsx main.ts`). Construye objetos de dominio con firmas de constructor **que ya no existen**:

- `new Inquilino(id, nombre, tel, rol, estado, email, preferenciaInquilino)` — el constructor actual de `Inquilino` espera `favoritos: Alojamiento[]` en esa posición, no una `Preferencia`.
- `inquilino.crearSolicitud(alojamiento1)` — el método actual recibe una `Solicitud` ya construida y devuelve `void`; `main.ts` lo trata como si devolviera una `Solicitud` con `.getId()`, `.getEstado()`, `.aceptarSolicitud()`.
- `new Reserva(901, inquilino, fechaInicio, fechaFin, precio, "Confirmada")` — el constructor real es `(id, fechaInicioConfirmada, fechaFinConfirmada, precioAcordado, fechaReserva, estado, alojamiento)`: 7 parámetros, sin `inquilino`, con `alojamiento` obligatorio.
- `new Resena(301, inquilino, 5, "...", new Date())` — el constructor real es `(id, puntuacion, comentario, fecha)`, sin `inquilino`; además llama a `resena.getAutor()`, `.getPuntuacion()`, `.getComentario()`, que no existen en la clase actual (`Resena` no tiene ningún getter).
- `new PublicacionRoomie(501, "desc", 1000, 1500, fecha, true, alojamiento1)` — el constructor real recibe 5 parámetros `(id, descripcion, fecha, estado, alojamiento)`, no 7.

**Por qué representa un problema:**
Confirmado con `tsc --noEmit`: **14 errores de compilación** se originan solo en este archivo. El "backend" no puede construirse (`npm run build` falla) ni ejecutarse de forma confiable. Esto demuestra que no existe ninguna red de seguridad (tests, CI, o siquiera compilar antes de commitear) que detecte cuando el modelo de dominio cambia y deja atrás a sus consumidores — es el síntoma clásico de **Shotgun Surgery**: cambiar una entidad (p. ej. `Reserva`) obliga a tocar múltiples puntos dispersos, y aquí ni siquiera se hizo.

**Principio SOLID afectado:** Ninguno directamente (no es un problema de diseño de clases), pero **habilita** que futuras violaciones de OCP/SRP pasen desapercibidas porque no hay verificación automatizada.

**Severidad:** Alta

**Impacto:** El proyecto no es ejecutable de forma confiable hoy. Cualquier refactorización posterior es riesgosa si no se resuelve primero esto, porque no hay forma de validar "no rompí nada" — no hay build verde ni tests.

**Propuesta de refactorización:** No es una refactorización de diseño sino una decisión: (a) actualizar `main.ts` para reflejar las firmas reales, o (b) eliminarlo si su función (smoke test manual) va a ser reemplazada por pruebas automatizadas reales, evitando además tener **tres** entry points de prueba distintos (`main.ts`, `src/index.ts`, `src/indexUsuario.ts`) que dupliquen responsabilidades de bootstrap.

**Principio de diseño utilizado:** Single Source of Truth para el "cómo se levanta la app" (composition root único) — ver Problema 3.

**Dependencias afectadas:** Todo el dominio (`Inquilino`, `Reserva`, `Resena`, `PublicacionRoomie`, `Solicitud`).

**Riesgos de la modificación:** Medio — hay que decidir si el comportamiento "correcto" es el que describe `main.ts` (p. ej. que una `Reserva` sí debería conocer al inquilino) o el que implementan las clases actuales. Este es exactamente el tipo de decisión de dominio que **no** se debe tomar unilateralmente en esta fase; se deja para el plan.

**Ejemplo conceptual:** Sustituir `main.ts` por un `scripts/smoke-test.ts` o, preferiblemente, por pruebas automatizadas (`*.spec.ts`) que fallen en CI en vez de imprimir en consola.

---

## Problema 3

**Archivo:** `main.ts`, `src/index.ts`, `src/indexUsuario.ts`
**Clase:** N/A
**Método:** `main()` / `probarUsuarios()`

**Tipo de problema:** Composición manual duplicada (ausencia de Composition Root).
**Antipatrón:** Duplicated Code, Shotgun Surgery.

**Descripción:**
Existen **tres** puntos distintos donde se construyen manualmente los repositorios, servicios y controladores (`new InMemoryAlojamientoRepository()`, `new AlojamientoService(repo)`, etc.), cada uno con su propia data de prueba hardcodeada.

**Por qué representa un problema:**
Si cambia la forma de construir un servicio (por ejemplo, `AlojamientoService` empieza a necesitar un segundo repositorio o un logger), hay que recordar actualizar los tres archivos. Ya ocurrió una forma de esto en el Problema 2: el dominio cambió y no todos los puntos de construcción se actualizaron.

**Principio SOLID afectado:** No es un principio SOLID puro, pero está directamente relacionado con **DIP**: sin un composition root único, la inyección de dependencias es un patrón manual repetido, no una estrategia consistente del sistema.

**Severidad:** Media

**Impacto:** Mantenibilidad reducida; onboarding confuso (¿cuál archivo es "el" entry point real?).

**Propuesta de refactorización:** Un único composition root (p. ej. `src/bootstrap.ts` o el futuro servidor Express) que construya el grafo de dependencias una sola vez, y mover los usos de ejemplo/smoke-test a pruebas automatizadas separadas del bootstrap de producción.

**Principio de diseño utilizado:** Composition Root / Dependency Injection centralizada.

**Dependencias afectadas:** Todos los servicios y repositorios.

**Riesgos de la modificación:** Bajo si se hace después de resolver Problema 2 (evita mezclar dos refactors a la vez).

**Ejemplo conceptual:**
```ts
// bootstrap.ts
export function buildApp() {
  const alojamientoRepo = new InMemoryAlojamientoRepository();
  const usuarioRepo = new InMemoryUsuarioRepository();
  const alojamientoService = new AlojamientoService(alojamientoRepo);
  const usuarioService = new UsuarioService(usuarioRepo, alojamientoRepo);
  return {
    alojamientoController: new AlojamientoController(alojamientoService),
    usuarioController: new UsuarioController(usuarioService),
  };
}
```

---

## Problema 4

**Archivo:** `src/service/UsuarioService.ts`
**Clase:** `UsuarioService`
**Método:** Toda la clase (`registrarUsuario`, `agregarAlojamientoAFavoritos`, `publicarAlojamientoPropietario`, `actualizarPerfilUsuario`)

**Tipo de problema:** Responsabilidades mezcladas.
**Antipatrón:** God Class *incipiente* (no es un God Class severo hoy — la clase es corta — pero ya mezcla casos de uso de actores distintos, y es la dirección natural en la que crecería mal).

**Descripción:**
`UsuarioService` concentra en una sola clase: (1) registro genérico de usuarios, (2) gestión de favoritos — exclusivo del rol Inquilino, (3) publicación de alojamientos — exclusivo del rol Propietario, y (4) actualización de perfil — genérico. Son cuatro "razones para cambiar" distintas: reglas de favoritos, reglas de publicación de alojamientos, reglas de perfil y reglas de registro/autenticación.

**Por qué representa un problema:**
A medida que el dominio crezca (solicitudes, reservas, reseñas, publicaciones de roomie, notificaciones — todos mencionados en el contexto del proyecto pero aún sin service propio), esta clase es el lugar "por defecto" donde se seguirán añadiendo métodos no relacionados entre sí, degenerando en un God Class real.

**Principio SOLID afectado:** **SRP** (Single Responsibility Principle).

**Severidad:** Media-Alta

**Impacto:** Cada nueva funcionalidad de Inquilino o Propietario tiende a añadirse aquí; los tests de "favoritos" y "publicar alojamiento" quedan acoplados a la misma clase y mismo constructor (que además ya depende de dos repositorios).

**Propuesta de refactorización:** Separar por caso de uso / actor, por ejemplo:
- `RegistroUsuarioService` (registro genérico, valida email único).
- `FavoritosService` (agregar/quitar favoritos — Inquilino).
- `PublicacionAlojamientoService` (publicar/actualizar/eliminar alojamiento — Propietario).
- `PerfilService` (actualizar perfil — genérico).

Esto también resuelve parcialmente el Problema 5 (evita `instanceof`, porque cada servicio ya sabe con qué rol trabaja).

**Principio de diseño utilizado:** SRP + separación por caso de uso (capa Application con "Interactors"/"Use Cases").

**Dependencias afectadas:** `UsuarioController` (tendría que depender de varios servicios o de una fachada), `indexUsuario.ts`.

**Riesgos de la modificación:** Medio — cambia la forma en que el controlador obtiene sus dependencias (más constructores). Mitigable inyectando los servicios nuevos vía el composition root del Problema 3.

**Ejemplo conceptual:**
```ts
class FavoritosService {
  constructor(private usuarioRepo: IUsuarioRepository, private alojamientoRepo: IAlojamientoRepository) {}
  async agregar(inquilinoId: number, alojamientoId: number): Promise<void> { /* ... */ }
}
```

---

## Problema 5

**Archivo:** `src/service/UsuarioService.ts`
**Clase:** `UsuarioService`
**Método:** `agregarAlojamientoAFavoritos`, `publicarAlojamientoPropietario`

**Tipo de problema:** Condicional de tipo en tiempo de ejecución en lugar de polimorfismo.
**Antipatrón:** Type-checking / downcast (`instanceof`) — síntoma de que la jerarquía `Usuario` no se está usando de forma polimórfica.

**Descripción:**
```ts
if (!(usuario instanceof Inquilino)) { throw new Error("..."); }
// ...
if (!(usuario instanceof Propietario)) { throw new Error("..."); }
```
El servicio obtiene un `Usuario` genérico del repositorio y luego debe "adivinar" su subtipo real mediante `instanceof` antes de poder invocar el método específico (`guardarFavorito`, `publicarAlojamiento`).

**Por qué representa un problema:**
Cada nuevo rol de usuario (el dominio ya menciona roles/perfiles adicionales implícitos) exigirá añadir un nuevo `if (usuario instanceof NuevoRol)` en cada método afectado — es exactamente el escenario que **OCP** busca evitar (modificar código existente para soportar un caso nuevo). Además, es un indicio de que la base `Usuario` no expone un contrato polimórfico suficiente, y de que el campo `rol: string` (dato) y la subclase real (tipo) son dos fuentes de verdad independientes que podrían desincronizarse (nada impide crear un `Inquilino` con `rol: "Propietario"`).

**Principio SOLID afectado:** **OCP** (hay que modificar el `if/else` para cada nuevo tipo) y, tangencialmente, **LSP** (el código no confía en la sustituibilidad de `Usuario`; necesita conocer el subtipo concreto para operar correctamente).

**Severidad:** Media-Alta

**Impacto:** Cada rol nuevo añadido al dominio (el enunciado del proyecto ya sugiere que puede haber más de dos tipos de actor) implica tocar `UsuarioService` en varios lugares.

**Propuesta de refactorización:** Resolver junto con el Problema 4 — si `FavoritosService` solo recibe `Inquilino` (no `Usuario`) desde el controlador/capa de aplicación (usando el resultado ya tipado del repositorio, o un repositorio especializado `buscarInquilinoPorId`), el `instanceof` desaparece. Alternativa: mantener un único repositorio de `Usuario` pero resolver el tipo con un patrón *visitor* o *narrowing* explícito una sola vez en la frontera (Application layer), no repetido en cada método.

**Principio de diseño utilizado:** Polimorfismo sobre condicionales de tipo; segregar por rol en la capa de Application.

**Dependencias afectadas:** `UsuarioService`, `Usuario`, `Inquilino`, `Propietario`.

**Riesgos de la modificación:** Medio — requiere decidir si el repositorio de usuarios debe exponer métodos tipados por rol o si el narrowing se hace en la capa de aplicación.

**Ejemplo conceptual:**
```ts
// En vez de instanceof disperso, se resuelve una vez en la frontera:
async function obtenerInquilino(id: number, repo: IUsuarioRepository): Promise<Inquilino> {
  const u = await repo.buscarPorId(id);
  if (!(u instanceof Inquilino)) throw new UsuarioNoEsInquilinoError(id);
  return u;
}
```

---

## Problema 6

**Archivo:** `src/controller/AlojamientoController.ts`, `src/controller/UsuarioController.ts`
**Clase:** `AlojamientoController`, `UsuarioController`
**Método:** Todos los métodos (`crear`, `obtener`, `cambiarEstado`, `registrar`, `agregarFavorito`, `publicarAlojamiento`)

**Tipo de problema:** Mapeo de errores a código de transporte (HTTP status) hardcodeado por método, no por tipo de error.
**Antipatrón:** Condicional/mapa artificial disperso (no exactamente "condicionales excesivos" en el sentido de `if/else` anidados, sino un mapeo implícito y frágil: "este método siempre responde 400 en error", "este otro siempre 404").

**Descripción:**
```ts
public async obtener(id: number) {
  try { ... return { status: 200, data: ... }; }
  catch (error: any) { return { status: 404, error: error.message }; }
}
public async cambiarEstado(id: number, nuevoEstado: string) {
  try { ... }
  catch (error: any) { return { status: 400, error: error.message }; } // pero internamente llama a obtenerPorId, que puede lanzar "no encontrado"
}
```
`cambiarEstadoAlojamiento` llama internamente a `obtenerPorId`, que lanza el mismo tipo de error ("no encontrado") que en `obtener` se traduce a 404 — pero en `cambiarEstado` ese mismo error se traduce incorrectamente a 400, porque el status code está fijado por método y no por la naturaleza del error.

**Por qué representa un problema:**
El día que estos controladores se conecten a Express (el propósito declarado de la dependencia ya instalada), esta inconsistencia producirá respuestas HTTP semánticamente incorrectas. Es además un ejemplo de responsabilidad de transporte (HTTP status) mezclada con lógica de la capa Application: los `Service` lanzan `Error` genéricos sin tipo, y el `Controller` adivina el código HTTP por convención de método en lugar de por el tipo real del error.

**Principio SOLID afectado:** **SRP** (el controlador está resolviendo, con conocimiento incompleto, una responsabilidad — mapeo semántico de errores — que debería resolver el tipo de excepción, no la ubicación del `catch`).

**Severidad:** Media

**Impacto:** Bugs de API silenciosos una vez exista una capa HTTP real; hoy no es visible porque nada consume estos controladores por HTTP.

**Propuesta de refactorización:** Introducir excepciones de dominio tipadas (`NotFoundError`, `ConflictError`, `ValidationError`) lanzadas desde los `Service`, y un mapeo centralizado error→status (p. ej. en un middleware Express o en una función `mapErrorToHttpStatus` compartida), eliminando la necesidad de que cada método de cada controlador "adivine" el código.

**Principio de diseño utilizado:** Separación Application/Presentation; manejo de errores basado en tipos, no en convención posicional.

**Dependencias afectadas:** `AlojamientoService`, `UsuarioService`, ambos controladores.

**Riesgos de la modificación:** Bajo-Medio — cambia el tipo de las excepciones lanzadas, lo que puede requerir ajustar cualquier código que compare `error.message` como string (no se detectó ninguno hoy, pero revisar antes de aplicar).

**Ejemplo conceptual:**
```ts
export class NotFoundError extends Error {}
export class ConflictError extends Error {}
// Service:
throw new NotFoundError(`Alojamiento con ID ${id} no fue encontrado.`);
// Middleware / mapeo centralizado:
if (error instanceof NotFoundError) return { status: 404, error: error.message };
if (error instanceof ConflictError) return { status: 409, error: error.message };
return { status: 400, error: error.message };
```

---

## Problema 7

**Archivo:** `src/model/Alojamiento/Apartamento.ts`, `Casa.ts`, `Pensionado.ts`
**Clase:** `Apartamento`, `Casa`, `Pensionado`
**Método:** Todos (constructor, `agregarServicio`, `getServiciosIncluidos`, `requiereContratoAnual`, `agregarRegla`, `getReglas`)

**Tipo de problema:** Duplicación total de código entre subtipos.
**Antipatrón:** Duplicated Code / herencia (por interfaz) sin diferenciación de comportamiento real.

**Descripción:**
Las tres clases que implementan `TipoAlojamiento` son **idénticas byte a byte** salvo el string devuelto por `getNombreTipo()` (`"APARTAMENTO"`, `"CASA"`, `"PENSIONADO"`). Ninguna sobreescribe `requiereContratoAnual`, `agregarServicio`, etc. con lógica propia.

**Por qué representa un problema:**
Cualquier corrección o regla nueva compartida (p. ej. "un servicio no puede repetirse", o "máximo 10 reglas por alojamiento") debe aplicarse **tres veces**, con el riesgo de que se aplique en dos de las tres y no en la restante (Shotgun Surgery). Al mismo tiempo, la abstracción `TipoAlojamiento` como interfaz *podría* ser la decisión correcta a futuro (si cada tipo termina necesitando reglas propias — es coherente con el dominio: por ejemplo, un Pensionado normalmente incluye comida y no exige contrato anual), pero **hoy** no aporta ningún comportamiento diferenciado, por lo que su triplicación actual es puro costo sin beneficio.

**Principio SOLID afectado:** No es estrictamente una violación de SOLID (no rompe OCP ni SRP por sí sola), pero contradice el principio de diseño DRY y aumenta el costo de mantenimiento — indirectamente afecta OCP porque "agregar una regla común a todos los tipos" hoy requiere modificar 3 clases en vez de 1.

**Severidad:** Media

**Impacto:** Mantenimiento — bajo riesgo funcional inmediato porque hoy el comportamiento es simple, pero el costo crece con cada regla nueva.

**Propuesta de refactorización:** Extraer una clase base concreta `TipoAlojamientoBase` con la lógica común (servicios, reglas, contrato anual) y dejar que `Apartamento`/`Casa`/`Pensionado` solo definan lo que realmente los distingue (`getNombreTipo()`, y a futuro reglas por defecto propias de cada tipo, p. ej. Pensionado con servicios por defecto). Alternativa más simple: si a mediano plazo no se prevén diferencias de comportamiento reales, colapsar a una sola clase `TipoAlojamiento` con un campo `nombreTipo` (enum), evitando sobre-ingeniería de una jerarquía que no se usa. Esta decisión debe tomarse con el equipo (ver Plan de Refactorización) y no de forma unilateral, porque el dominio (`Preferencia.esTipoCompatible`) ya depende de comparar `getNombreTipo()`.

**Principio de diseño utilizado:** DRY + Template Method (si se mantiene la jerarquía) o composición sobre herencia (si se colapsa).

**Dependencias afectadas:** `Alojamiento`, `Preferencia`, `main.ts`.

**Riesgos de la modificación:** Medio — es una decisión de diseño de dominio (¿los tipos de alojamiento divergirán en comportamiento?), no solo técnica. Se recomienda decidir con el usuario antes de tocar esta jerarquía.

**Ejemplo conceptual:**
```ts
abstract class TipoAlojamientoBase implements TipoAlojamiento {
  protected serviciosEspecificos: string[] = [];
  protected reglasEspecificas: Regla[] = [];
  constructor(protected contratoAnual: boolean, servicios: string[] = []) { this.serviciosEspecificos = servicios; }
  agregarServicio(s: string) { this.serviciosEspecificos.push(s); }
  getServiciosIncluidos() { return this.serviciosEspecificos; }
  requiereContratoAnual() { return this.contratoAnual; }
  agregarRegla(r: Regla) { this.reglasEspecificas.push(r); }
  getReglas() { return this.reglasEspecificas; }
  abstract getNombreTipo(): string;
}
class Apartamento extends TipoAlojamientoBase { getNombreTipo() { return "APARTAMENTO"; } }
```

---

## Problema 8

**Archivo:** `src/model/Alojamiento/Alojamiento.ts`, `src/model/Usuario/Usuario.ts`, `src/model/Solicitud.ts`, `src/model/Reserva.ts`, `src/model/PublicacionRoomie.ts`
**Clase:** `Alojamiento` (`estado`), `Usuario` (`estado`), `Solicitud` (`estado`), `Reserva` (`estado`), `PublicacionRoomie` (`estado`)
**Método:** N/A (campo)

**Tipo de problema:** Primitive Obsession.
**Antipatrón:** Primitive Obsession — un `string` libre representa un conjunto cerrado de estados.

**Descripción:**
Cinco entidades distintas modelan su estado como `string` sin restricción de tipo: `Alojamiento.estado` ("Disponible"/"Ocupado", visto en `index.ts`), `Usuario.estado` ("Activo"), `Solicitud.estado` ('PENDIENTE'/'ACEPTADA'/'RECHAZADA'/'CANCELADA', validado únicamente con comparaciones de string dentro de sus propios métodos), `Reserva.estado` (similar), `PublicacionRoomie.estado`. Cada clase reimplementa su propia mini máquina de estados con comparaciones de texto (`if (this.estado !== 'PENDIENTE')`).

**Por qué representa un problema:**
El compilador no impide pasar `"pendiente"` en minúscula, `"Pendiente "` con espacio, o un valor de otro dominio (p. ej. usar el estado de `Reserva` donde se espera el de `Solicitud`). Ya se observó en `main.ts` que se pasa `"Confirmada"` a `Reserva` (que internamente usa `'CONFIRMADA'` en mayúsculas) — un desajuste de este tipo pasaría silenciosamente en producción real, no solo en el smoke test.

**Principio SOLID afectado:** No es un principio SOLID en sentido estricto, pero degrada la capacidad de aplicar **OCP** correctamente: para añadir un nuevo estado o una nueva transición válida hay que editar cadenas de texto dispersas en vez de extender un tipo/enum central.

**Severidad:** Media

**Impacto:** Bugs difíciles de detectar (typos en strings), sin ayuda del compilador ni del IDE (autocompletar).

**Propuesta de refactorización:** Introducir un `enum` (o union type literal) por cada máquina de estados: `EstadoSolicitud`, `EstadoReserva`, `EstadoAlojamiento`, `EstadoPublicacionRoomie`, `EstadoUsuario`. No requiere cambiar la lógica de transición, solo el tipo del campo y las comparaciones.

**Principio de diseño utilizado:** Value Objects / tipos nominales en vez de primitivos (ya aplicado correctamente en otras partes del mismo proyecto, como `Precio`, `Ubicacion`, `RangoPresupuesto` — es decir, el propio código ya demuestra que el equipo sabe aplicar este patrón, solo falta extenderlo a los campos de estado).

**Dependencias afectadas:** `Alojamiento`, `Usuario`, `Solicitud`, `Reserva`, `PublicacionRoomie`, y sus respectivos controllers/services que reciben el estado como parámetro (`cambiarEstadoAlojamiento(id, nuevoEstado: string)`).

**Riesgos de la modificación:** Bajo — es un cambio de tipo con bajo impacto de comportamiento; el riesgo principal es sincronizar los strings literales usados hoy (`'PENDIENTE'`, `"Disponible"`, etc.) con los valores del enum sin cambiar su significado.

**Ejemplo conceptual:**
```ts
export enum EstadoSolicitud { PENDIENTE = "PENDIENTE", ACEPTADA = "ACEPTADA", RECHAZADA = "RECHAZADA", CANCELADA = "CANCELADA" }
```

---

## Problema 9

**Archivo:** `src/service/UsuarioService.ts`, `src/model/Usuario/Propietario.ts`, `src/repository/InMemoryAlojamientoRepository.ts`
**Clase:** `UsuarioService`
**Método:** `publicarAlojamientoPropietario`

**Tipo de problema:** Doble fuente de verdad para la misma relación.
**Antipatrón:** Shotgun Surgery / inconsistencia de datos latente.

**Descripción:**
```ts
usuario.publicarAlojamiento(alojamiento);       // guarda el alojamiento DENTRO del array del Propietario
await this.alojamientoRepo.guardar(alojamiento); // Y TAMBIÉN lo guarda en el repositorio de alojamientos
await this.usuarioRepo.guardar(usuario);         // Y TAMBIÉN persiste el usuario (con su array actualizado)
```
La relación "un alojamiento pertenece a un propietario" se representa dos veces: como array `alojamientosPropietario` dentro de `Propietario`, y como colección independiente en `InMemoryAlojamientoRepository`. Lo mismo ocurre con `Inquilino.favoritos/solicitudes/publicacionesRoomie`.

**Por qué representa un problema:**
Ambas copias deben mantenerse sincronizadas manualmente en cada operación. Si en el futuro se agrega, por ejemplo, `eliminarAlojamiento` en el `Service` sin recordar también actualizar el array interno del `Propietario` (o viceversa, como ya existe `Propietario.eliminarAlojamiento` que **no** se refleja en `alojamientoRepo`), los dos "orígenes de la verdad" divergen.

**Principio SOLID afectado:** **SRP** — `Propietario` (una entidad de dominio) está asumiendo una responsabilidad de índice/colección que ya cubre el repositorio; se solapan dos responsabilidades sobre el mismo dato.

**Severidad:** Media

**Impacto:** Riesgo de inconsistencia de datos si el proyecto crece más allá del repositorio en memoria (p. ej. al migrar a una base de datos real, sincronizar dos "tablas" manualmente es una fuente común de bugs).

**Propuesta de refactorización:** Decidir una única fuente de verdad para la relación Propietario↔Alojamiento: (a) que `Propietario` no almacene la lista y se consulte siempre vía `alojamientoRepo.listarPorPropietarioId(id)` (requiere agregar `propietarioId` a `Alojamiento`), o (b) que el repositorio de usuarios sea la única fuente y `AlojamientoRepository` no se use para "pertenencia" sino solo para "existencia/búsqueda". La opción (a) es más alineada con el diseño orientado a agregados/relacional que sugiere el dominio (Alojamiento como entidad propia, no un value object dentro de Usuario).

**Principio de diseño utilizado:** Single Source of Truth / diseño de agregados (DDD-lite).

**Dependencias afectadas:** `Propietario`, `Inquilino`, `UsuarioService`, `AlojamientoService`, ambos repositorios.

**Riesgos de la modificación:** Medio-Alto — toca el modelo de relaciones del dominio; requiere alinear con el equipo antes de decidir cuál es la fuente de verdad (se recomienda tratarlo en el plan, no de forma aislada).

**Ejemplo conceptual:** Añadir `propietarioId: number` a `Alojamiento` y resolver `getAlojamientosDe(propietarioId)` consultando `IAlojamientoRepository`, eliminando el array redundante de `Propietario`.

---

## Problema 10

**Archivo:** `src/model/Resena.ts`, `src/model/Alojamiento/Regla.ts`
**Clase:** `Resena`, `Regla`
**Método:** N/A (ausencia de métodos)

**Tipo de problema:** Inconsistencia de diseño / incompletitud.
**Antipatrón:** Ninguno formal, pero rompe el patrón consistente del resto del código base (toda otra clase de dominio expone getters).

**Descripción:**
`Resena` y `Regla` son las únicas clases del dominio sin un solo método público de lectura (`get*`). Todos sus campos son privados y no hay forma de leer `puntuacion`, `comentario`, `fecha` (`Resena`) ni `nombre`, `descripcion` (`Regla`) desde fuera de la clase.

**Por qué representa un problema:**
Ya se evidenció en `main.ts` (`resena.getAutor()`, `.getPuntuacion()`, `.getComentario()`) que el propio equipo esperaba poder leer estos datos y no puede. Esto hace que estas dos entidades sean, en la práctica, de solo escritura — no cumplen ningún propósito útil para el resto del sistema (ej. mostrarlas en una respuesta de API).

**Principio SOLID afectado:** No aplica directamente un principio SOLID; es un defecto de completitud que sin embargo bloquea la capa de Presentation (no hay forma de serializar una `Resena` o `Regla` para exponerla).

**Severidad:** Baja

**Impacto:** Bajo hoy (nada las consume vía getters todavía), pero bloqueante en cuanto se necesite mostrar reseñas o reglas al usuario final.

**Propuesta de refactorización:** Agregar los getters faltantes siguiendo el mismo estilo ya usado en el resto del dominio (p. ej. `Precio`, `Caracteristica`).

**Principio de diseño utilizado:** Consistencia de encapsulamiento (mismo patrón get* del resto del código).

**Dependencias afectadas:** Ninguna hoy (nadie las llama); futuros consumidores (capa Presentation).

**Riesgos de la modificación:** Muy bajo — es aditivo, no cambia comportamiento existente.

---

## Problema 11

**Archivo:** `src/model/Usuario/Perfil.ts`, `src/model/Alojamiento/Preferencia.ts`
**Clase:** `Perfil`, `Preferencia`
**Método:** Constructor

**Tipo de problema:** Estilo de código frágil (uso de operador coma).
**Antipatrón:** N/A (no es un antipatrón de diseño, es un riesgo de mantenibilidad menor).

**Descripción:**
```ts
constructor(...) {
  this.id = id,
  this.foto = foto,
  this.biografia = biografia,
  ...
}
```
Las asignaciones están encadenadas con el operador coma (`,`) en lugar de punto y coma (`;`). Funciona hoy porque el operador coma simplemente evalúa cada expresión en secuencia, pero es una construcción inusual que puede ocultar errores si alguien inserta una expresión condicional o de retorno en medio de la cadena.

**Por qué representa un problema:**
No es un bug hoy, pero es un patrón que ningún linter de estilo recomendaría, y que puede confundir a quien no esté familiarizado con el operador coma de JavaScript/TypeScript, aumentando el riesgo de introducir errores sutiles al editar estas clases.

**Principio SOLID afectado:** Ninguno — es un hallazgo de calidad de código, no de diseño, incluido aquí por transparencia y para no "esconder" nada detectado durante la auditoría.

**Severidad:** Baja

**Impacto:** Cosmético/mantenibilidad; no afecta funcionalidad actual.

**Propuesta de refactorización:** Reemplazar comas por punto y coma. Cambio mecánico, sin riesgo.

**Principio de diseño utilizado:** Claridad de código (Clean Code), no un principio SOLID.

**Dependencias afectadas:** Ninguna.

**Riesgos de la modificación:** Ninguno.

---

## Problema 12

**Archivo:** *(gap estructural — ningún archivo)*
**Clase:** `Solicitud`, `Reserva`, `Resena`, `PublicacionRoomie`
**Método:** N/A

**Tipo de problema:** Cobertura incompleta de capas (Repository/Service/Controller ausentes).
**Antipatrón:** N/A — es una brecha de completitud de la arquitectura objetivo, no un antipatrón del código existente.

**Descripción:**
`Alojamiento` y `Usuario` tienen su ciclo completo: modelo → interfaz de repositorio → repositorio en memoria → service → controller. En cambio, `Solicitud`, `Reserva`, `Resena` y `PublicacionRoomie` son clases de dominio completas (con sus propias reglas de transición de estado, ver `Solicitud.aceptarSolicitud/rechazarSolicitud/cancelarSolicitud`, `Reserva.reservar/confirmarReserva/cancelarReserva`) pero **no tienen ningún repositorio, service ni controller**. Hoy solo se manipulan como sub-objetos dentro de `Inquilino` (arrays en memoria, nunca persistidos de forma independiente).

**Por qué representa un problema:**
Es información importante para dimensionar el trabajo pendiente: buena parte del dominio descrito en el enunciado del proyecto (favoritos, solicitudes, reseñas, reportes, notificaciones) todavía no tiene ningún flujo de aplicación real más allá de `favoritos` y `publicar alojamiento`. No es una violación de SOLID, pero condiciona el plan de refactorización: antes de "perfeccionar" SOLID en el 20% del código que ya tiene flujo completo, hay que decidir si se construye el 80% restante seleccionando ya el patrón correcto (evitando repetir los mismos antipatrones al copiar el patrón actual de `AlojamientoService`/`UsuarioService`).

**Principio SOLID afectado:** N/A directo; relevante para **DIP** una vez se construyan estos repositorios (deben nacer con interfaz desde el día uno, no como una migración posterior).

**Severidad:** Media (informativo/planificación, no corrección urgente)

**Impacto:** Alcance del proyecto; ninguno de estos flujos es hoy alcanzable desde un controller.

**Propuesta de refactorización:** No implica "arreglar" nada existente; se documenta para que el plan de trabajo posterior a esta auditoría contemple crear `ISolicitudRepository`, `IReservaRepository`, etc. **desde el inicio** con el mismo patrón (ya correcto) usado en `IAlojamientoRepository`.

**Principio de diseño utilizado:** Repository pattern + DIP, aplicado consistentemente desde el origen.

**Dependencias afectadas:** Futuras — `Solicitud`, `Reserva`, `Resena`, `PublicacionRoomie`.

**Riesgos de la modificación:** N/A (no es una modificación, es una nota de alcance).

---

# Auditoría SOLID

## SRP
- **`UsuarioService`** mezcla 4 responsabilidades no relacionadas (registro, favoritos de Inquilino, publicación de Propietario, perfil). Propuesta: dividir en `RegistroUsuarioService`, `FavoritosService`, `PublicacionAlojamientoService`, `PerfilService` (Problema 4).
- **`Propietario`/`Inquilino`** asumen una responsabilidad de "índice de relaciones" (arrays de alojamientos/favoritos/solicitudes) que se solapa con la responsabilidad de los repositorios (Problema 9). La entidad de dominio debería centrarse en invariantes propias del actor, no en llevar el índice completo de sus relaciones.
- El resto de clases (`Alojamiento`, `Precio`, `Ubicacion`, `Caracteristica`, `RangoPresupuesto`, `Regla`, `InformacionAcademica`) tienen una responsabilidad clara y acotada — **no se identificó** un God Class real en el estado actual del código; el tamaño del proyecto todavía es pequeño. Se deja constancia explícita de esto para no sobre-diagnosticar.

## OCP
- **`UsuarioService`** requiere modificar sus métodos (`instanceof Inquilino` / `instanceof Propietario`) cada vez que se agregue un nuevo tipo de actor (Problema 5).
- **`AlojamientoController`/`UsuarioController`** tienen el código HTTP fijado por método en vez de por tipo de excepción; agregar un nuevo tipo de error de dominio obliga a revisar todos los `catch` existentes en vez de extender un mapa de errores (Problema 6).
- **`Apartamento`/`Casa`/`Pensionado`**: agregar una regla de negocio común a todos los tipos de alojamiento hoy exige tocar las tres clases (Problema 7).

## LSP
- No se detectaron violaciones estrictas de sustitución (ninguna subclase debilita precondiciones ni fortalece postcondiciones de forma que rompa el contrato de su superclase/interfaz).
- `Apartamento`/`Casa`/`Pensionado` son 100% sustituibles entre sí hoy (lo cual, paradójicamente, es la evidencia de que la jerarquía todavía no diferencia comportamiento — ver Problema 7).
- El uso de `instanceof` en `UsuarioService` (Problema 5) es un síntoma **adyacente** a LSP: el código no confía en tratar a `Usuario` polimórficamente y necesita el tipo concreto para operar correctamente, lo que sugiere que el contrato de la superclase `Usuario` no es suficiente para las operaciones que el sistema necesita realizar.

## ISP
- Las interfaces actuales (`IAlojamientoRepository`, `TipoAlojamiento`) son pequeñas y cohesivas; **no se detectó** una interfaz "gorda" que fuerce a un cliente a depender de métodos que no usa.
- El caso límite es `TipoAlojamiento`, que agrupa gestión de servicios + gestión de reglas + contrato anual + nombre. Hoy `Alojamiento` (el único cliente) usa todos esos métodos, así que no hay violación real de ISP — se deja como punto de vigilancia si en el futuro un cliente solo necesitara, por ejemplo, leer el nombre del tipo sin la gestión de reglas.
- `IUsuarioRepository` no puede evaluarse en su diseño porque **el archivo está vacío** (Problema 1) — es un defecto distinto (DIP/compilación), no de ISP.

## DIP
- **Lo que ya está bien:** `AlojamientoService` y `UsuarioService` dependen de abstracciones (`IAlojamientoRepository`, `IUsuarioRepository`) y no de las clases `InMemory*` concretas — el patrón Repository + inyección por constructor **ya está correctamente aplicado** en el diseño intencional del proyecto. Este es un acierto que debe preservarse, no revertirse.
- **Lo que está roto:** esa abstracción para Usuario no existe realmente en tiempo de compilación porque `IUsuarioRepository.ts` está vacío (Problema 1) — es una violación *de facto*, aunque la intención de diseño sea correcta.
- **Composición manual repetida:** sin un composition root único, la inversión de dependencias se logra "a mano" en tres lugares distintos (Problema 3), lo que es fértil para inconsistencias.
- No se detectó ningún acceso directo de la lógica de negocio (`Service`, modelos de dominio) a infraestructura externa (no hay SQL, HTTP, filesystem embebido en el dominio) — el dominio actual está limpio de estas dependencias, lo cual es una fortaleza a preservar en la refactorización.

---

# Mapa de Dependencias

```
Presentation (inexistente hoy)
        │  (Express instalado, no usado; sin rutas)
        ▼
Controller  ── depende de concreto ──▶  Service
(AlojamientoController)                 (AlojamientoService)
(UsuarioController)                     (UsuarioService)
        │                                      │
        │                                      │ depende de ABSTRACCIÓN (✅ correcto)
        │                                      ▼
        │                          IAlojamientoRepository  /  IUsuarioRepository (⚠️ vacía)
        │                                      │
        │                                      │ implementada por
        │                                      ▼
        │                          InMemoryAlojamientoRepository
        │                          InMemoryUsuarioRepository
        │
        └── construidos manualmente en 3 composition roots duplicados:
            main.ts / src/index.ts / src/indexUsuario.ts   (⚠️ Shotgun Surgery)

Domain (sin dependencias de infraestructura — correcto):
  Usuario ◀── extends ── Propietario ── usa ──▶ Alojamiento
           ◀── extends ── Inquilino  ── usa ──▶ Alojamiento, Solicitud, PublicacionRoomie
  Alojamiento ── usa ──▶ TipoAlojamiento (Apartamento|Casa|Pensionado), Ubicacion, Caracteristica, Precio, Regla
  Preferencia ── usa ──▶ RangoPresupuesto, TipoAlojamiento
  Solicitud, Reserva, PublicacionRoomie ── usan ──▶ Alojamiento
  Resena ── (sin dependencias)
```

**Dependencias concretas que deberían ser abstracciones:**
- `Controller → Service`: hoy es una dependencia directa a la clase concreta (`AlojamientoService`, no una interfaz `IAlojamientoService`). Es aceptable en un proyecto de este tamaño (no se recomienda introducir una interfaz "porque sí" — sería sobre-ingeniería sin un segundo caso de uso real que la justifique), pero se vuelve relevante si en el futuro se necesitan mocks de servicio para testear controladores sin levantar toda la cadena Service→Repository.

**Dónde hay acoplamiento fuerte:**
- `UsuarioService` acoplado simultáneamente a `IUsuarioRepository` **y** `IAlojamientoRepository` (dos abstracciones en una sola clase) — consecuencia directa del Problema 4 (mezcla de responsabilidades de Inquilino y Propietario).
- `Propietario`/`Inquilino` acoplados a `Alojamiento` (y `Inquilino` además a `Solicitud` y `PublicacionRoomie`) mediante arrays internos — acoplamiento de datos duplicado con los repositorios (Problema 9).

**Dónde podrían existir ciclos:**
- Hoy **no hay ciclos de importación** reales en el código que compila (`Alojamiento` no importa `Usuario`; `Solicitud`/`Reserva`/`PublicacionRoomie` solo importan `Alojamiento`).
- **Riesgo latente:** `main.ts` (Problema 2) construye `Reserva` y `Resena` pasándoles un `Inquilino` como parámetro, lo cual sugiere que el diseño *pretendido* es `Reserva/Resena → Usuario`. Si además en algún momento `Usuario`/`Propietario` necesitara conocer sus `Reserva`s (de forma simétrica a como ya conoce sus `Alojamiento`s), se formaría un ciclo `Usuario → Alojamiento → (futuro) Reserva → Usuario`. Se recomienda decidir explícitamente el dueño de esa relación (probablemente un futuro `ReservaRepository` consultado por `usuarioId`/`alojamientoId`, no una referencia bidireccional en memoria) antes de implementar Reservas de forma completa.

---

# Arquitectura Objetivo

```
┌─────────────────────────────────────────────────────────────┐
│ Presentation                                                 │
│  - Rutas Express, controllers HTTP, DTOs de entrada/salida,  │
│    middleware de mapeo de errores (tipo de excepción → status)│
│  - Responsabilidad: traducir HTTP ⇄ llamadas a Application.  │
│    NO contiene reglas de negocio.                             │
└───────────────────────────┬───────────────────────────────────┘
                             │ depende de (interfaces/casos de uso)
┌───────────────────────────▼───────────────────────────────────┐
│ Application                                                   │
│  - Casos de uso / Services por actor y por función            │
│    (RegistroUsuarioService, FavoritosService,                 │
│     PublicacionAlojamientoService, PerfilService,              │
│     AlojamientoService, futuros SolicitudService,             │
│     ReservaService, ResenaService, NotificacionService)       │
│  - Orquesta el Domain y los puertos de Infrastructure          │
│    (a través de interfaces, nunca de clases concretas)        │
│  - Lanza excepciones de dominio tipadas (NotFoundError, etc.)  │
└───────────────────────────┬───────────────────────────────────┘
                             │ depende de (interfaces)          ▲ implementa
┌───────────────────────────▼──────────────────┐  ┌─────────────┴─────────────┐
│ Domain                                        │  │ Infrastructure             │
│  - Entidades (Alojamiento, Usuario, Solicitud,│  │  - Repositorios concretos   │
│    Reserva, Resena, PublicacionRoomie...)     │  │    (InMemory hoy, SQL/ORM  │
│  - Value Objects (Precio, Ubicacion,          │  │    a futuro)                │
│    RangoPresupuesto, Caracteristica)          │  │  - Adaptadores externos     │
│  - Reglas de negocio propias de cada entidad  │  │    (notificaciones, email)  │
│    (transiciones de estado, invariantes)      │  │  - Implementa las interfaces│
│  - Interfaces de puertos (IAlojamientoRepo,   │  │    definidas en Domain      │
│    IUsuarioRepository, ISolicitudRepo...)     │  │                             │
│  - CERO dependencias hacia las otras capas    │  │                             │
└────────────────────────────────────────────────┘  └─────────────────────────────┘
```

**Responsabilidad de cada capa:**
- **Domain:** el corazón del negocio — entidades, value objects, invariantes y **las interfaces de los repositorios** (el puerto se define aquí, no en Infrastructure). No conoce Express, ni `InMemory*`, ni HTTP. Esto ya es mayormente cierto en el código actual — es la capa más sana del proyecto.
- **Application:** orquesta casos de uso concretos, un servicio por responsabilidad (no un mega-service por entidad), habla con Domain a través de sus propias entidades e interfaces, nunca con Infrastructure directamente.
- **Infrastructure:** implementaciones concretas de los puertos definidos en Domain (hoy: en memoria; a futuro: base de datos), y cualquier detalle técnico (drivers, SDKs).
- **Presentation:** adaptador de entrada (HTTP/Express), traduce requests a llamadas de Application y respuestas de Application a HTTP, sin lógica de negocio.

Esta arquitectura objetivo **no reorganiza carpetas todavía** — es el norte contra el cual se evalúa cada tarea del plan siguiente.

---

# Plan de Refactorización Incremental

> Ordenado por prioridad. Ninguna tarea reescribe el sistema; cada una es acotada y verificable de forma independiente.

### Tarea 1 — Completar `IUsuarioRepository`
1. **Problema que resuelve:** Problema 1 (interfaz vacía, proyecto no compila).
2. **Principio SOLID aplicado:** DIP.
3. **Archivos afectados:** `src/repository/IUsuarioRepository.ts`.
4. **Clases afectadas:** `IUsuarioRepository` (nueva definición), sin tocar `InMemoryUsuarioRepository` ni `UsuarioService` (ya escritos contra esa interfaz).
5. **Cambio esperado:** El proyecto compila sin errores relacionados con `IUsuarioRepository`.
6. **Riesgo:** Muy bajo.
7. **Cómo comprobar que no se rompió nada:** `npx tsc --noEmit` deja de reportar los 2 errores `TS2305` sobre este archivo; `npx tsx src/indexUsuario.ts` sigue imprimiendo el mismo resultado que hoy.

### Tarea 2 — Resolver `main.ts` (decidir: actualizar o retirar)
1. **Problema que resuelve:** Problema 2 (entry point real no compila / desincronizado).
2. **Principio SOLID aplicado:** N/A directo — habilita verificación continua para todas las tareas SOLID posteriores.
3. **Archivos afectados:** `main.ts` (y `package.json` si cambia el script de entrada).
4. **Clases afectadas:** Ninguna clase de dominio se modifica; se decide cuál es la fuente de verdad de sus firmas.
5. **Cambio esperado:** `npm run build` y `npm start` funcionan sin errores de tipos.
6. **Riesgo:** Medio — requiere una decisión explícita del usuario sobre si `Reserva`/`Resena` deben conocer al `Inquilino` (ver nota en Problema 2). **Se recomienda tratar esta decisión en la siguiente conversación, no asumirla.**
7. **Cómo comprobar:** `npx tsc --noEmit` sin errores; ejecución manual reproduce la salida esperada en consola.

### Tarea 3 — Introducir un Composition Root único
1. **Problema que resuelve:** Problema 3 (tres puntos de construcción manual duplicados).
2. **Principio SOLID aplicado:** DIP (consistencia en la inyección de dependencias).
3. **Archivos afectados:** nuevo `src/bootstrap.ts`; `main.ts`, `src/index.ts`, `src/indexUsuario.ts` pasan a consumirlo (o se consolidan en un solo script de smoke-test).
4. **Clases afectadas:** Ninguna clase de dominio/service/repository cambia su código interno.
5. **Cambio esperado:** Un solo lugar construye el grafo de dependencias; los demás archivos lo reutilizan.
6. **Riesgo:** Bajo, siempre que se ejecute después de la Tarea 2.
7. **Cómo comprobar:** Los tres scripts de prueba siguen produciendo la misma salida por consola que antes de la tarea.

### Tarea 4 — Excepciones de dominio tipadas + mapeo de errores centralizado
1. **Problema que resuelve:** Problema 6 (status HTTP hardcodeado por método, no por tipo de error).
2. **Principio SOLID aplicado:** SRP (separar "qué pasó" de "cómo se traduce a HTTP").
3. **Archivos afectados:** nuevo `src/domain/errors.ts` (o similar); `AlojamientoService`, `UsuarioService` (cambian `throw new Error(...)` por `throw new NotFoundError(...)` etc.); `AlojamientoController`, `UsuarioController` (usan un mapeo común en vez de status fijo).
4. **Clases afectadas:** `AlojamientoService`, `UsuarioService`, `AlojamientoController`, `UsuarioController`.
5. **Cambio esperado:** Un error de "no encontrado" siempre resulta en 404 sin importar desde qué método del controller se originó.
6. **Riesgo:** Bajo-Medio — verificar que nada dependa del texto exacto de `error.message` (no se detectó tal dependencia hoy).
7. **Cómo comprobar:** Casos de prueba manuales (o smoke tests) que fuercen cada tipo de error desde cada método público de ambos controladores y verifiquen el status devuelto.

### Tarea 5 — Dividir `UsuarioService` por caso de uso
1. **Problema que resuelve:** Problema 4 (SRP) y, como efecto colateral, Problema 5 (los `instanceof` se reducen porque cada servicio nuevo ya sabe con qué rol trabaja).
2. **Principio SOLID aplicado:** SRP, y mejora indirecta de OCP.
3. **Archivos afectados:** `src/service/UsuarioService.ts` se divide en varios archivos nuevos; `UsuarioController` ajusta sus dependencias (constructor).
4. **Clases afectadas:** `UsuarioService` (se retira o se reduce a un caso de uso genérico de registro), nuevas: `FavoritosService`, `PublicacionAlojamientoService`, `PerfilService`; `UsuarioController`.
5. **Cambio esperado:** Cada servicio nuevo tiene una sola razón para cambiar; el comportamiento observable (inputs/outputs de cada operación) no cambia.
6. **Riesgo:** Medio — cambia la forma de construir `UsuarioController` (más dependencias inyectadas); mitigar apoyándose en el Composition Root de la Tarea 3.
7. **Cómo comprobar:** Repetir exactamente los mismos escenarios de `src/indexUsuario.ts` (registrar Propietario, registrar Inquilino, agregar favorito, publicar alojamiento) y confirmar mismos resultados/mensajes que antes de la división.

### Tarea 6 — Colapsar o diferenciar `Apartamento`/`Casa`/`Pensionado`
1. **Problema que resuelve:** Problema 7 (duplicación total de código).
2. **Principio SOLID aplicado:** Reducción de riesgo sobre OCP a futuro (una sola clase base para reglas comunes).
3. **Archivos afectados:** `src/model/Alojamiento/Apartamento.ts`, `Casa.ts`, `Pensionado.ts`, posible nuevo `TipoAlojamientoBase.ts`.
4. **Clases afectadas:** las tres subclases; sin cambios en `Alojamiento`, `Preferencia` (mismo contrato `TipoAlojamiento`).
5. **Cambio esperado:** Una sola implementación de la lógica común; cada subtipo solo declara su nombre (y, a futuro, sus diferencias reales).
6. **Riesgo:** Medio — requiere confirmar con el usuario si se prevén diferencias reales de comportamiento por tipo antes de decidir entre "clase base abstracta" o "colapsar a una sola clase con enum".
7. **Cómo comprobar:** Repetir el bloque "2. Probando (TipoAlojamiento)" de `main.ts`/`src/index.ts` y confirmar los mismos valores de salida (`getNombreTipo`, `getServiciosIncluidos`, `requiereContratoAnual`).

### Tarea 7 — Reemplazar `estado: string` por enums tipados
1. **Problema que resuelve:** Problema 8 (Primitive Obsession en estados).
2. **Principio SOLID aplicado:** Soporte a OCP (agregar un estado nuevo es extender un enum, no buscar strings dispersos).
3. **Archivos afectados:** `Alojamiento.ts`, `Usuario.ts`, `Solicitud.ts`, `Reserva.ts`, `PublicacionRoomie.ts`, y sus consumidores (`AlojamientoService.cambiarEstadoAlojamiento`, etc.).
4. **Clases afectadas:** las 5 entidades listadas.
5. **Cambio esperado:** Los estados solo pueden tomar valores válidos verificados en compilación; el comportamiento de las transiciones no cambia.
6. **Riesgo:** Bajo — cambio de tipo mecánico, cuidando mantener los mismos valores de string ya usados (para no romper serialización si ya existiera alguna).
7. **Cómo comprobar:** Los mismos smoke tests existentes (`main.ts`/`index.ts`) deben seguir imprimiendo los mismos estados en las mismas transiciones.

### Tarea 8 — Unificar la fuente de verdad Propietario↔Alojamiento e Inquilino↔(Favoritos/Solicitudes/Publicaciones)
1. **Problema que resuelve:** Problema 9 (doble fuente de verdad).
2. **Principio SOLID aplicado:** SRP (repositorio como único dueño del índice de relaciones).
3. **Archivos afectados:** `Propietario.ts`, `Inquilino.ts`, `UsuarioService`/servicios derivados de la Tarea 5, `IAlojamientoRepository` (posible nuevo método `listarPorPropietarioId`).
4. **Clases afectadas:** `Propietario`, `Inquilino`, `Alojamiento` (posible campo `propietarioId`).
5. **Cambio esperado:** Una sola estructura de datos representa cada relación; se elimina la sincronización manual duplicada.
6. **Riesgo:** Alto relativo a las demás tareas — es un cambio de modelo de dominio, se recomienda ejecutarlo al final y con validación explícita del usuario sobre el diseño elegido.
7. **Cómo comprobar:** Los escenarios de favoritos y publicación de alojamiento en los smoke tests actuales deben seguir funcionando igual desde la perspectiva del `Controller` (mismos inputs → mismos outputs), aunque cambie la implementación interna.

### Tarea 9 — Completar getters de `Resena` y `Regla`
1. **Problema que resuelve:** Problema 10.
2. **Principio SOLID aplicado:** N/A (consistencia, no SOLID).
3. **Archivos afectados:** `Resena.ts`, `Regla.ts`.
4. **Clases afectadas:** `Resena`, `Regla`.
5. **Cambio esperado:** Getters disponibles, sin cambiar ningún comportamiento existente.
6. **Riesgo:** Ninguno.
7. **Cómo comprobar:** Compilación exitosa; no hay comportamiento previo que pueda romperse (son métodos nuevos, aditivos).

### Tarea 10 — Estilo: reemplazar operador coma por punto y coma
1. **Problema que resuelve:** Problema 11.
2. **Principio SOLID aplicado:** N/A.
3. **Archivos afectados:** `Perfil.ts`, `Preferencia.ts`.
4. **Clases afectadas:** `Perfil`, `Preferencia`.
5. **Cambio esperado:** Ningún cambio de comportamiento, solo legibilidad.
6. **Riesgo:** Ninguno.
7. **Cómo comprobar:** Compilación exitosa y mismos valores en los smoke tests.

---

## Cierre de esta fase

Esta auditoría **no modificó ningún archivo de código fuente** (`main.ts`, `src/**`, `package.json`, `tsconfig.json` permanecen intactos). El único archivo creado es este mismo `backend/README.md`.

**Quedo a la espera de tu siguiente instrucción** para decidir con cuál tarea del plan empezar (se recomienda Tarea 1 → Tarea 2 → Tarea 3 primero, ya que son las que restauran una base compilable y verificable antes de tocar cualquier decisión de diseño más profunda).
