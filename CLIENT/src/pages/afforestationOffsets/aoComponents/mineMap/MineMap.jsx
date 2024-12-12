import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import openCastIcon from "../../../../assets/images/OPENCAST.png";
import undergroundIcon from "../../../../assets/images/UNDERGROUND.png";
import mixedIcon from "../../../../assets/images/MIXED.png";
import MineDetails from '../Details/MineDetails'; // Import the new component
import './MineMap.css';
import mines from './minesData'; 

const MineMap = () => {
  const [selectedMine, setSelectedMine] = useState('');
  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null); // Reference to the map
  const markerMapRef = React.useRef(new Map());
  const markersRef = React.useRef(null);

  const mineIcons = {
    UG: L.icon({ iconUrl: undergroundIcon, iconSize: [25, 25] }),
    OC: L.icon({ iconUrl: openCastIcon, iconSize: [25, 25] }),
    Mixed: L.icon({ iconUrl: mixedIcon, iconSize: [25, 25] }),
  };

  const addLegend = (map) => {
    const mineColors = {
      "Underground (UG)": "red",
      "Opencast (OC)": "blue",
      "Mixed": "purple",
    };

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.style.background = "rgba(255, 255, 255, 0.9)";
      div.style.padding = "10px";
      div.style.borderRadius = "8px";
      div.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
      div.style.fontFamily = "Arial, sans-serif";
      div.style.fontSize = "14px";
      div.style.color = "#333";

      div.innerHTML = `<h4 style="margin: 0; font-size: 16px; text-align: center; color: #ff9900;">Mine Types</h4>`;
            for (const [type, color] of Object.entries(mineColors)) {
                div.innerHTML += `
                    <div style="display: flex; align-items: center; margin-top: 8px;">
                        <span style="background:${color}; width:16px; height:16px; display:inline-block; margin-right:8px; border-radius:3px;"></span>
                        <span style="color: #000;">${type}</span>
                    </div>`;
            }
            return div;
    };

    legend.addTo(map);
  };

  useEffect(() => {
    const map = L.map(mapContainerRef.current, {
      center: [23.2599, 77.4126],
      zoom: 5,
    });

    mapRef.current = map; // Store map reference

    // Define base layers
    const streetMap = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "OpenStreetMap" }
    );

    const satellite = L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri" }
    );

    const satelliteWithLabels = L.layerGroup([
      satellite,
      L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri" }
      ),
    ]);

    // Add default layer
    satelliteWithLabels.addTo(map);

    const baseLayers = {
      "Satellite with Labels": satelliteWithLabels,
      "Street Map": streetMap,
    };

    // Add layer control
    L.control.layers(baseLayers).addTo(map);

    // Marker cluster group
    markersRef.current = L.markerClusterGroup();

    // Add markers and populate dropdown
    const dropdown = document.getElementById('mine-dropdown');
    mines.forEach((mine) => {
      const option = document.createElement('option');
      option.value = `${mine.Latitude},${mine.Longitude}`;
      option.textContent = `${mine["Mine Name"]} (${mine.Latitude}, ${mine.Longitude})`;
      dropdown.appendChild(option);

      const marker = L.marker([mine.Latitude, mine.Longitude], {
        icon: mineIcons[mine.TypeofMine],
      }).bindPopup(`<b>${mine["Mine Name"]}</b><br>Type: ${mine.TypeofMine}`);
      
      markersRef.current.addLayer(marker);
      markerMapRef.current.set(`${mine.Latitude},${mine.Longitude}`, marker);

      marker.on('click', () => {
        setSelectedMine(mine); // Set the selected mine when marker is clicked
        map.setView([mine.Latitude, mine.Longitude], 10);
      });
    });

      


    map.addLayer(markersRef.current);
    addLegend(map);

    // Automatically open nearest popup when zoomed in
    const zoomThreshold = 10; // Adjust as needed
    map.on('zoomend', function () {
      if (map.getZoom() >= zoomThreshold) {
        const mapCenter = map.getCenter();
        let nearestMarker = null;
        let smallestDistance = Infinity;

        markersRef.current.eachLayer((marker) => {
          const distance = mapCenter.distanceTo(marker.getLatLng());
          if (distance < smallestDistance) {
            smallestDistance = distance;
            nearestMarker = marker;
          }
        });

        if (nearestMarker) {
          nearestMarker.openPopup();
        }
      }
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedMine && markerMapRef.current.has(selectedMine)) {
      const [lat, lng] = selectedMine.split(',').map(Number);
      const map = mapRef.current; // Use stored map reference
      if (map) {
        map.setView([lat, lng], 15);
        markerMapRef.current.get(selectedMine).openPopup();
      }
    }
  }, [selectedMine]);

  return (
    <div className="map-container">
      {/* Dropdown */}
      <div id="controls">
        <select
          id="mine-dropdown"
          className="mine-map-select"
          onChange={(e) => setSelectedMine(e.target.value)}
        >
          <option value="">Select a Mine</option>
        </select>
      </div>

      {/* Map container */}
      {/* Map container */}
      <div
        id="map"
        ref={mapContainerRef}
      ></div>
       {/* Mine Details Component */}
       {selectedMine && (
        <MineDetails mine={selectedMine} />
      )}
    </div>
  );
};

export default MineMap;