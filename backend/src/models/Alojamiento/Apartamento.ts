import { TipoAlojamiento } from "./TipoAlojamiento";

export class Apartamento extends TipoAlojamiento {

    private nombre: string = "Apartamento";

    public getNombre(): string {
        return this.nombre;
    }
}
