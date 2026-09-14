import { Regla } from "./Regla";
import type { TipoAlojamiento } from "./ITipoAlojamiento";

// Antipatrón corregido (Fase 6 del plan de refactorización — ver backend/README.md,
// Problema 7): "Apartamento", "Casa" y "Pensionado" implementaban cada una, de forma
// independiente, exactamente la misma lógica (gestión de servicios, reglas y contrato
// anual) — código duplicado al 100% salvo el nombre del tipo. Cualquier regla común nueva
// debía aplicarse en las tres clases por separado.
//
// Corrección aplicada: se centraliza esa lógica común aquí. Cada subtipo concreto solo
// declara su "getNombreTipo()" y queda libre para sobrescribir cualquier otro método
// cuando necesite comportamiento propio (se confirmó que se espera divergencia futura
// entre tipos, p. ej. reglas o servicios por defecto distintos).
export abstract class TipoAlojamientoBase implements TipoAlojamiento {
  protected serviciosEspecificos: string[];
  protected contratoAnual: boolean;
  protected reglasEspecificas: Regla[] = [];

  constructor(serviciosIncluidos: string[] = [], contratoAnual: boolean) {
    this.serviciosEspecificos = serviciosIncluidos;
    this.contratoAnual = contratoAnual;
  }

  public abstract getNombreTipo(): string;

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
