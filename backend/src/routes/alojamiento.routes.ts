// src/routes/alojamiento.routes.ts
import { Router } from 'express';
import { AlojamientoController } from '../controllers//Alojamiento/alojamiento.controller';
import { AlojamientoService } from '../services/Alojamiento/alojamiento.service';
import { repositorioFactory } from '../config/repositorios';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Instanciación de Repositorios y Servicio (Inyección de Dependencias)
const alojamientoRepository = repositorioFactory.crearAlojamientoRepository();
const propietarioRepository = repositorioFactory.crearPropietarioRepository();
const alojamientoService = new AlojamientoService(alojamientoRepository, propietarioRepository);

// Instanciación del Controlador
const alojamientoController = new AlojamientoController(alojamientoService);

// Rutas protegidas para ARRENDATARIOS / PROPIETARIOS
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ARRENDATARIO'),
  alojamientoController.publicar
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ARRENDATARIO'),
  alojamientoController.actualizar
);

router.patch(
  '/:id/estado',
  authenticateToken,
  authorizeRoles('ARRENDATARIO'),
  alojamientoController.cambiarEstado
);

export default router;