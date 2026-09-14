// Pruebas sencillas en el punto de entrada
// NOTA (Fase 3): la construcción de repositorios/service/controller ya no se hace aquí de
// forma manual — se obtiene del Composition Root único en "./bootstrap.js" (ver Problema 3
// del informe de auditoría).
import { buildApp } from "./bootstrap.js";
import { Propietario } from "./model/Usuario/Propietario.js";
import { Inquilino } from "./model/Usuario/Inquilino.js";

async function probarUsuarios() {
  const { usuarioController: controller } = buildApp();

  const prop = new Propietario(1, "Carlos", "300", "Propietario", "Activo", "carlos@test.com");
  const inq = new Inquilino(2, "Felipe", "311", "Inquilino", "Activo", "felipe@test.com");

  console.log("Registrar Propietario:", await controller.registrar(prop));
  console.log("Registrar Inquilino:", await controller.registrar(inq));
}

probarUsuarios();