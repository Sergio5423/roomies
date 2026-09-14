// src/bootstrap.ts
//
// Antipatrón corregido (Fase 3 del plan de refactorización — ver backend/README.md, Problema 3):
// la construcción del grafo de dependencias (repositorio -> service -> controller) estaba
// duplicada de forma manual en "src/index.ts" y "src/indexUsuario.ts", cada uno instanciando
// por su cuenta los mismos tipos de repositorios y servicios. Es un caso de "Shotgun Surgery":
// cualquier cambio en cómo se construye un service obliga a tocar cada entry point por separado.
//
// Corrección aplicada: se centraliza esa construcción en un único Composition Root. Los entry
// points de prueba ("src/index.ts", "src/indexUsuario.ts") ya no construyen sus propios
// repositorios/servicios/controladores: solo consumen "buildApp()". No se modificó ninguna
// clase de dominio, service, repository ni controller — este archivo solo reordena el cableado
// que ya existía.
import { InMemoryAlojamientoRepository } from "./repository/InMemoryAlojamientoRepository.js";
import { InMemoryUsuarioRepository } from "./repository/InMemoryUsuarioRepository.js";
import { AlojamientoService } from "./service/AlojamientoService.js";
import { UsuarioService } from "./service/UsuarioService.js";
import { AlojamientoController } from "./controller/AlojamientoController.js";
import { UsuarioController } from "./controller/UsuarioController.js";

export function buildApp() {
  // Repositorios (Infrastructure)
  const alojamientoRepository = new InMemoryAlojamientoRepository();
  const usuarioRepository = new InMemoryUsuarioRepository();

  // Servicios (Application) — dependen de las abstracciones de repositorio, no de esta función
  const alojamientoService = new AlojamientoService(alojamientoRepository);
  const usuarioService = new UsuarioService(usuarioRepository, alojamientoRepository);

  // Controladores (Presentation, hoy sin transporte HTTP real)
  const alojamientoController = new AlojamientoController(alojamientoService);
  const usuarioController = new UsuarioController(usuarioService);

  return {
    alojamientoRepository,
    usuarioRepository,
    alojamientoService,
    usuarioService,
    alojamientoController,
    usuarioController,
  };
}
