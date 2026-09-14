// Pruebas sencillas en el punto de entrada
// NOTA (Fase 3): la construcción de repositorios/service/controller ya no se hace aquí de
// forma manual — se obtiene del Composition Root único en "./bootstrap.js" (ver Problema 3
// del informe de auditoría).
import { buildApp } from "./bootstrap.js";
import { Propietario } from "./model/Usuario/Propietario.js";
import { Inquilino } from "./model/Usuario/Inquilino.js";
import { Alojamiento } from "./model/Alojamiento/Alojamiento.js";
import { Apartamento } from "./model/Alojamiento/Apartamento.js";
import { Ubicacion } from "./model/Alojamiento/Ubicacion.js";
import { Caracteristica } from "./model/Alojamiento/Caracteristica.js";
import { Precio } from "./model/Alojamiento/Precio.js";
// NOTA (Fase 7): los literales "Activo"/"Disponible" se reemplazan por EstadoUsuario/
// EstadoAlojamiento (ver Problema 8 del informe de auditoría).
import { EstadoUsuario, EstadoAlojamiento } from "./model/estados.js";

async function probarUsuarios() {
  const { usuarioController: controller } = buildApp();

  const prop = new Propietario(1, "Carlos", "300", "Propietario", EstadoUsuario.ACTIVO, "carlos@test.com");
  const inq = new Inquilino(2, "Felipe", "311", "Inquilino", EstadoUsuario.ACTIVO, "felipe@test.com");

  console.log("Registrar Propietario:", await controller.registrar(prop));
  console.log("Registrar Inquilino:", await controller.registrar(inq));

  // NOTA (Fase 5): se agregan estos dos escenarios para verificar, ejecutando el código
  // (no solo compilando), que dividir UsuarioService en FavoritosService y
  // PublicacionAlojamientoService no cambió el comportamiento observable desde el
  // controller (ver Problema 4 del informe de auditoría).
  const alojamiento = new Alojamiento(
    1,
    "Apartamento de prueba",
    "Descripción de prueba",
    new Apartamento(["Luz"], false),
    [],
    0,
    new Date(),
    EstadoAlojamiento.DISPONIBLE,
    new Ubicacion("Calle 1", "Bogotá", "Centro", "1km", 4.0, -74.0),
    new Caracteristica(1, 30, 1, true, false),
    new Precio(800)
  );

  console.log("Publicar alojamiento (Propietario):", await controller.publicarAlojamiento(prop.getId(), alojamiento));
  console.log("Agregar favorito (Inquilino):", await controller.agregarFavorito(inq.getId(), alojamiento.getId()));
}

probarUsuarios();