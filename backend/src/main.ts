import { RangoPresupuesto } from "./model/Alojamiento/RangoPresupuesto";
import { Casa } from "./model/Alojamiento/Casa";
import { Apartamento } from "./model/Alojamiento/Apartamento";
import { Pensionado } from "./model/Alojamiento/Pensionado";
import { Preferencia } from "./model/Alojamiento/Preferencia";
import { Ubicacion } from "./model/Alojamiento/Ubicacion";
import { Caracteristica } from "./model/Alojamiento/Caracteristica";
import { Precio } from "./model/Alojamiento/Precio";
import { Regla } from "./model/Alojamiento/Regla";
import { Alojamiento } from "./model/Alojamiento/Alojamiento";

import { Inquilino } from "./model/Usuario/Inquilino";
import { Propietario } from "./model/Usuario/Propietario";
import { PublicacionRoomie } from "./model/PublicacionRoomie";
import { Solicitud } from "./model/Solicitud";
import { Reserva } from "./model/Reserva";
import { Resena } from "./model/Resena";

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

    console.log("Value Objects creados exitosamente.");
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
    const alojamiento1 = new Alojamiento(
      101,
      "Apartamento Moderno Chapinero",
      "Excelente iluminación y vista a los cerros",
      apartamento,
      ["foto1.png", "foto2.png"],
      4.8,
      new Date(),
      "Disponible",
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

    const solicitud = new Solicitud(
      1,
      new Date(),
      "PENDIENTE",
      alojamiento1
    );

    // 6. Pruebas de Usuarios (Propietario e Inquilino)
    console.log("\n--- 6. Probando Usuarios (Propietario e Inquilino) ---");
    const propietario = new Propietario(
      1,
      "Carlos Mendoza",
      "3001234567",
      "Propietario",
      "Activo",
      "carlos@mail.com"
    );

    const inquilino = new Inquilino(
      2,
      "Felipe Gómez",
      "3119876543",
      "Inquilino",
      "Activo",
      "felipe@mail.com",
      [alojamiento1],
      [solicitud],
      []
    );

    propietario.publicarAlojamiento(alojamiento1);
    inquilino.guardarFavorito(alojamiento1);

    console.log(`- Propietario creado: ${propietario.getNombreCompleto()}`);
    console.log(`- Alojamientos del Propietario: ${propietario.getAlojamientos().length}`);
    console.log(`- Inquilino creado: ${inquilino.getNombreCompleto()}`);
    console.log(`- Favoritos del Inquilino: ${inquilino.getFavoritos().length}`);
    
    // 7. Prueba de PublicacionRoomie
    console.log("\n--- 7. Probando Publicación de Roomie ---");
    const publicacionRoomie = new PublicacionRoomie(
      1,
      "Buscando Roomie",
      new Date(),
      "BUSCANDO",
      alojamiento1
    );

    inquilino.publicarRoomie(publicacionRoomie);
    console.log(`- Publicación Roomie Creada: "${publicacionRoomie.getDescripcion()}"`);
    console.log(`- Alojamiento Asociado: ${publicacionRoomie.getAlojamiento().getTitulo()}`);
    
    inquilino.crearSolicitud(solicitud);

    // 8. Flujo Completo: Solicitud -> Reserva -> Reseña
    console.log("\n--- 8. Probando Flujo de Reserva y Reseñas ---");
    
    // Inquilino crea solicitud
    console.log(`- Solicitud generada con ID: ${solicitud.getId()} | Estado: ${solicitud.getEstado()}`);

    // Propietario acepta solicitud y genera reserva
    solicitud.aceptarSolicitud();
    console.log(`- Estado de Solicitud tras aceptación: ${solicitud.getEstado()}`);

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 6);

    const reserva = new Reserva(
      901,      
      fechaInicio,
      fechaFin,
      alojamiento1.getPrecio().getPrecioMensual(),
      new Date(),
      "CONFIRMADA",
      alojamiento1,
      inquilino
    );

    console.log(`- Reserva Creada: ID ${reserva.getId()} | Precio Acordado: $${reserva.getPrecioAcordado()}`);

    // Inquilino deja una reseña
    const resena = new Resena(
      301,
      5,
      "Excelente lugar, muy limpio y el propietario fue amable.",
      new Date(),
      inquilino,
    );

    console.log(`- Reseña enviada por ${resena.getAutor()}: [Puntuación: ${resena.getPuntuacion()}/5] "${resena.getComentario()}"`);

    // 9. Prueba de Manejo de Excepciones en el Dominio
    console.log("\n--- 9. Probando Autovalidaciones de Seguridad ---");
    try {
      new RangoPresupuesto(3000, 1000); // Mínimo mayor que máximo (Debe fallar)
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Excepción capturada correctamente: "${error.message}"`);
      }
    }

    console.log("\n=== TODAS LAS PRUEBAS FINALIZARON CON ÉXITO ===");
  } catch (error) {
    console.error("Error inesperado durante las pruebas:", error);
  }
}

main();