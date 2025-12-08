// client/src/components/MapView.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// --- NEW COMPONENT: updates map center when props change ---
function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
}

function MapView({ center, places }) {
  if (!center) return <p>Getting your location…</p>;

  const positions = places.map((p) => [p.lat, p.lng]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <MapUpdater center={center} /> {/* <-- added */}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Brewery markers */}
      {places.map((p) => (
        <Marker key={p.externalId || p._id} position={[p.lat, p.lng]}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.address}
          </Popup>
        </Marker>
      ))}

      {/* Connecting route */}
      {positions.length > 1 && <Polyline positions={positions} />}
    </MapContainer>
  );
}

export default MapView;
