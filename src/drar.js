

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


export function Drar() {
   
    const featureGroupRef = useRef();
    const [polygonCoords, setPolygonCoords] = useState([]);
    
    console.log(featureGroupRef,'my REF')
    console.log('yo',polygonCoords)
    
    function onCreated(e) {
      const layer = e.layer;
      featureGroupRef.current.addLayer(layer);
  
      const latLngs = layer.getLatLngs()[0];
      const coords = latLngs.map(({ lat, lng }) => [lat, lng]);
  
      setPolygonCoords(coords);
      console.log("Polygon coordinates:", coords);
    }
    function onEdited(e) {
        const layers = e.layers;
        layers.eachLayer((layer) => {
          const latLngs = layer.getLatLngs()[0];
          const coords = latLngs.map(({ lat, lng }) => [lat, lng]);
          console.log("New polygon coordinates:", coords);
        });
      
        const featureGroup = featureGroupRef.current;
        const layersArray = featureGroup.getLayers();
        const coordsArray = layersArray.map((layer) => {
          const latLngs = layer.getLatLngs()[0];
          return latLngs.map(({ lat, lng }) => [lat, lng]);
        });
      
        const flattenedCoords = coordsArray.flat();
        setPolygonCoords(flattenedCoords);
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
        {polygonCoords.length > 0 && (
          <div  className="my-container" style={{zIndex:9999}}>
            <h3>Polygon Coordinates:</h3>
            <ul>
              {polygonCoords.map((coord, index) => (
                <li key={index}>{`[${coord.join(", ")}]`}</li>
              ))}
            </ul>
          </div>
        )}
      </MapContainer>
    );
  }