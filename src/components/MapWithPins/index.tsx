import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pin from '../../assets/pin.svg';

interface MarkerType {
  id: number;
  position: [number, number];
  label: string;
}

interface DarkMapProps {
  markers: MarkerType[];
  height?: number;
}

const customIcon = L.icon({
  iconUrl: pin,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -40],
});

const DarkMapExample: React.FC<DarkMapProps> = ({ markers, height = 500 }) => {
  if (!markers.length) return null;

  const polylinePositions = markers.map((m) => m.position);
  const getLineColor = () => "#FF375F";

  return (
    <div
      style={{
        position: "relative",
        height: `${height}px`,
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={markers[0].position}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={customIcon}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
        <Polyline
          positions={polylinePositions}
          color={getLineColor()}
          weight={4}
          dashArray="10,5"
        />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          zIndex: 9999,
          bottom: 0,
          right: 0,
          width: 200,
          height: 20,
          backgroundColor: "#262626",
        }}
      />
    </div>
  );
};

export default DarkMapExample;