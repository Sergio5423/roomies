import React, { useEffect, useState } from 'react';
import type { Alojamiento } from '../../domain/models/Alojamiento';

interface RoomMapProps {
  rooms: Alojamiento[];
  onSelectRoom: (room: Alojamiento) => void;
}

export default function RoomMap({ rooms, onSelectRoom }: RoomMapProps) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to prevent SSR issues
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([{ MapContainer, TileLayer, Marker, Popup }, L]) => {
      const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const greenIcon = new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [26, 42],
        iconAnchor: [13, 42],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const DynamicMap = ({ rooms, onSelectRoom }: RoomMapProps) => {
        // Centro por defecto: Valledupar o primera habitación
        let center: [number, number] = [10.463, -73.253];

        const firstRoomWithCoords = rooms.find(
          (r) =>
            typeof r.ubicacion?.latitud === 'number' &&
            typeof r.ubicacion?.longitud === 'number' &&
            r.ubicacion.latitud !== 0
        );

        if (firstRoomWithCoords && firstRoomWithCoords.ubicacion) {
          center = [firstRoomWithCoords.ubicacion.latitud!, firstRoomWithCoords.ubicacion.longitud!];
        }

        return (
          <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={false}
            className="h-full w-full z-0 rounded-2xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {rooms.map((room, idx) => {
              const u = room.ubicacion;
              // Coordenadas con pequeño offset si son idénticas para que no se sobrepongan
              const lat = typeof u?.latitud === 'number' && u.latitud !== 0 ? u.latitud + (idx * 0.001) : 10.463 + (idx * 0.002);
              const lng = typeof u?.longitud === 'number' && u.longitud !== 0 ? u.longitud + (idx * 0.001) : -73.253 + (idx * 0.002);

              const precioMensual =
                typeof room.precio === 'object' && room.precio !== null
                  ? room.precio.precioMensual || (room.precio as any).monto || 0
                  : Number(room.precio ?? 0);

              const formattedPrice = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
              }).format(precioMensual);

              const isDisponible = (room.estado || 'disponible').toLowerCase() === 'disponible';
              const img = room.imagenes && room.imagenes.length > 0 ? room.imagenes[0] : '';

              return (
                <Marker
                  key={room.id}
                  position={[lat, lng]}
                  icon={isDisponible ? greenIcon : customIcon}
                >
                  <Popup>
                    <div className="p-1 max-w-[210px] space-y-1.5">
                      {img && (
                        <img
                          src={img}
                          alt={room.titulo}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                      )}
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1">
                        {room.titulo}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        📍 {room.ubicacion?.barrio || 'Centro'}, {room.ubicacion?.ciudad || 'Valledupar'}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-xs font-black text-emerald-700">
                          {formattedPrice}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectRoom(room)}
                          className="text-[11px] font-bold text-slate-900 bg-gray-100 hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded transition"
                        >
                          Ver
                        </button>
                      </div>
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
      <div className="relative h-[500px] w-full rounded-2xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400 gap-2 shadow-inner">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <span className="text-xs font-semibold text-gray-500">
          Cargando mapa interactivo de alojamientos...
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full rounded-2xl border border-gray-200 overflow-hidden shadow-md">
      <MapComponent rooms={rooms} onSelectRoom={onSelectRoom} />
    </div>
  );
}
