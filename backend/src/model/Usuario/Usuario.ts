import { Perfil } from './Perfil'

export abstract class Usuario {
  private readonly id: number;
  private nombreCompleto: string;
  private telefono: string;
  private readonly rol: string;
  private estado: string;
  private email: string;
  //private passwordHash: PasswordHash
  private perfil?: Perfil

  constructor(
    id: number,
    nombreCompleto: string,
    telefono: string,
    rol: string,
    estado: string,
    email: string
  ) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.telefono = telefono;
    this.rol = rol;
    this.estado = estado;
    this.email = email;
  }

  public actualizarUsuario(datos: Usuario): void {
    this.nombreCompleto = datos.nombreCompleto;
    this.telefono = datos.telefono;
    this.email = datos.email;
  }

  public actualizarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public asociarPerfil(perfil: Perfil): void {
    this.perfil = perfil;
  }

  public getId(): number { return this.id; }
  public getNombreCompleto(): string { return this.nombreCompleto; }
  public getTelefono(): string { return this.telefono; }
  public getRol(): string { return this.rol; }
  public getEstado(): string { return this.estado; }
  public getEmail(): string { return this.email; }
  public getPerfil(): Perfil | undefined { return this.perfil; }
}