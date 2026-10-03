export class Ubicacion {
  constructor(
    private readonly direccion: string,
    private readonly ciudad: string,
    private readonly barrio: string,
    private readonly distancia: string,
    private readonly latitud: number,
    private readonly longitud: number
  ) {
    if (!direccion.trim() || !ciudad.trim()) {
      throw new Error("La dirección y la ciudad son obligatorias.");
    }
    if (latitud < -90 || latitud > 90) {
      throw new Error("La latitud debe estar entre -90 y 90.");
    }
    if (longitud < -180 || longitud > 180) {
      throw new Error("La longitud debe estar entre -180 y 180.");
    }
  }

  public getDireccion(): string { return this.direccion; }
  public getCiudad(): string { return this.ciudad; }
  public getBarrio(): string { return this.barrio; }
  public getDistancia(): string { return this.distancia; }
  public getLatitud(): number { return this.latitud; }
  public getLongitud(): number { return this.longitud; }
}