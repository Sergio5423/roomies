import { TipoAlojamientoBase } from "./TipoAlojamientoBase";

// Fase 6 (ver backend/README.md, Problema 7): la lógica común de servicios/reglas/contrato
// anual vive ahora en TipoAlojamientoBase; esta clase solo declara lo que la distingue.
export class Pensionado extends TipoAlojamientoBase {
    public getNombreTipo(): string {
        return "PENSIONADO";
    }
}
