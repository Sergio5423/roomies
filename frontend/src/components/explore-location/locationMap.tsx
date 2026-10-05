import { useEffect, useState } from "react";
import type { LocationItem } from "../../../app/data/mock/locations";

interface LocationMapProps {
  locations: LocationItem[];
  activeLocationId?: string | number | null;
}

export default function LocationMap({
  locations,
  activeLocationId,
}: LocationMapProps) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Carga dinámicamente Leaflet y React-Leaflet únicamente en el navegador (cliente)
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([{ MapContainer, TileLayer, Marker, Popup }, L]) => {
      const customIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const activeIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [28, 45],
        iconAnchor: [14, 45],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      function getCoordinates(
        item: Record<string, any>
      ): [number, number] | null {
        if (!item) return null;

        const lat =
          typeof item.lat === "number"
            ? item.lat
            : typeof item.latitude === "number"
            ? item.latitude
            : null;
        const lng =
          typeof item.lng === "number"
            ? item.lng
            : typeof item.longitude === "number"
            ? item.longitude
            : null;

        if (lat !== null && lng !== null) {
          return [lat, lng];
        }

        if (item.coordinates) {
          if (
            Array.isArray(item.coordinates) &&
            item.coordinates.length >= 2
          ) {
            return [Number(item.coordinates[0]), Number(item.coordinates[1])];
          }
          if (typeof item.coordinates === "object") {
            const cLat = item.coordinates.lat ?? item.coordinates.latitude;
            const cLng = item.coordinates.lng ?? item.coordinates.longitude;
            if (typeof cLat === "number" && typeof cLng === "number") {
              return [cLat, cLng];
            }
          }
        }

        return null;
      }

      const DynamicMap = ({
        locations,
        activeLocationId,
      }: LocationMapProps) => {
        const firstCoords =
          locations.length > 0
            ? getCoordinates(locations[0] as Record<string, any>)
            : null;
        const center: [number, number] = firstCoords || [4.5709, -74.2973];

        return (
          <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((item) => {
              const rawItem = item as Record<string, any>;
              const coords = getCoordinates(rawItem);
              if (!coords) return null;

              const isActive = activeLocationId === rawItem.id;
              const imageSrc = rawItem.image || rawItem.img;
              const displayTitle = rawItem.title || rawItem.name || "Ubicación";

              return (
                <Marker
                  key={rawItem.id}
                  position={coords}
                  icon={isActive ? activeIcon : customIcon}
                >
                  <Popup>
                    <div className="p-1 max-w-[180px]">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={displayTitle}
                          className="h-20 w-full rounded-md object-cover"
                        />
                      )}
                      <h5 className="mt-1.5 text-xs font-bold text-gray-900 line-clamp-1">
                        {displayTitle}
                      </h5>
                      {typeof rawItem.price === "number" && (
                        <p className="text-[11px] font-semibold text-emerald-700">
                          ${rawItem.price.toLocaleString("es-CO")} COP
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        );
      };

      setMapComponent(() => DynamicMap);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-50 flex flex-col items-center justify-center text-gray-400 gap-2 shadow-md">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <span className="text-sm font-medium text-gray-500">
          Cargando mapa...
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200/80 shadow-md">
      <MapComponent
        locations={locations}
        activeLocationId={activeLocationId}
      />
    </div>
  );
}