import type { Accommodation } from "./Accommodation";

export interface AccommodationRepository {
  getAll(): Promise<Accommodation[]>;
  getById(id: number): Promise<Accommodation | null>;
  getBySlug(slug: string): Promise<Accommodation | null>;
}