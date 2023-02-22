import * as React from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function Mapgl() {  
    return (
    <Map
      initialViewState={{
        longitude: -75.3372987731628,
        latitude:45.383321536272049,
        zoom: 10
      }}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}
