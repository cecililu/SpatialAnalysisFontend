

import { LayerGroup, LayersControl, MapContainer, Marker, TileLayer ,GeoJSON} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L, { Layer } from "leaflet";
import "leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet-draw";
import { useState } from "react";


export function Drar() {
  const [layers, setLayers] = useState([]);

  function onCreated(e) {
    const layer = e.layer;
    setLayers((prevLayers) => [...prevLayers, layer]);
  }

 function onEdited(e) {
    const layers = e.layers.getLayers();
    setLayers(layers);
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <EditControl
        position="topright"
        onCreated={onCreated}
        onEdited={onEdited}
        draw={{
          polyline: {
            shapeOptions: {
              color: "#f357a1",
              weight: 10,
            },
          },
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e1e100",
              message: "<strong>Oh snap!<strong> you can't draw that!",
            },
            shapeOptions: {
              color: "#bada55",
            },
          },
          circle: false,
          rectangle: false,
          marker: {
            icon: new L.Icon.Default(),
          },
        }}
      />
      {layers.map((layer, index) => (
        <LayerGroup key={index}>
          {layer instanceof L.Marker ? (
            <Marker position={layer.getLatLng()} />
          ) : (
            <GeoJSON data={layer.toGeoJSON()} />
          )}
        </LayerGroup>
      ))}
    </MapContainer>
  );
}