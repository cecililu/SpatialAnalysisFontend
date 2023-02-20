import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { GeoJSON, LayersControl } from "react-leaflet";
import L from "leaflet";

const Buttons = ({ fetchBufferPolygon, markerPosition }) => {
  const map = useMap();

  return (
    <div className="top-component">
      <button onClick={fetchBufferPolygon}>Get Buffer Polygon</button>
      <button
        onClick={() => {
          map.setView([markerPosition.lat, markerPosition.lng], 18);
        }}
      >
        Change zoom lvel
      </button>
    </div>
  );
};

var greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const App = () => {
  const [viewport, setViewport] = useState({
    center: [27.649, 85.319],
    zoom: 13,
  });
  // const [lat, setLat] = useState(27);
  // const [lng, setLng] = useState(85);
  const [zoom, setZoom] = useState(13);
  const [analysisResult, setAnalysisResult] = useState("");
  // console.log(bufferPolygon)
  const [markerPosition, setMarkerPosition] = useState({
    lat: 27.6588,
    lng: 85.3247,
  });

  console.log("zoom level", zoom);

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setMarkerPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const fetchBufferPolygon = async () => {
    console.log('fecthcing......')
    const data = await fetch(
      `http://127.0.0.1:8000/building/?lat=${markerPosition.lat}&lng=${markerPosition.lng}&buffer_distance=100`
    );
    const affectedBuilding = await data.json();
    setAnalysisResult(affectedBuilding);
  };

  function createPopupContent(feature) {
    return (
      "<h3>" +
      "OSM ID FOR THE BUIDING" +
      "</h3>" +
      "<p>" +
      feature?.properties?.osm_id +
      "</p>" +
      "<p> Amenities" +
      feature?.properties?.amenities +
      "</p>"
    );
  }

  function onEachFeature(feature, layer) {
    var color =
      feature.properties.amenities == "place_of_worship" ? "blue" : "red";
    var fillcolor =
      feature.properties.amenities == "place_of_worship" ? "blue" : "";

    layer.setStyle({
      fillColor: fillcolor,
      color: color,
      weight: 1,
      fillOpacity: 0.7,
    });
    layer.bindPopup(createPopupContent(feature));
  }
  const polygon = analysisResult ? (
    <GeoJSON data={analysisResult} onEachFeature={onEachFeature} />
  ) : null;

  console.log("asas", analysisResult);

  function handleViewportChanged(viewport) {
    setViewport(viewport);
  }
  const { bounds } = viewport;
  useEffect(()=>{
    
    setAnalysisResult(null)
    fetchBufferPolygon()
    console.log('userffect run')
  },[markerPosition])
  return (
    <div>
      <MapContainer center={markerPosition} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          icon={greenIcon}
          draggable={true}
          eventHandlers={eventHandlers}
          position={markerPosition}
          ref={markerRef}
        >
          <Popup minWidth={90}>
            <span>'Drag this Marker to locate Disaster'</span>
          </Popup>
        </Marker>
        {analysisResult && (
        <GeoJSON data={analysisResult} onEachFeature={onEachFeature} />
      )}
        <Buttons
          fetchBufferPolygon={fetchBufferPolygon}
          markerPosition={markerPosition}
        ></Buttons>
        
      </MapContainer>
    </div>
  );
};

export default App;
