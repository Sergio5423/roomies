// Antipatrón corregido (Fase 2 del plan de refactorización — ver backend/README.md, Problema 2):
// este archivo (entry point real del proyecto: package.json -> "main"/scripts dev y start)
// había quedado desincronizado del modelo de dominio: llamaba a constructores y métodos de
// Inquilino, Solicitud, Reserva, Resena y PublicacionRoomie con firmas que ya no existían,
// por lo que el proyecto no compilaba (14 errores de "tsc --noEmit"). Es el síntoma típico
// de "Shotgun Surgery": el dominio cambió y no todos sus consumidores se actualizaron.
//
// Corrección aplicada: se ajustaron únicamente las llamadas de este archivo para que
// coincidan con las firmas reales ya implementadas en src/model — no se modificó ninguna
// clase de dominio. Cada punto corregido queda anotado con "NOTA (Fase 2)" más abajo.
import { RangoPresupuesto } from "./src/model/Alojamiento/RangoPresupuesto";
import { Casa } from "./src/model/Alojamiento/Casa";
import { Apartamento } from "./src/model/Alojamiento/Apartamento";
import { Pensionado } from "./src/model/Alojamiento/Pensionado";
import { Preferencia } from "./src/model/Alojamiento/Preferencia";
import { Ubicacion } from "./src/model/Alojamiento/Ubicacion";
import { Caracteristica } from "./src/model/Alojamiento/Caracteristica";
import { Precio } from "./src/model/Alojamiento/Precio";
import { Regla } from "./src/model/Alojamiento/Regla";
import { Alojamiento } from "./src/model/Alojamiento/Alojamiento";

// Importaciones de Usuarios y Flujo Social/Reservas
import { Inquilino } from "./src/model/Usuario/Inquilino";
import { Propietario } from "./src/model/Usuario/Propietario";
import { PublicacionRoomie } from "./src/model/PublicacionRoomie";
import { Solicitud } from "./src/model/Solicitud";
import { Reserva } from "./src/model/Reserva";
import { Resena } from "./src/model/Resena";
// NOTA (Fase 7): los literales de estado ("Disponible", "Activo", "PENDIENTE", "ACTIVA",
// etc.) se reemplazan por los enums correspondientes (ver Problema 8 del informe de
// auditoría).
import {
  EstadoAlojamiento,
  EstadoUsuario,
  EstadoSolicitud,
  EstadoReserva,
  EstadoPublicacionRoomie,
} from "./src/model/estados";

function main() {
  console.log("=== INICIANDO PRUEBAS DEL DOMINIO COMPLETO ===\n");

  try {
    // 1. Instanciación y prueba de autovalidación de Value Objects
    console.log("--- 1. Probando Value Objects ---");
    const presupuestoFelipe = new RangoPresupuesto(1000, 2500);
    const precioCasa = new Precio(2000);

    const ubicacionCentro = new Ubicacion(
      "Calle 10 #5-20",
      "Bogotá",
      "Centro",
      "2.5 km",
      4.6097,
      -74.0817
    );

    const caracteristicasApto = new Caracteristica(
      3,
      85,
      4,      
      true,
      false
    );

    console.log("✅ Value Objects creados exitosamente.");
    console.log(`- Rango Presupuesto: $${presupuestoFelipe.getMinimo()} - $${presupuestoFelipe.getMaximo()}`);
    console.log(`- Ubicación: ${ubicacionCentro.getDireccion()}, ${ubicacionCentro.getCiudad()}`);

    // 2. Prueba (TipoAlojamiento)
    console.log("\n--- 2. Probando (TipoAlojamiento) ---");
    const casa = new Casa([], true);
    const apartamento = new Apartamento(["Luz", "Agua"], false);
    const pensionado = new Pensionado(["Comida", "Luz", "Agua"], false);

    console.log(`- Tipo 1: ${casa.getNombreTipo()} | Contrato Anual: ${casa.requiereContratoAnual()}`);
    console.log(`- Tipo 2: ${apartamento.getNombreTipo()} | Servicios: ${apartamento.getServiciosIncluidos().join(", ")} | Contrato Anual: ${apartamento.requiereContratoAnual()}`);
    console.log(`- Tipo 3: ${pensionado.getNombreTipo()} | Servicios: ${pensionado.getServiciosIncluidos().join(", ")} | Contrato Anual: ${pensionado.requiereContratoAnual()}`);

    // 3. Prueba de la Entidad Preferencia
    console.log("\n--- 3. Probando Entidad Preferencia ---");
    const preferenciaInquilino = new Preferencia(
      1,
      presupuestoFelipe,
      "5", 
      "2", 
      true,
      true,
      apartamento
    );

    console.log(`- Tipo deseado: ${preferenciaInquilino.getTipoAlojamiento().getNombreTipo()}`);
    console.log(`- ¿$2000 está en su presupuesto?: ${preferenciaInquilino.esPrecioCompatible(2000)}`);
    console.log(`- ¿$3500 está en su presupuesto?: ${preferenciaInquilino.esPrecioCompatible(3500)}`);
    console.log(`- ¿Es compatible con una Casa?: ${preferenciaInquilino.esTipoCompatible(casa)}`);
    console.log(`- ¿Es compatible con un Apartamento?: ${preferenciaInquilino.esTipoCompatible(apartamento)}`);

    // 4. Instanciación y gestión de Alojamiento con Reglas
    console.log("\n--- 4. Probando Entidad Alojamiento y Reglas ---");
    // NOTA (Fase 8): "propietarioId: 1" corresponde al Propietario creado más abajo en el
    // paso 6 (Carlos Mendoza, id 1) — ver Problema 9 del informe de auditoría.
    const alojamiento1 = new Alojamiento(
      101,
      1,
      "Apartamento Moderno Chapinero",
      "Excelente iluminación y vista a los cerros",
      apartamento,
      ["foto1.png", "foto2.png"],
      4.8,
      new Date(),
      EstadoAlojamiento.DISPONIBLE,
      ubicacionCentro,
      caracteristicasApto,
      precioCasa
    );

    const reglaMascotas = new Regla(1, "Mascotas", "No se permiten perros ni gatos");
    const reglaSilencio = new Regla(2, "Silencio", "Silencio a partir de las 10 PM");

    alojamiento1.getTipoAlojamiento().agregarRegla(reglaMascotas);
    alojamiento1.getTipoAlojamiento().agregarRegla(reglaSilencio);

    console.log(`- Alojamiento Creado: ${alojamiento1.getTitulo()}`);
    console.log(`- Tipo Inmueble (Delegado): ${alojamiento1.getTipoAlojamientoNombre()}`);
    console.log(`- Servicios Incluidos (Delegado): ${alojamiento1.getServiciosIncluidos().join(", ")}`);
    console.log(`- Reglas registradas (${alojamiento1.getReglas().length}):`);
    console.log(alojamiento1.getReglas());

    // 5. Evaluación de Compatibilidad Real (Preferencia vs Alojamiento)
    console.log("\n--- 5. Evaluando Compatibilidad Real ---");
    const esPrecioValido = preferenciaInquilino.esPrecioCompatible(alojamiento1.getPrecio().getPrecioMensual());
    const esTipoValido = preferenciaInquilino.esTipoCompatible(alojamiento1.getTipoAlojamiento());

    console.log(`- ¿El precio ($${alojamiento1.getPrecio().getPrecioMensual()}) le sirve al inquilino?: ${esPrecioValido}`);
    console.log(`- ¿El tipo (${alojamiento1.getTipoAlojamientoNombre()}) coincide con su deseo?: ${esTipoValido}`);
    console.log(`-> COMPATIBILIDAD FINAL: ${esPrecioValido && esTipoValido ? "APROBADO" : "RECHAZADO"}`);

    // 6. Pruebas de Usuarios (Propietario e Inquilino)
    console.log("\n--- 6. Probando Usuarios (Propietario e Inquilino) ---");
    const propietario = new Propietario(
      1,
      "Carlos Mendoza",
      "3001234567",
      "Propietario",
      EstadoUsuario.ACTIVO,
      "carlos@mail.com"
    );

    // NOTA (Fase 2): Inquilino ya no recibe una Preferencia en el constructor (esa asociación
    // no existe en el modelo actual); "preferenciaInquilino" se sigue usando por separado
    // más abajo para las comprobaciones de compatibilidad.
    const inquilino = new Inquilino(
      2,
      "Felipe Gómez",
      "3119876543",
      "Inquilino",
      EstadoUsuario.ACTIVO,
      "felipe@mail.com"
    );

    // NOTA (Fase 8): ya no existe "propietario.publicarAlojamiento(...)" — la relación
    // Propietario<->Alojamiento vive únicamente en "alojamiento1.getPropietarioId()" y en
    // el repositorio (ver Problema 9 del informe de auditoría; el flujo completo vía
    // PublicacionAlojamientoService se demuestra en src/indexUsuario.ts).
    inquilino.guardarFavorito(alojamiento1);

    console.log(`- Propietario creado: ${propietario.getNombreCompleto()}`);
    console.log(`- Alojamiento "${alojamiento1.getTitulo()}" pertenece al propietario ID: ${alojamiento1.getPropietarioId()}`);
    console.log(`- Inquilino creado: ${inquilino.getNombreCompleto()}`);
    console.log(`- Favoritos del Inquilino: ${inquilino.getFavoritos().length}`);

    // 7. Prueba de PublicacionRoomie
    console.log("\n--- 7. Probando Publicación de Roomie ---");
    // NOTA (Fase 2): PublicacionRoomie recibe 5 argumentos (id, descripcion, fecha, estado,
    // alojamiento) — no incluye presupuestoMinimo/presupuestoMaximo (campos comentados/no
    // existentes en la clase actual).
    const publicacionRoomie = new PublicacionRoomie(
      501,
      "Busco roomie para compartir gastos de apto en Chapinero",
      new Date(),
      EstadoPublicacionRoomie.ACTIVA,
      alojamiento1
    );

    // NOTA (Fase 2): se publica la PublicacionRoomie recién creada, no el Alojamiento.
    inquilino.publicarRoomie(publicacionRoomie);
    console.log(`- Publicación Roomie Creada: "${publicacionRoomie.getDescripcion()}"`);
    console.log(`- Alojamiento Asociado: ${publicacionRoomie.getAlojamiento().getTitulo()}`);

    // 8. Flujo Completo: Solicitud -> Reserva -> Reseña
    console.log("\n--- 8. Probando Flujo de Reserva y Reseñas ---");
    
    // Inquilino crea solicitud
    // NOTA (Fase 2): "crearSolicitud" recibe una Solicitud ya construida y devuelve "void"
    // (antes se le pasaba un Alojamiento y se esperaba que devolviera la Solicitud).
    const solicitud = new Solicitud(801, new Date(), EstadoSolicitud.PENDIENTE, alojamiento1);
    inquilino.crearSolicitud(solicitud);
    console.log(`- Solicitud generada con ID: ${solicitud.getId()} | Estado: ${solicitud.getEstado()}`);

    // Propietario acepta solicitud y genera reserva
    solicitud.aceptarSolicitud();
    console.log(`- Estado de Solicitud tras aceptación: ${solicitud.getEstado()}`);

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 6);

    // NOTA (Fase 2): la firma real de Reserva no incluye al Inquilino y sí requiere
    // fechaReserva y alojamiento (antes se pasaba el Inquilino y faltaba el Alojamiento,
    // y sobraba/faltaba un argumento según la posición).
    const reserva = new Reserva(
      901,
      fechaInicio,
      fechaFin,
      alojamiento1.getPrecio().getPrecioMensual(),
      new Date(),
      EstadoReserva.PENDIENTE,
      alojamiento1
    );
    reserva.confirmarReserva();

    console.log(`- Reserva Creada: ID ${reserva.getId()} | Estado: ${reserva.getEstado()}`);

    // Inquilino deja una reseña
    // NOTA (Fase 2): la firma real de Resena es (id, puntuacion, comentario, fecha), sin
    // Inquilino. Además "Resena" todavía no expone ningún getter (getAutor/getPuntuacion/
    // getComentario no existen) — ver Problema 10 del informe de auditoría; se deja como
    // deuda técnica documentada, agregar esos getters no es parte del problema que corrige
    // esta fase.
    const resena = new Resena(
      301,
      5,
      "Excelente lugar, muy limpio y el propietario fue amable.",
      new Date()
    );

    console.log(`- Reseña registrada por ${inquilino.getNombreCompleto()} para "${alojamiento1.getTitulo()}".`);

    // 9. Prueba de Manejo de Excepciones en el Dominio
    console.log("\n--- 9. Probando Autovalidaciones de Seguridad ---");
    try {
      new RangoPresupuesto(3000, 1000); // Mínimo mayor que máximo (Debe fallar)
    } catch (error) {
      if (error instanceof Error) {
        console.log(`✅ Excepción capturada correctamente: "${error.message}"`);
      }
    }

    console.log("\n=== TODAS LAS PRUEBAS FINALIZARON CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error inesperado durante las pruebas:", error);
  }
}

main();