'use client'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const icon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#22C55E;border-radius:50%;border:2px solid #0A0A0A;box-shadow:0 0 6px rgba(34,197,94,.5)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

interface Location { name: string; ll: string; radius: number; lat: number; lng: number }

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number, name: string) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        const name = data.address?.city ?? data.address?.town ?? data.address?.state ?? `${lat.toFixed(2)}, ${lng.toFixed(2)}`
        onMapClick(lat, lng, name)
      } catch {
        onMapClick(lat, lng, `${lat.toFixed(2)}, ${lng.toFixed(2)}`)
      }
    },
  })
  return null
}

export default function MapPicker({
  locations,
  onMapClick,
}: {
  locations: Location[]
  onMapClick: (lat: number, lng: number, name: string) => void
}) {
  return (
    <MapContainer
      center={[-15.78, -47.93]}
      zoom={4}
      style={{ height: '100%', width: '100%', background: '#141414' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OSM"
      />
      <MapClickHandler onMapClick={onMapClick} />
      {locations.map((loc, i) => (
        <div key={i}>
          <Marker position={[loc.lat, loc.lng]} icon={icon}>
            <Popup>{loc.name} · {loc.radius} km</Popup>
          </Marker>
          <Circle
            center={[loc.lat, loc.lng]}
            radius={loc.radius * 1000}
            pathOptions={{ color: '#22C55E', fillColor: '#22C55E', fillOpacity: 0.06, weight: 1 }}
          />
        </div>
      ))}
    </MapContainer>
  )
}
