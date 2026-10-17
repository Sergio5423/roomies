import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Proteger todas las rutas de este router
router.use(authenticateToken);

// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', UserController.getProfile);

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', UserController.updateProfile);

// GET /api/users/:id - Obtener un usuario por su ID
// IMPORTANTE: Definir DESPUÉS de /profile para evitar que "profile" sea capturado como un ID
router.get('/:id', UserController.getUserById);

export default router;