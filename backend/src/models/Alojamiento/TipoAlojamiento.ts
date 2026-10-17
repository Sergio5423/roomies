import { Regla } from "./Regla";

export abstract class TipoAlojamiento {

    private serviciosEspecificos: string[] = [];
    private contratoAnual: boolean = false;
    private reglasEspecificas: Regla[] = [];

    public abstract getNombre(): string;

    public getServicios(): string[] {
        return this.serviciosEspecificos;
    }

    public setServicios(servicios: string[]): void {
        this.serviciosEspecificos = servicios;
    }

    public getContratoAnual(): boolean {
        return this.contratoAnual;
    }

    setContratoAnual(contrato: boolean): void {
        this.contratoAnual = contrato;
    }

    public getReglas(): Regla[] {
        return this.reglasEspecificas;
    }

    setReglas(reglas: Regla[]): void {
        this.reglasEspecificas = reglas;
    }
}