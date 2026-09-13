import { Regla } from "./Regla";

export interface TipoAlojamiento {
    getNombreTipo(): string;
    agregarServicio(servicio: string): void;
    getServiciosIncluidos(): string [];
    requiereContratoAnual(): boolean;
    agregarRegla(nuevaRegla: Regla): void;
    getReglas(): Regla[];
}