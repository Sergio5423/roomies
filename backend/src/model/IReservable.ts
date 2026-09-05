// src/model/Reservable.ts

export interface Reservable {
  estaDisponible(): boolean;
  reservar(): void;
}