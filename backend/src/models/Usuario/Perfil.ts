import { InformacionAcademica } from "./InformacionAcademica";

export class Perfil {
  private readonly id: number;
  private foto: string;
  private biografia: string;
  private edad: number;
  private informacionAcademica: InformacionAcademica;

  constructor(
    id: number,
    foto: string,
    biografia: string,
    edad: number,
    informacionAcademica: InformacionAcademica
  ) {
    this.id = id,
    this.foto = foto,
    this.biografia = biografia,
    this.edad = edad,
    this.informacionAcademica = informacionAcademica
  }

  public actualizarBiografia(nuevaBio: string): void {
    this.biografia = nuevaBio;
  }

  public actualizarFoto(nuevaFoto: string): void {
    this.foto = nuevaFoto;
  }

  public actualizarInformacionAcademica(info: InformacionAcademica): void {
    this.informacionAcademica = info;
  }

  // Getters
  public getId(): number { return this.id; }
  public getFoto(): string { return this.foto; }
  public getBiografia(): string { return this.biografia; }
  public getEdad(): number { return this.edad; }
  public getInformacionAcademica(): InformacionAcademica | undefined {
    return this.informacionAcademica;
  }
}