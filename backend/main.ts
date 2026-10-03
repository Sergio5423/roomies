import express from 'express';
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors';

// Repositorios de Persistencia (Supabase)
import { repositorioFactory } from './src/config/repositorios';

// Servicios y Controladores
import { AlojamientoService } from './src/services/Alojamiento/alojamiento.service';
import { AlojamientoController } from './src/controllers/Alojamiento/alojamiento.controller';

// Rutas
import authRoutes from './src/routes/auth.routes';
import userRoutes from './src/routes/user.routes';

// Middlewares
import { authenticateToken } from './src/middlewares/auth.middleware';
import { authorizeRoles } from './src/middlewares/role.middleware';

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Middlewares Globales
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Instanciación e Inyección de Dependencias
// ==========================================
const alojamientoRepository = repositorioFactory.crearAlojamientoRepository();
const propietarioRepository = repositorioFactory.crearPropietarioRepository();

const alojamientoService = new AlojamientoService(
  alojamientoRepository, 
  propietarioRepository
);

const alojamientoController = new AlojamientoController(alojamientoService);

// ==========================================
// 3. Montar Rutas Principales
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- Rutas del Módulo de Alojamientos ---

// POST - Publicar un alojamiento (Protegido por JWT y Rol ARRENDATARIO)
router.post(
  '/alojamientos', 
  authenticateToken, 
  authorizeRoles('ARRENDATARIO'), 
  (req: Request, res: Response) => alojamientoController.publicar(req, res)
);

// GET - Consultas de alojamientos
router.get(
  '/alojamientos', 
  (req: Request, res: Response) => alojamientoController.listarTodos(req, res)
);

router.get(
  '/alojamientos/:id', 
  (req: Request, res: Response) => alojamientoController.obtenerPorId(req, res)
);

// PUT - Actualizar alojamiento completo (Protegido por JWT y Rol ARRENDATARIO)
router.put(
  '/alojamientos/:id', 
  authenticateToken, 
  authorizeRoles('ARRENDATARIO'), 
  (req: Request, res: Response) => alojamientoController.actualizar(req, res)
);

// PATCH - Cambiar estado (disponible, ocupado, etc.)
router.patch(
  '/alojamientos/:id/estado', 
  authenticateToken, 
  authorizeRoles('ARRENDATARIO'), 
  (req: Request, res: Response) => alojamientoController.cambiarEstado(req, res)
);

app.use('/api', router);

// ==========================================
// 4. Manejo Global de Errores y Rutas No Encontradas
// ==========================================
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Unhandled Error:", err.stack);
  res.status(500).json({ error: "Error interno del servidor", details: err.message });
});

// ==========================================
// 5. Iniciar el Servidor
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`  └─ Auth:        http://localhost:${PORT}/api/auth`);
  console.log(`  └─ Usuarios:    http://localhost:${PORT}/api/users`);
  console.log(`  └─ Alojamientos: http://localhost:${PORT}/api/alojamientos`);
});