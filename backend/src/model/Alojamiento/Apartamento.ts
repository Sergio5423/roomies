import { TipoAlojamiento } from "./TipoAlojamiento";

export class Apartamento extends TipoAlojamiento {

    private nombre: string = "Apartamento";

    public getNombreTipo(): string {
        return this.nombre;
    }
}
