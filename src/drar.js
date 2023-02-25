import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  GeoJSON,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L, { Layer } from "leaflet";
import "leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet-draw";
import { useEffect, useRef, useState } from "react";


import wk from "wellknown";
export function Drar() {
  const [formData, setFormData] = useState({
    house_metric_number: "",
    address: "",
    phone1: "",
    phone2: "",
    people:'',
    osm_id:''
  });
 

  const [Editmode, setEditmode] = useState(0)

  console.log("FORM DATA", formData);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }
   
  async function postPolygonData() {
    const polygonData = {
    
      way: `${polygonCoords}`,
      building: "yes",
    };
 
    try {
      console.log("Posting---data");
      console.log('posting',{ ...polygonData, ...formData })
      const response = await fetch("http://127.0.0.1:8000/newdata/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...polygonData, ...formData }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      onDelete();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const featureGroupRef = useRef();
  const [polygonCoords, setPolygonCoords] = useState([]);

  console.log(featureGroupRef, "my REF");
  console.log("yo", polygonCoords);

  function onCreated(e) {
    const layer = e.layer;
    featureGroupRef.current.addLayer(layer);

    const latLngs = layer.getLatLngs()[0];
    const coords = latLngs.map(({ lat, lng }) => [lng, lat]);

    // Convert coordinates to a Polygon and then to WKT
    const polygonWkt = wk.stringify({
      type: "Polygon",
      coordinates: [coords],
    });

    setPolygonCoords(polygonWkt);
    console.log("Polygon WKT:", polygonWkt);
  }

  function onEdited(e) {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const latLngs = layer.getLatLngs()[0];
      const coords = latLngs.map(({ lat, lng }) => [lng, lat]);
      console.log("New polygon coordinates:", coords);
    });

    const featureGroup = featureGroupRef.current;
    const layersArray = featureGroup.getLayers();
    const coordsArray = layersArray.map((layer) => {
      const latLngs = layer.getLatLngs()[0];
      return latLngs.map(({ lat, lng }) => [lng, lat]);
    });

    // Convert coordinates to a MultiPolygon and then to WKT
    const multiPolygonWkt = wk.stringify({
      type: "Polygon",
      coordinates: [coordsArray],
    });

    setPolygonCoords(multiPolygonWkt);
    console.log("Polygon WKT:", multiPolygonWkt);
  }
  function onDelete() {
    const featureGroup = featureGroupRef.current;
    featureGroup.clearLayers();
    setPolygonCoords(null);
  }
  const [analysisResult, setAnalysisResult] = useState("");
const fetchBufferPolygon = async () => {
    console.log('fecthcing......')
    const data = await fetch(
      `http://127.0.0.1:8000/building/?lat=27.6588&lng=85.3247&buffer_distance=1000`
    );
    const affectedBuilding = await data.json();
    setAnalysisResult(affectedBuilding);
  };
useEffect(()=>{
  if (Editmode&& !analysisResult){  
    fetchBufferPolygon()}
     console.log('userffect run')
  },[Editmode])

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
  return (
    <> 
    <button className={Editmode?"bg-green-700 text-white p-1 pr-2":"p-1 bg-red-700 text-white"} onClick={()=>setEditmode(!Editmode)}>{Editmode?"Edit mode enable":"Edit mode disable"}</button>
    <div className="grid grid-cols-4 ">
     
      <div className="col-span-2">
        <MapContainer center={[27.6588, 85.3247]} zoom={16}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={onCreated}
              onEdited={onEdited}
              draw={{
                circle: false,
                rectangle: false,
                marker: false,
              }}
              featureGroup={featureGroupRef.current}
            />
          </FeatureGroup>
          <div className="my-container">
            {polygonCoords ? polygonCoords : ""}
          </div>
          <br />
          <br />
          {Editmode&&analysisResult && (
        <GeoJSON data={analysisResult} onEachFeature={onEachFeature} />
      )}
          <div className="my-container"></div>
        </MapContainer>
      </div>

      <div className="col-span-2 p-2">
        <form className="max-w-md mx-auto my-8">
          <div className="mb-4">
            <label
              htmlFor="house_metric_number"
              className="block mb-2 font-bold"
            >
              House Metric Number:
            </label>
            <input
              type="text"
              name="house_metric_number"
              id="house_metric_number"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-bold">
              Address:
            </label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone1" className="block mb-2 font-bold">
              Phone 1:
            </label>
            <input
              type="text"
              name="phone1"
              id="phone1"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone2" className="block mb-2 font-bold">
              Phone 2:
            </label>
            <input
              type="text"
              name="phone2"
              id="phone2"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="people" className="block mb-2 font-bold">
             people
            </label>
            <input
              type="text"
              name="people"
              id="people"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>


          <div className="mb-4">
            <label htmlFor="osm_id" className="block mb-2 font-bold">
             OSM-ID
            </label>
            <input
              type="text"
              name="osm_id"
              id="osm_id"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </form>

        <center>
          {" "}
          <button
            style={{ background: "red", color: "white", padding: "10px" }}
            onClick={postPolygonData}
          >
            Add data
          </button>
        </center>
      </div>
    </div>
    </>
  );
}
