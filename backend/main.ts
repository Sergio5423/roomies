// src/index.ts
import express from 'express';
import { AlojamientoRepositoryInMemory } from './src/repository/AlojamientoInMemory';
import { PropietarioRepositoryInMemory } from './src/repository/PropietarioRepositoryInMemory';
import { AlojamientoService } from './src/service/Alojamiento/AlojamientoService';
import { AlojamientoController } from './src/controller/Alojamiento/AlojamientoController';
import { Propietario } from './src/model/Usuario/Propietario'; 
// import { PasswordHash } from './src/model/PasswordHash'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const alojamientoRepository = new AlojamientoRepositoryInMemory();
const propietarioRepository = new PropietarioRepositoryInMemory();

// 2. CREACIÓN CORRECTA: Instanciamos un Propietario real con 'new'
// Pasamos los parámetros que pida el constructor de tu clase Propietario/Usuario
const propietarioPrueba = new Propietario(
    1,
    "Juan Perez",
    "3001234567",
    "Propietario",
    "Activo",
    "juan@perez.com",
    // new PasswordHash("123456") // Descomenta si usas el Value Object del UML
);


// Guardamos la instancia viva en el repositorio
propietarioRepository.guardar(propietarioPrueba);

// 3. Inyección de dependencias
const alojamientoService = new AlojamientoService(
    alojamientoRepository, 
    propietarioRepository
);

const alojamientoController = new AlojamientoController(alojamientoService);

const router = express.Router();

router.post('/alojamientos', alojamientoController.publicar);
router.put('/alojamientos/:id', alojamientoController.actualizar);
router.patch('/alojamientos/:id/estado', alojamientoController.cambiarEstado);

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend iniciado en http://localhost:${PORT}`);
    console.log(`Aceptando peticiones en http://localhost:${PORT}/api/alojamientos`);
});