import type { Roommate } from "./Roommate";

export interface RoommateRepository {
  getAll(): Promise<Roommate[]>;
  getById(id: number): Promise<Roommate | null>;
}