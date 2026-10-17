export class Precio {
    constructor (
        private readonly precioMensual: number
    ) {

    }

    public getPrecioMensual(): number { return this.precioMensual; }
}