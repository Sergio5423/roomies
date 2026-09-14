// src/index.ts
// NOTA (Fase 3): la construcción del repositorio/service/controller ya no se hace aquí de
// forma manual — se obtiene del Composition Root único en "./bootstrap.js" (ver Problema 3
// del informe de auditoría).
import { buildApp } from "./bootstrap.js";
import { Alojamiento } from "./model/Alojamiento/Alojamiento.js";
import { Apartamento } from "./model/Alojamiento/Apartamento.js";
import { Ubicacion } from "./model/Alojamiento/Ubicacion.js";
import { Caracteristica } from "./model/Alojamiento/Caracteristica.js";
import { Precio } from "./model/Alojamiento/Precio.js";

async function main() {
  const { alojamientoController: controller } = buildApp();

  // Crear Objeto de Dominio
  const apto = new Apartamento(["Luz", "Agua"], false);
  const ub = new Ubicacion("Calle 10", "Bogotá", "Centro", "1km", 4.0, -74.0);
  const car = new Caracteristica(2, 50, 2, true, false);
  const precio = new Precio(1500);

  const nuevoAlojamiento = new Alojamiento(
    1,
    "Apartamento Chapinero",
    "Bonito apto",
    apto,
    [],
    5.0,
    new Date(),
    "Disponible",
    ub,
    car,
    precio
  );

  // Probar operaciones a través del Controller
  console.log("1. Guardando alojamiento:", await controller.crear(nuevoAlojamiento));
  console.log("2. Cambiando estado:", await controller.cambiarEstado(1, "Ocupado"));
  console.log("3. Consultando alojamientos:", await controller.obtener(1));
}

main();