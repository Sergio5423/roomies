// src/model/Perfil.ts

export class PerfilModel {
  private id: number;
  private foto: string;
  private biografia: string;
  private universidad: string;
  private carrera: string;
  private edad: number;
  private estudianteCertificado: boolean;

  constructor(id: number, foto: string, biografia: string, universidad: string, carrera: string, edad: number, estudianteCertificado: boolean) {
    this.id = id;
    this.foto = foto;
    this.biografia = biografia;
    this.universidad = universidad;
    this.carrera = carrera;
    this.edad = edad;
    this.estudianteCertificado = estudianteCertificado;
  }

  // Add methods for CRUD operations if needed
}