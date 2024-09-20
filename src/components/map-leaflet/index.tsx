"use client"
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { center, SimpleLatLng, zoom } from "./config";

interface DraggableMarkerProps {
  position: SimpleLatLng;
  onPositionChange: (newPosition: SimpleLatLng) => void;
}

function DraggableMarker({ position, onPositionChange }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onPositionChange(marker.getLatLng());
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    />
  );
}

const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error typescript does not see additional handler here
    map.gestureHandling.enable();
    // L.marker(center, {icon: markerIcon}).addTo(map);
  }, [map]);

  return null;
}

const markerIcon = L.icon({
  iconUrl: "/map-marker-chuannhadat.png",

  iconSize:     [50, 50], // size of the icon
  iconAnchor:   [25, 50], // point of the icon which will correspond to marker"s location
});

interface MapLeafletProps {
  position: SimpleLatLng;
  onPositionChange: (newPosition: SimpleLatLng) => void;
}

function MapLeaflet({ position, onPositionChange }: MapLeafletProps) {

  return (
    <div style={{ display: "flex" }}>
      <MapContainer
        className="relative bg-blend-overlay rounded-lg" 
        style={{
          // height: "70%",
          width: "100%",
          aspectRatio: "auto 5/2"
        }}
        center={center}
        zoom={zoom}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
        <DraggableMarker
          position={position}
          onPositionChange={onPositionChange}
        />
        <MapController />
      </MapContainer>
    </div>
  );
}

export default MapLeaflet;