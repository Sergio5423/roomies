export class RangoPresupuesto {
    constructor(
        private readonly minimo: number,
        private readonly maximo: number
    ) {
        if (minimo < 0 || maximo < 0) {
            throw new Error("El presupuesto no puede contener montos negativos.");
        }
        if (minimo > maximo) {
            throw new Error("El presupuesto mínimo no puede ser mayor que el máximo.");
        }
    }

    public incluyeMonto(monto: number): boolean {
        return monto >= this.minimo && monto <= this.maximo;
    }

    public getMinimo(): number { return this.minimo; }
    public getMaximo(): number { return this.maximo; }
}