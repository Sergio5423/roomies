import { TipoAlojamiento } from "./TipoAlojamiento";

export class Pensionado extends TipoAlojamiento {
    private nombre: string = "Pensionado";

    public getNombreTipo(): string {
        return this.nombre;
    }
}
