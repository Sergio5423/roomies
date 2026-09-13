export class Caracteristica {
    constructor(
        private readonly numeroCuartos: number,
        private readonly metrosCuadrados: number,
        private readonly capacidad: number,        
        private readonly amoblado: boolean,
        private readonly buscandoRoomie: boolean
    ) {

    }

    public getNumeroCuartos(): number { return this.numeroCuartos; }
    public getMetrosCuadrados(): number { return this.metrosCuadrados; }
    public getCapacidad(): number { return this.capacidad; }    
    public getAmoblado(): boolean { return this.amoblado; }
    public getBuscandoRoomie(): boolean { return this.buscandoRoomie; }
}