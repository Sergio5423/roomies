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

function main() {
  console.log("=== INICIANDO PRUEBAS DEL DOMINIO ===\n");

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
    const casa = new Casa([],true);
    const apartamento = new Apartamento(["Luz","Agua"],false);
    const pensionado = new Pensionado(["Comida","Luz","Agua"],false);

    console.log(`- Tipo 1: ${casa.getNombreTipo()} | Contrato Anual: ${casa.requiereContratoAnual()}`);
    console.log(`- Tipo 2: ${apartamento.getNombreTipo()} | Servicios: ${apartamento.getServiciosIncluidos().join(", ")} | Contrato Anual: ${apartamento.requiereContratoAnual()}`);
    console.log(`- Tipo 3: ${pensionado.getNombreTipo()} | | Servicios: ${pensionado.getServiciosIncluidos().join(", ")} | Contrato Anual: ${pensionado.requiereContratoAnual()}`);

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

    // 6. Prueba de Manejo de Excepciones en el Dominio
    console.log("\n--- 6. Probando Autovalidaciones de Seguridad ---");
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