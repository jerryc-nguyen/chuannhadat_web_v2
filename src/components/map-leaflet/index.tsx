"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center = {
  lat: 51.505,
  lng: -0.09,
}

function DraggableMarker() {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable ? "Marker is draggable" : "Click here to make marker draggable"}
        </span>
      </Popup>
    </Marker>
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

function MapLeaflet() {

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
        zoom={13}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />
        <DraggableMarker />
        <MapController />
      </MapContainer>
    </div>
  );
}

export default MapLeaflet;