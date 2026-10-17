import { TipoAlojamiento } from "./TipoAlojamiento";

export class Pensionado extends TipoAlojamiento {
    private nombre: string = "Pensionado";

    public getNombre(): string {
        return this.nombre;
    }
}
