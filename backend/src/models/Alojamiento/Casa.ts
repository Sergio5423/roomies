import { TipoAlojamiento } from "./TipoAlojamiento";

export class Casa extends TipoAlojamiento {
    
    private nombre: string = "Casa";

    public getNombre(): string {
        return this.nombre;
    }

}
