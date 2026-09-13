export class Usuario {
  private id: number,
  private nombreCompleto: string,
  private telefono: string,
  private rol: string,
  private estado: string,
  private email: string,
  private passwordHash: PasswordHash
}