'use client';
import { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Button } from "../ui/button";

// Country coordinates mapping with a slight shift to the right (longitude offset)
const longitudeOffset = 2.0; // Offset value to shift the map slightly to the right
const countryCoordinates = {
  usa: [37.0902, -95.7129 + longitudeOffset], // USA with longitude shifted right
  uk: [51.5074, -0.1278 + longitudeOffset],   // UK (London) with longitude shifted right
  canada: [56.1304, -106.3468 + longitudeOffset] // Canada with longitude shifted right
};

const ChangeView = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom); // Update map view to the new position and zoom
  }, [position, zoom, map]);

  return null;
};

export default function CustomMap({ mapData }) {
  const [position, setPosition] = useState(countryCoordinates['usa']); // Default to USA coordinates
  const [zoom, setZoom] = useState(5); // Set an appropriate zoom level
  const [selectedCountry, setSelectedCountry] = useState('USA'); // Default country text

  //functionality
  const [isAddressing, setIsAddressing] = useState(false);
  const [isReading, setIsReading] = useState(false);

    const handleIsReading = () => {
        setIsReading(!isReading);
    }

    const handleIsAddressing = () => {
        setIsAddressing(!isAddressing);
    }

    const handleApprove = () => {
        setIsAddressing(false);
    }

    const handleNews = () => {
        setIsReading(false);
    }

  // Function to handle country selection
  const handleCountryChange = (e) => {
    const selectedCountryKey = e.target.value;
    setPosition(countryCoordinates[selectedCountryKey]); // Set position based on the selected country
    setSelectedCountry(selectedCountryKey.toUpperCase()); // Update the displayed country name
    setZoom(5); // Adjust the zoom level if needed
  };

  // Function to increase zoom level
  const increaseZoom = () => {
    setZoom(prevZoom => Math.min(prevZoom + 1, 18)); // Cap the zoom at a max value of 18
  };

  // Function to decrease zoom level
  const decreaseZoom = () => {
    setZoom(prevZoom => Math.max(prevZoom - 1, 1)); // Cap the zoom at a minimum value of 1
  };

  // Make zoom buttons draggable
  const zoomControlsRef = useRef(null);

  useEffect(() => {
    const zoomControls = zoomControlsRef.current;
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = zoomControls.offsetLeft;
      initialTop = zoomControls.offsetTop;
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        zoomControls.style.left = `${initialLeft + dx}px`;
        zoomControls.style.top = `${initialTop + dy}px`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners
    zoomControls.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Cleanup event listeners
    return () => {
      zoomControls.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: -1 }}
        zoomControl={false} // Disable default Leaflet zoom controls
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

        {
            (isAddressing == false && isReading == false) && (
                <>
                    {/* Card Container */}
                    <div style={{ position: 'absolute', zIndex: 1, top: 20, left: 20, width: '250px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div>
                        <div className="flex gap-4 text-3xl">
                                    {/* Country flag */}
                            {mapData && mapData.countryFlag}

                            {/* Country name */}
                            <h2>{mapData && mapData.countryName}</h2>
                        </div>
                        </div>
                    </div>

                    <div className="flex justify-between" style={{ position: 'absolute', zIndex: 1, top: 20, left: 290, width: '81vw', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div className="flex gap-4">
                            <div className="flex gap-3">
                                <h3>GDP</h3>
                                <h3>${mapData && mapData.gdpValue}</h3>
                            </div>
                            <div className="flex gap-3">
                                <h3>GDP Growth</h3>
                                <h3>{mapData && mapData.gdpGrowth}%</h3>
                            </div>
                            <div className="flex gap-3">
                                <h3>Carbon Emission</h3>
                                <h3>{mapData && mapData.carbonEmission}%</h3>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-3">
                                <h3>Current Date</h3>
                                <h3>{mapData && mapData.currentYear}.{mapData && mapData.currentMonth}</h3>
                            </div>
                        </div>

                    </div>

                    <div style={{ position: 'absolute', zIndex: 1, top: 110, left: 20, width: '350px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div >
                        <div className="flex flex-col gap-4 text-lg">
                            <h3><strong>Current Nation Issues:</strong></h3>

                            <div className="flex justify-between">
                                <h4>Climate Change</h4>
                                <Button onClick={handleIsAddressing}>Adress</Button>
                            </div>
                            <div className="flex justify-between">
                                <h4>Climate Change</h4>
                                <Button>Adress</Button>
                            </div>
                            <div className="flex justify-between">
                                <h4>Climate Change</h4>
                                <Button>Adress</Button>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', zIndex: 1, top: 350, left: 20, width: '350px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div >
                        <div className="flex flex-col gap-4 text-lg">
                            <h3><strong>USA News:</strong></h3>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-sm text-slate-700">American Headlines</span>
                                    <h4 className="text-md">Climate Change</h4>
                                </div>
                                <Button onClick={handleIsReading}>Read</Button>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-sm text-slate-700">American Headlines</span>
                                    <h4 className="text-md">Climate Change</h4>
                                </div>
                                <Button>Read</Button>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-sm text-slate-700">American Headlines</span>
                                    <h4 className="text-md">Climate Change</h4>
                                </div>
                                <Button>Read</Button>
                            </div>
                            
                        </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', zIndex: 1, top: 110, right: 30, width: '350px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div >
                        <div className="flex flex-col gap-4 text-lg">
                            <h3><strong>Multiplayer Leaderboard:</strong></h3>

                            <div className="flex justify-between items-center">
                                <h4>USA</h4>
                                <h5 className="text-sm">GDP: $1.2M | Crb. Emis.: 23</h5>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4>USA</h4>
                                <h5 className="text-sm">GDP: $1.2M | Crb. Emis.: 23</h5>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4>USA</h4>
                                <h5 className="text-sm">GDP: $1.2M | Crb. Emis.: 23</h5>
                            </div>
                
                        </div>
                        </div>
                    </div>
                </>
            )
        }

        {
            isAddressing && (
                <div style={{ position: 'absolute', zIndex: 1, top: 140, left: 400, width: '950px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <div>
                    <div className="flex flex-col gap-4 text-3xl p-4">
                                {/* Country flag */}
                        <h2>Judul Adress</h2>
                        <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla ipsa cum enim autem. Dolorem, rem nisi deleniti sint provident commodi earum tempora ipsa. Rerum aperiam neque blanditiis libero autem exercitationem.</p>

                        <h2 className="text-sm mt-8">The Debate</h2>
                        <div className="flex flex-col justify-between items-end">
                            <div>
                                <h4 className="text-md text-slate-700">American Headlines</h4>
                                <p className="mt-1 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque excepturi sint quam ratione optio vero ut hic quas, magni numquam dolores rerum, voluptatum tenetur perspiciatis in qui non vel soluta.</p>
                            </div>
                            <Button className="mt-3" onClick={handleApprove}>Approve</Button>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            <div>
                                <h4 className="text-md text-slate-700">American Headlines</h4>
                                <p className="mt-1 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque excepturi sint quam ratione optio vero ut hic quas, magni numquam dolores rerum, voluptatum tenetur perspiciatis in qui non vel soluta.</p>
                            </div>
                            <Button className="mt-3">Approve</Button>
                        </div>
                    </div>
                    </div>
                </div>
                
            )
        }

        {
            isReading && (
                <div style={{ position: 'absolute', zIndex: 1, top: 140, left: 400, width: '950px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <div>
                    <div className="flex flex-col gap-4 text-3xl p-4">
                                {/* Country flag */}
                        <h2 className="text-center">Judul Adress</h2>
                        <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla ipsa cum enim autem. Dolorem, rem nisi deleniti sint provident commodi earum tempora ipsa. Rerum aperiam neque blanditiis libero autem exercitationem.</p>

                        <h2 className="text-sm mt-8">Effect Modifier</h2>
                   
                     

                        <div className="flex flex-col justify-between items-end">
                            <Button className="mt-3" onClick={handleNews}>Close</Button>
                        </div>
                        
                    </div>
                    </div>
                </div>
                
            )
        }
      


      {/* Draggable Floating Zoom Buttons */}
      <div 
        ref={zoomControlsRef} 
        style={{ 
          position: 'absolute', 
          zIndex: 1, 
          bottom: 20, 
          right: 20, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          cursor: 'move' 
        }}
      >
        <button 
          onClick={increaseZoom} 
          style={{
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          +
        </button>
        <button 
          onClick={decreaseZoom} 
          style={{
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          -
        </button>
      </div>
    </div>
  );
}
