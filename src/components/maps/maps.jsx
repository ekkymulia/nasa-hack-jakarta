// src/components/maps/maps.js
'use client';
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Button } from "../ui/button";

const longitudeOffset = 0.0; // Offset value to shift the map slightly to the right
const countryCoordinates = {
  USA: [37.0902, -95.7129 + longitudeOffset], // USA with longitude shifted right
  UK: [51.5074, -0.1278 + longitudeOffset],   // UK (London) with longitude shifted right
  Canada: [56.1304, -106.3468 + longitudeOffset] // Canada with longitude shifted right
};

const ChangeView = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom); // Update map view to the new position and zoom
  }, [position, zoom, map]);

  return null;
};

export default function CustomMap({ onCountrySelect }) {
  const [position, setPosition] = useState(countryCoordinates['USA']); // Default to USA coordinates
  const [zoom, setZoom] = useState(5); // Set an appropriate zoom level
  const [selectedCountry, setSelectedCountry] = useState('USA'); // Default country text

  // Function to handle country selection
  const handleCountryChange = (e) => {
    const selectedCountryKey = e.target.value;
    setPosition(countryCoordinates[selectedCountryKey]); // Set position based on the selected country
    setSelectedCountry(selectedCountryKey.toUpperCase()); // Update the displayed country name
    setZoom(5); // Adjust the zoom level if needed
  };

  // Function to handle country selection confirmation
  const handleConfirm = () => {
    onCountrySelect(selectedCountry); // Call the parent's function with the selected country
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: -1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <ChangeView position={position} zoom={zoom} />
      </MapContainer>

      {/* Card Container */}
      <div style={{ position: 'absolute', zIndex: 1, top: 10, left: 10, width: '280px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <label htmlFor="country-select">Select a country:</label>
        
        {/* Full-width Select */}
        <select 
          id="country-select" 
          onChange={handleCountryChange} 
          style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>

        {/* Display selected country */}
        <p style={{ marginBottom: '10px' }}>Selected Country: {selectedCountry}</p>

        {/* Button */}
        <Button
          className="w-full py-4 text-sm shadow-2xl"
          onClick={handleConfirm} // Trigger the confirm function
        >
          Confirm to Play
        </Button>
      </div>
    </div>
  );
}
