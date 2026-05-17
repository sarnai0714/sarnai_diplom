"use client";
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapPicker({ onLocationSelect }) {
  const [pos, setPos] = useState([47.9188, 106.9176]);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={pos} icon={icon} />;
  }

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-inner">
      <MapContainer center={pos} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
      </MapContainer>
    </div>
  );
}