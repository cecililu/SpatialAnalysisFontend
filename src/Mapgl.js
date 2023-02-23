import * as React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import  p from "./skateboard-parks.json";

export function Mapgl() {
  const [viewport, setviewport] = useState({
    longitude: -75.3372987731628,
    latitude: 45.383321536272049,
    zoom: 10,
  });
  return (
    <>
      <ReactMapGL
        // {...viewport}
        initialViewState={{
          longitude: -75.3372987731628,
          latitude: 45.383321536272049,
          zoom: 10,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // onViewportChange={(viewport) => {
        //   setviewport(viewport);
        // }}
      >
        {p.features.map((pk) => {
          return (
            <Marker latitude={pk.geometry.coordinates[1]} longitude={pk.geometry
            .coordinates[0]

            }>
              <div className="marker-btn" style={{color:'red'}}>Skatenow</div>
            </Marker>
          );
        })}

        {/* <button>change zoom</button> */}
      </ReactMapGL>
    </>
  );
}
