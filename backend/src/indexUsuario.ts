// Pruebas sencillas en el punto de entrada
import { InMemoryUsuarioRepository } from "./repository/InMemoryUsuarioRepository.js";
import { InMemoryAlojamientoRepository } from "./repository/InMemoryAlojamientoRepository.js";
import { UsuarioService } from "./service/UsuarioService.js";
import { UsuarioController } from "./controller/UsuarioController.js";
import { Propietario } from "./model/Usuario/Propietario.js";
import { Inquilino } from "./model/Usuario/Inquilino.js";

async function probarUsuarios() {
  const usuarioRepo = new InMemoryUsuarioRepository();
  const alojamientoRepo = new InMemoryAlojamientoRepository();
  const service = new UsuarioService(usuarioRepo, alojamientoRepo);
  const controller = new UsuarioController(service);

  const prop = new Propietario(1, "Carlos", "300", "Propietario", "Activo", "carlos@test.com");
  const inq = new Inquilino(2, "Felipe", "311", "Inquilino", "Activo", "felipe@test.com");

  console.log("Registrar Propietario:", await controller.registrar(prop));
  console.log("Registrar Inquilino:", await controller.registrar(inq));
}

probarUsuarios();