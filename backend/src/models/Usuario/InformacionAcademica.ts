export class InformacionAcademica {
    private readonly universidad: string;
    private readonly carrera: string

    constructor(
        universidad: string,
        carrera: string
    ) {
        this.universidad = universidad;
        this.carrera = carrera;
        if (!universidad.trim() || !carrera.trim()) {
            throw new Error("La universidad y la carrera son obligatorias.");
        }
    }

    public getUniversidad(): string { return this.universidad; }
    public getCarrera(): string { return this.carrera; }

    public esIgual(otra: InformacionAcademica): boolean {
        if (!otra) return false;
        return (
            this.universidad === otra.getUniversidad() &&
            this.carrera === otra.getCarrera()
        );
    }
}