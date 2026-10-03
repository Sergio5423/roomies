import test from 'node:test';
import assert from 'node:assert/strict';
import { TipoAlojamientoFactory } from '../src/models/Factory/TipoAlojamientoFactory';
import { CreadorCasa } from '../src/models/Factory/CreadorCasa';
import { Casa } from '../src/models/Alojamiento/Casa';
import { Apartamento } from '../src/models/Alojamiento/Apartamento';
import { Pensionado } from '../src/models/Alojamiento/Pensionado';
import { Regla } from '../src/models/Alojamiento/Regla';
import { AlojamientoBuilder } from '../src/models/Builder/AlojamientoBuilder';
import { AlojamientoMapper, type AlojamientoRegistro } from '../src/repository/AlojamientoMapper';
import { MemoriaRepositorioFactory } from '../src/repository/factory/MemoriaRepositorioFactory';
import type { IRepositorioFactory } from '../src/repository/factory/IRepositorioFactory';
import { AlojamientoService } from '../src/services/Alojamiento/alojamiento.service';
import { Propietario } from '../src/models/Usuario/Propietario';
import { Precio } from '../src/models/Alojamiento/Precio';

const registro: AlojamientoRegistro = {
  id: 'a-1', title: 'Casa de prueba', description: 'Cerca de la universidad',
  type: 'Casa', images: ['foto.jpg'], average_rating: 4,
  created_at: '2026-01-02T12:00:00.000Z', status: 'ocupado',
  location: { direccion: 'Calle 1', ciudad: 'Bogotá', latitud: 4.6, longitud: -74.1 },
  features: { numeroCuartos: 2, metrosCuadrados: 50, capacidad: 2, amoblado: true, buscandoRoomie: false },
  price: { precioMensual: 800000 },
};

test('Factory Method selecciona productos concretos y rechaza tipos desconocidos', () => {
  assert.ok(TipoAlojamientoFactory.crear('Casa') instanceof Casa);
  assert.ok(TipoAlojamientoFactory.crear('Apartamento') instanceof Apartamento);
  assert.ok(TipoAlojamientoFactory.crear('Pensionado') instanceof Pensionado);
  for (const nombre of ['Hotel', 'constructor', 'toString']) {
    assert.throws(() => TipoAlojamientoFactory.crear(nombre), /no soportado/);
  }
});

test('cada creador produce instancias independientes con configuración común', () => {
  const creador = new CreadorCasa();
  const reglas = [new Regla('r-1', 'No fumar')];
  const primera = creador.crear(reglas);
  reglas.length = 0;
  assert.equal(primera.getReglas().length, 1);
  assert.equal(creador.crear().getReglas().length, 0);
});

test('Builder rechaza objetos incompletos', () => {
  assert.throws(() => new AlojamientoBuilder().construir(), /obligatorios/);
});

test('rehidratación preserva identidad, fecha y objetos de dominio', () => {
  const a = AlojamientoMapper.desdeRegistro(registro);
  assert.equal(a.getId(), registro.id);
  assert.equal(a.getFechaPublicacion().toISOString(), registro.created_at);
  assert.equal(a.getEstado(), 'ocupado');
  assert.equal(a.getUbicacion().getCiudad(), 'Bogotá');
  assert.equal(a.getCaracteristicas().getNumeroCuartos(), 2);
  assert.equal(a.getPrecio().getPrecioMensual(), 800000);
  assert.equal(a.getTipoAlojamientoNombre(), 'Casa');
  assert.equal(a.getPuntuacionPromedio(), 4);
});

test('Builder valida precio y fecha y copia imágenes entre construcciones', () => {
  const a = AlojamientoMapper.desdeRegistro(registro);
  const imagenes = ['original'];
  const builder = new AlojamientoBuilder().conIdentidad('nuevo')
    .conDescripcion('Título', '').conTipo(a.getTipoAlojamiento())
    .conUbicacion(a.getUbicacion()).conCaracteristicas(a.getCaracteristicas())
    .conPrecio(new Precio(0)).conImagenes(imagenes);
  const primero = builder.construir();
  imagenes.push('externa');
  builder.conImagenes(['otra']);
  assert.deepEqual(primero.getImagenes(), ['original']);
  assert.equal(primero.getEstado(), 'disponible');
  assert.equal(primero.getPuntuacionPromedio(), 0);
  for (const precio of [-1, NaN, Infinity]) {
    assert.throws(() => builder.conPrecio(new Precio(precio)).construir(), /precio/);
  }
  assert.throws(() => builder.conPrecio(new Precio(1))
    .conPublicacion(new Date('inválida'), 'disponible').construir(), /Fecha/);
});

test('familia en memoria comparte contexto y cada fábrica tiene almacenamiento propio', async () => {
  const fabrica: IRepositorioFactory = new MemoriaRepositorioFactory();
  const propietarios = fabrica.crearPropietarioRepository();
  const alojamientos = fabrica.crearAlojamientoRepository();
  const a = AlojamientoMapper.desdeRegistro(registro);
  await assert.rejects(alojamientos.guardar(a, 'p-1'), /Propietario no encontrado/);
  await propietarios.guardar(new Propietario('p-1', 'Ana', 'Pérez', 'ana@example.com', '123'));
  await alojamientos.guardar(a, 'p-1');
  assert.equal(await fabrica.crearAlojamientoRepository().obtenerPorId('a-1'), a);
  assert.equal(await new MemoriaRepositorioFactory().crearAlojamientoRepository().obtenerPorId('a-1'), null);
  await assert.rejects(alojamientos.guardar(a, 'p-1'), /ya existe/);
  assert.equal((await alojamientos.listarTodos()).length, 1);
  assert.equal(await alojamientos.eliminar('a-1'), true);
  assert.equal(await alojamientos.obtenerPorId('a-1'), null);
  await assert.rejects(alojamientos.actualizar(a), /no encontrado/);
});

test('servicio integra los tres patrones al publicar, actualizar y cambiar estado', async () => {
  const fabrica: IRepositorioFactory = new MemoriaRepositorioFactory();
  await fabrica.crearPropietarioRepository().guardar(
    new Propietario('p-1', 'Ana', 'Pérez', 'ana@example.com', '123'));
  const service = new AlojamientoService(
    fabrica.crearAlojamientoRepository(), fabrica.crearPropietarioRepository());
  const datos = { titulo: 'Apartamento', descripcion: 'Descripción', tipoAlojamiento: 'Apartamento',
    ubicacion: registro.location, caracteristicas: registro.features, precio: 500000, reglas: ['No fumar'] };
  await assert.rejects(service.publicarAlojamiento('inexistente', datos), /no encontrado/);
  const nuevo = await service.publicarAlojamiento('p-1', datos);
  const fecha = nuevo.getFechaPublicacion().toISOString();
  assert.ok(nuevo.getTipoAlojamiento() instanceof Apartamento);
  assert.equal(nuevo.getReglas().length, 1);
  const actualizado = await service.actualizarAlojamiento(nuevo.getId(), { titulo: 'Actualizado', precio: 0 });
  assert.equal(actualizado.getPrecio().getPrecioMensual(), 0);
  assert.equal(actualizado.getTitulo(), 'Actualizado');
  assert.equal(actualizado.getFechaPublicacion().toISOString(), fecha);
  assert.equal(actualizado.getReglas().length, 1);
  assert.equal((await service.cambiarEstado(nuevo.getId(), 'ocupado')).getEstado(), 'ocupado');
  assert.equal((await service.listarTodos()).length, 1);
});

test('familia Supabase entrega productos de los contratos sin consultar la base', async () => {
  // Valores ficticios: construir clientes no realiza peticiones.
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-anon';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service';
  const { SupabaseRepositorioFactory } = await import('../src/repository/factory/SupabaseRepositorioFactory');
  const { SupabaseAlojamientoRepository } = await import('../src/repository/SupabaseAlojamientoRepository');
  const { SupabasePropietarioRepository } = await import('../src/repository/SupabasePropietarioRepository');
  const fabrica: IRepositorioFactory = new SupabaseRepositorioFactory();
  assert.ok(fabrica.crearAlojamientoRepository() instanceof SupabaseAlojamientoRepository);
  assert.ok(fabrica.crearPropietarioRepository() instanceof SupabasePropietarioRepository);
  assert.equal(fabrica.crearAlojamientoRepository(), fabrica.crearAlojamientoRepository());
});
