import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken ='pk.eyJ1IjoiY2VjaWxnaGltaXJlIiwiYSI6ImNsZWN1ZW9xcjAwbXgzcHBobmZtYXc2cmMifQ.np3-ckw7297XeM_YttXG3A'

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [84.1240, 28.3949],
      zoom: 5
    });

    map.on('load', function () {
      map.addLayer({
        'id': 'nepal',
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/NPL.geo.json'
        },
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.8
        }
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="mapContainer" />;
};

export default Map;