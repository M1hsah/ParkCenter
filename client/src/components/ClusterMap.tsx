// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface Park {
  _id: string;
  title: string;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface MapProps {
  parks: Park[]; // Array of parks passed from the parent component
}

const ParkClusterMap: React.FC<MapProps> = ({ parks }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || '', // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [-98.5795, 39.8283], // Initial map center [longitude, latitude] (center of USA)
      zoom: 3, // Initial zoom level
    });

    // Add zoom and rotation controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      // Add parks data as a GeoJSON source
      map.addSource('parks', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: parks.map((park) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: park.geometry.coordinates, // Use the coordinates from your park data
            },
            properties: {
              id: park._id,
              title: park.title,
            },
          })),
        },
        cluster: true, // Enable clustering
        clusterMaxZoom: 14, // Max zoom to cluster points
        clusterRadius: 50, // Radius of each cluster when clustering points (in pixels)
      });

      // Add a layer for the clustered points
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'parks',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            20,
            30,
            50,
            40,
            70,
          ],
        },
      });

      // Add a layer for the cluster count labels
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'parks',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      // Add a layer for unclustered points (individual parks)
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'parks',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      // Add popup on click for unclustered points
      map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { title } = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${title}</strong>`)
          .addTo(map);
      });

      // Change the cursor to a pointer when hovering over clusters
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change the cursor back to normal when it leaves a cluster
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

      // Zoom in when clicking on a cluster
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        (map.getSource('parks') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom,
            });
          }
        );
      });
    });

    return () => {
      map.remove(); // Clean up on unmount
    };
  }, [parks]);

  return <div className="map-container" ref={mapContainerRef} style={{ height: '500px' }} />;
};

export default ParkClusterMap;
