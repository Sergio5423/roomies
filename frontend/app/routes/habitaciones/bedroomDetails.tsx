import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Accommodation } from "../../../domain/habitaciones/Accommodation";
import type { Roommate } from "../../../domain/roomies/Roommate";

import { MockAccommodationRepository } from "../../../infrastructure/repositories/MockAccommodationRepository";
import { MockRoommateRepository } from "../../../infrastructure/repositories/MockRoommateRepository";

import RoomDetail from "../../../components/habitaciones/RoomDetail";

const accommodationRepository =
  new MockAccommodationRepository();

const roommateRepository =
  new MockRoommateRepository();

export default function BedroomDetails() {
  const { ciudad, slug } = useParams();

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [roommates, setRoommates] =
    useState<Roommate[]>([]);

  useEffect(() => {
    if (!ciudad || !slug) return;

    accommodationRepository
      .getBySlug(slug)
      .then(async (data) => {
        setAccommodation(data);

        if (!data) return;

        const relatedRoommates =
          await Promise.all(
            data.ocupantesIds.map((roomieId) =>
              roommateRepository.getById(roomieId)
            )
          );

        setRoommates(
          relatedRoommates.filter(
            (roommate): roommate is Roommate =>
              roommate !== null
          )
        );
      });
  }, [ciudad, slug]);

  if (!accommodation) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Habitación no encontrada
        </h1>
      </main>
    );
  }

  return (
    <RoomDetail
      accommodation={accommodation}
      roommates={roommates}
    />
  );
}