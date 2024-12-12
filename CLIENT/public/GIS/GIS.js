// Initialize the map
const map = L.map('map').setView([23.2599, 77.4126], 5);

// Base Layers
const satellite = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Esri",
        name: "Satellite"
    }
);
const hybridLabels = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Esri",
        name: "Hybrid Labels"
    }
);

const streetMap = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap",
        name: "Street Map"
    }
);

const cartoDBDarkMatter = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }
);

const esriNatGeo = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    }
);

const openTopoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
        maxZoom: 17
    }
);

// Combine Satellite and Hybrid Labels into a Layer Group
const satelliteWithLabels = L.layerGroup([satellite, hybridLabels]);

// Add Satellite with Labels as the default layer
satelliteWithLabels.addTo(map);

// Layer control
const baseLayers = {
    "Satellite with Labels": satelliteWithLabels,
    "Street Map": streetMap,
    "cartoDBDarkMatter": cartoDBDarkMatter,
    "esriNatGeo": esriNatGeo,
    "openTopoMap": openTopoMap,
};
const overlays = {
    "Hybrid Labels (Toggle)": hybridLabels,
};

L.control.layers(baseLayers, overlays).addTo(map);

// Legend for mine types
const mineColors = {
    "Underground (UG)": "red",
    "Opencast (OC)": "blue",
    "Mixed": "purple"
};

const legend = L.control({
    position: 'bottomright'
});
legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    div.style.background = "rgba(255, 255, 255, 0.9)";
    div.style.padding = "10px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
    div.style.fontFamily = "Arial, sans-serif";
    div.style.fontSize = "14px";
    div.style.lineHeight = "1.6em";
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

// Custom Icons
const mineIcons = {
    "UG": L.icon({
        iconUrl: './assets/images/UNDERGROUND.png',
        iconSize: [25, 25]
    }),
    "OC": L.icon({
        iconUrl: './assets/images/OPENCAST.png',
        iconSize: [25, 25]
    }),
    "Mixed": L.icon({
        iconUrl: './assets/images/MIXED.png',
        iconSize: [25, 25]
    }),
};

// Mock Emission Data and Calculations
const emissionFactor = 2.86;
const co2AbsorptionPerHectare = 5;

// Mock Data for Carbon Sinks and Coal Reserves
const carbonSinks = { /* ... your carbon sink data ... */ };
const coalReserves = { /* ... your coal reserve data ... */ };

// Calculations for Emission Gap and Afforestation Needs
const emissionGap = {};
const afforestationNeeds = {};

mines.forEach(mine => {
    const mineName = mine['Mine Name'];
    const emissions = (coalReserves[mineName] || 0) * emissionFactor;
    const sinkCapacity = carbonSinks[mineName] || 0;
    emissionGap[mineName] = emissions - sinkCapacity;
    afforestationNeeds[mineName] = emissionGap[mineName] > 0 ? emissionGap[mineName] / co2AbsorptionPerHectare : 0;
});

// Add Marker Cluster Group
const markers = L.markerClusterGroup();
const markerMap = new Map();

// Populate dropdown and markers
const dropdown = document.getElementById('mine-dropdown');
mines.forEach((mine) => {
    const mineName = mine['Mine Name'];
    const emissions = emissionGap[mineName]?.toFixed(2) || 0;
    const afforestation = afforestationNeeds[mineName]?.toFixed(2) || 0;

    // Add Marker for Each Mine
    const marker = L.marker([mine.Latitude, mine.Longitude], {
        icon: mineIcons[mine.TypeofMine],
    }).bindPopup(`
        <b>${mineName}</b><br>
        Type: ${mine.TypeofMine}<br>
        Emission Gap: ${emissions} tons CO2<br>
        Afforestation Needed: ${afforestation} hectares
    `);

    // Add click handler for all mines
    markers.eachLayer(function (marker) {
        const mineName = marker.getPopup().getContent().match(/<b>(.*?)<\/b>/)[1]; // Extract the mine name

        marker.on('popupopen', function () {
            const popupElement = document.querySelector('.leaflet-popup-content');
            if (popupElement) {
                popupElement.style.cursor = 'pointer'; // Indicate clickable content
                
                popupElement.onclick = function () {
                    // Redirect to a dynamically generated page based on the mine name
                    const formattedMineName = mineName.replace(/\s+/g, '_').toLowerCase(); // Format name for URL
                    window.location.href = `./minesDetails/${formattedMineName}_details.html`;
                };
            }
        });
    });

    
    

    markers.addLayer(marker);
    markerMap.set(`${mine.Latitude},${mine.Longitude}`, marker);

    // Populate Dropdown
    const option = document.createElement('option');
    option.value = `${mine.Latitude},${mine.Longitude}`;
    option.textContent = `${mineName}`;
    dropdown.appendChild(option);
});

map.addLayer(markers);

// Zoom and Open Popup on Dropdown Selection
dropdown.addEventListener('change', function () {
    const [lat, lng] = this.value.split(',').map(Number);
    const selectedMarker = markerMap.get(this.value);
    if (selectedMarker) {
        map.setView([lat, lng], 15);
        selectedMarker.openPopup();
    }
});

// Zoom Threshold Popup Display
const zoomThreshold = 5;
map.on('zoomend', function () {
    if (map.getZoom() >= zoomThreshold) {
        const mapCenter = map.getCenter();
        let nearestMarker = null;
        let smallestDistance = Infinity;

        markers.eachLayer(function (marker) {
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
