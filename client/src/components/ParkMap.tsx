import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface Park {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface MapProps {
  park: Park;
}

const ParkMap: React.FC<MapProps> = ({ park }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !park.geometry.coordinates) return;

    // Ensure the coordinates are valid and in the correct format
    const [longitude, latitude] = park.geometry.coordinates;

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      console.error("Invalid coordinates:", park.geometry.coordinates);
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // container element
      style: 'mapbox://styles/mapbox/streets-v11', // map style
      center: [longitude, latitude], // starting position [lng, lat]
      zoom: 12, // zoom level
    });

    // Add a marker at the park's location
    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => map.remove(); // Cleanup map instance on unmount
  }, [park]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '245px', borderRadius: '8px', }}
    />
  );
};

export default ParkMap;
