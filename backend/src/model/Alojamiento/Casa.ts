import { TipoAlojamiento } from "./TipoAlojamiento";

export class Casa extends TipoAlojamiento {
    
    private nombre: string = "Casa";

    public getNombreTipo(): string {
        return this.nombre;
    }

}
