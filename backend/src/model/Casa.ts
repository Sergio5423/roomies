import { Regla } from "./Regla";
import type { TipoAlojamiento } from "./ITipoAlojamiento";

export class Casa implements TipoAlojamiento {
    private serviciosEspecificos: string[] = [];
    private contratoAnual: boolean = false;
    private reglasEspecificas: Regla[] = [];
    
    constructor(serviciosIncluidos: string[] = [], contratoAnual: boolean) {
        this.serviciosEspecificos = serviciosIncluidos;
        this.contratoAnual = contratoAnual;
    }

    public getNombreTipo(): string {
        return "CASA";
    }

    public agregarServicio(nuevoServicio?: string) {
        if (nuevoServicio !== undefined) {
            this.serviciosEspecificos.push(nuevoServicio);
        }
    }

    public getServiciosIncluidos(): string[] {       
        return this.serviciosEspecificos;     
    }

    public requiereContratoAnual(): boolean {
        return this.contratoAnual;
    }

    public agregarRegla(nuevaRegla: Regla): void {
        this.reglasEspecificas.push(nuevaRegla);
    }

    public getReglas(): Regla[] {
        return this.reglasEspecificas;
    }
}
