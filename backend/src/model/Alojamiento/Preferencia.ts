import { RangoPresupuesto } from "./RangoPresupuesto";
import type { TipoAlojamiento } from "./ITipoAlojamiento";


export class Preferencia {
  private id: number;
  private presupuesto: RangoPresupuesto;
  private distanciaMaxMinutos: string;
  private numeroHabitacionesDeseadas: string;
  private soloConRoomieDisponible: boolean;
  private amoblado: boolean;
  private tipoAlojamiento: TipoAlojamiento;

  constructor(
    id: number,
    presupuesto: RangoPresupuesto,
    distanciaMaxMinutos: string,
    numeroHabitacionesDeseadas: string,
    soloConRoomieDisponible: boolean,
    amoblado: boolean,
    tipoAlojamiento: TipoAlojamiento
  ) {
    this.id = id;
    this.presupuesto = presupuesto,
    this.distanciaMaxMinutos = distanciaMaxMinutos;
    this.numeroHabitacionesDeseadas = numeroHabitacionesDeseadas;
    this.soloConRoomieDisponible = soloConRoomieDisponible;
    this.amoblado = amoblado;
    this.tipoAlojamiento = tipoAlojamiento;
  }

  public esPrecioCompatible(precio: number): boolean {
    return this.presupuesto.incluyeMonto(precio);
  }  

  public esTipoCompatible(tipo: TipoAlojamiento): boolean {
    return this.tipoAlojamiento.getNombreTipo() === tipo.getNombreTipo();
  }

  public getId(): number { return this.id; }
  public getPresupuesto(): RangoPresupuesto { return this.presupuesto; }
  public getDistanciaMaxMinutos(): string { return this.distanciaMaxMinutos; }
  public getNumeroHabitacionesDeseadas(): string { return this.numeroHabitacionesDeseadas; }
  public getSoloConRoomieDisponible(): boolean { return this.soloConRoomieDisponible; }
  public getAmoblado(): boolean { return this.amoblado; }
  public getTipoAlojamiento(): TipoAlojamiento { return this.tipoAlojamiento; }
}