import { Perfil } from './Perfil';

export abstract class Usuario {
  private readonly id: string;
  private first_name: string;
  private last_name: string;
  private email: string;
  private telefono: string;
  private rol: string;
  private estado: string;
  private perfil?: Perfil;

  constructor(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    telefono: string,
    rol: string,
    estado: string = 'activo'
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.telefono = telefono;
    this.rol = rol;
    this.estado = estado;
  }

  public actualizarUsuario(datos: { first_name?: string; last_name?: string; email?: string; telefono?: string }): void {
    if (datos.first_name) this.first_name = datos.first_name;
    if (datos.last_name) this.last_name = datos.last_name;
    if (datos.email) this.email = datos.email;
    if (datos.telefono) this.telefono = datos.telefono;
  }

  public actualizarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
  }

  public asociarPerfil(perfil: Perfil): void {
    this.perfil = perfil;
  }

  // Getters
  public getId(): string { return this.id; }
  public getFirstName(): string { return this.first_name; }
  public getLastName(): string { return this.last_name; }
  public getNombreCompleto(): string { return `${this.first_name} ${this.last_name}`; }
  public getTelefono(): string { return this.telefono; }
  public getRol(): string { return this.rol; }
  public getEstado(): string { return this.estado; }
  public getEmail(): string { return this.email; }
  public getPerfil(): Perfil | undefined { return this.perfil; }
}