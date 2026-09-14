import type { Roommate } from "../../domain/roomies/Roommate";
import type { RoommateRepository } from "../../domain/roomies/RoommateRepository";
import { roommates } from "../../app/data/mock/roomates";

export class MockRoommateRepository
  implements RoommateRepository
{
  async getAll(): Promise<Roommate[]> {
    return roommates;
  }

  async getById(id: number): Promise<Roommate | null> {
    return (
      roommates.find(
        (roommate) => roommate.id === id
      ) ?? null
    );
  }
}