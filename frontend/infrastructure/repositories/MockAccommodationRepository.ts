import type { Accommodation } from "../../domain/habitaciones/Accommodation";
import type { AccommodationRepository } from "../../domain/habitaciones/AccommodationRepository";
import { accommodations } from "../../app/data/mock/accomodations";

export class MockAccommodationRepository
  implements AccommodationRepository
{
  async getAll(): Promise<Accommodation[]> {
    return accommodations;
  }

  async getById(id: number): Promise<Accommodation | null> {
    return (
      accommodations.find(
        (accommodation) => accommodation.id === id
      ) ?? null
    );
  }

  async getBySlug(slug: string): Promise<Accommodation | null> {
    return (
      accommodations.find(
        (accommodation) => accommodation.slug === slug
      ) ?? null
    );
  }
}