import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import type { LocationItem } from "../../app/data/mock/locations";
import { cities } from "../../app/data/mock/cities";

interface LocationMapProps {
  locations: LocationItem[];
}

interface MapComponentProps {
  locations: LocationItem[];
}

export default function LocationMap({
  locations,
}: LocationMapProps) {
  const [Map, setMap] =
    useState<ComponentType<MapComponentProps> | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([reactLeaflet, L]) => {
      if (!mounted) return;

      const DefaultIcon = L.Icon.Default;

      delete (
        DefaultIcon.prototype as unknown as {
          _getIconUrl?: unknown;
        }
      )._getIconUrl;

      DefaultIcon.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const MapComponent = ({
        locations,
      }: MapComponentProps) => {
        const {
          MapContainer,
          Marker,
          Popup,
          TileLayer,
          CircleMarker,
        } = reactLeaflet;

        return (
          <MapContainer
            center={[4.6, -74.1]}
            zoom={5}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* =========================================
                CIUDADES DE COLOMBIA
               ========================================= */}

            {cities.map((city) => (
              <CircleMarker
                key={`city-${city.id}`}
                center={[
                  city.latitude,
                  city.longitude,
                ]}
                radius={9}
              >
                <Popup>
                  <div className="w-[240px]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Ciudad
                    </p>

                    <h3 className="mt-1 text-base font-semibold text-gray-900">
                      {city.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {city.department}
                    </p>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500">
                        Coordenadas de referencia
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {city.latitude}, {city.longitude}
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* =========================================
                PUBLICACIONES DE ROOMIES
               ========================================= */}

            {locations.map((location) => {
              const city = cities.find(
                (item) => item.id === location.cityId,
              );

              if (!city) {
                return null;
              }

              return (
                <Marker
                  key={`location-${location.id}`}
                  position={[
                    city.latitude,
                    city.longitude,
                  ]}
                >
                  <Popup>
                    <div className="w-[260px]">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                        {location.type === "room" &&
                          "Habitación"}

                        {location.type === "roommate" &&
                          "Roomie"}

                        {location.type === "post" &&
                          "Publicación"}
                      </p>

                      <h3 className="text-base font-semibold leading-5 text-gray-900">
                        {location.title}
                      </h3>

                      <p className="mt-2 text-sm leading-5 text-gray-600">
                        {location.description}
                      </p>

                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <p className="text-sm font-medium text-gray-800">
                          📍 {location.neighborhood}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {city.name} ·{" "}
                          {location.postalCode}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {location.commune}
                        </p>
                      </div>

                      {location.roomType && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <p className="text-xs text-gray-500">
                            Tipo: {location.roomType}
                          </p>
                        </div>
                      )}

                      {(location.contactPhone ||
                        location.contactEmail) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          {location.contactPhone && (
                            <p className="text-xs text-gray-600">
                              ☎ {location.contactPhone}
                            </p>
                          )}

                          {location.contactEmail && (
                            <p className="mt-1 text-xs text-gray-600">
                              ✉ {location.contactEmail}
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        Ver publicación
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        );
      };

      setMap(() => MapComponent);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Map) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-gray-200 bg-gray-100">
        <p className="text-sm text-gray-500">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-gray-200">
      <Map locations={locations} />
    </div>
  );
}