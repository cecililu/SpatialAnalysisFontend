

import { LayerGroup, LayersControl, MapContainer, Marker, TileLayer ,GeoJSON, FeatureGroup} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L, { Layer } from "leaflet";
import "leaflet-draw";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet-draw";
import { useRef, useState } from "react";

import wk from 'wellknown';
export function Drar() {
   
   
    async function postPolygonData() {
        const polygonData = {
          osm_id:1233,
          way: `${polygonCoords}`,
          building: "yes"
        };
        
        try {
            console.log('Posting---data')
          const response = await fetch('http://127.0.0.1:8000/newdata/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(polygonData)
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }

   
    const featureGroupRef = useRef();
    const [polygonCoords, setPolygonCoords] = useState([]);
    
    console.log(featureGroupRef,'my REF')
    console.log('yo',polygonCoords)
    
    function onCreated(e) {
        const layer = e.layer;
        featureGroupRef.current.addLayer(layer);
      
        const latLngs = layer.getLatLngs()[0];
        const coords = latLngs.map(({ lat, lng }) => [lng, lat]);
      
        // Convert coordinates to a Polygon and then to WKT
        const polygonWkt = wk.stringify({
          type: 'Polygon',
          coordinates: [coords]
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
            type: 'Polygon',
            coordinates: [coordsArray]
          });
      
          setPolygonCoords(multiPolygonWkt);
          console.log("Polygon WKT:", multiPolygonWkt);
      }
  
    return (
      <MapContainer center={[27.6588, 85.3247]} zoom={13}>
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
        <div className="my-container">{polygonCoords?polygonCoords:""}
        </div>
        <br/>
        <br/>
         <div className="my-container">
            <button style={{background:'red',color:'white',padding:'10px'}}onClick={postPolygonData}>Add data</button>
        </div>
      </MapContainer>
    );
  }