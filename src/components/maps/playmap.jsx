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

export default function CustomMap({ mapData, generatedIssue, handleSubmitIssue, generatedNews }) {
  const [position, setPosition] = useState(countryCoordinates['usa']); // Default to USA coordinates
  const [zoom, setZoom] = useState(5); // Set an appropriate zoom level
  const [selectedCountry, setSelectedCountry] = useState('USA'); // Default country text

  //functionality
  const [isAddressing, setIsAddressing] = useState(false);
  const [AddressingIssues, setAddressingIssues] = useState(null)
  const [isReading, setIsReading] = useState(false);
  const [news, setNews] = useState(null);

    const handleIsReading = (index) => {
        setNews(index)
        setIsReading(!isReading);
    }

    const handleIsAddressing = (index) => {
        setAddressingIssues(index)
        setIsAddressing(!isAddressing);
    }

    const handleSubmitAdress = (issueIndex, solutionIndex) => {
        console.log('Issue Index:', issueIndex, 'Solution Index:', solutionIndex)

        const submit = handleSubmitIssue(generatedIssue[issueIndex], generatedIssue[AddressingIssues].debate_solution[solutionIndex])
        if(submit) {
            setIsAddressing(false);
            window.location.reload(); 
        }

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
                            {generatedIssue ? (
                                generatedIssue.map((issue, index) => (
                                    <div className="flex justify-between" key={index}>
                                        <h4>{issue.issue}</h4>
                                        <Button onClick={() => handleIsAddressing(index)}>Address</Button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center">
                                    <svg className="animate-bounce h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="text-gray-200" cx="12" cy="12" r="10" strokeWidth="4" fill="none" />
                                        <path className="text-blue-500" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z" />
                                    </svg>
                                    <span>Collecting people aspirations...</span>
                                </div>
                            )}

                          
                        </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', zIndex: 1, top: 330, right: 30, width: '350px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div >
                        <div className="flex flex-col gap-4 text-lg">
                            <h3><strong>USA News:</strong></h3>

                            {generatedNews ? (
                                generatedNews.map((news, index) => (
                                    <div className="flex justify-between items-end gap-3" key={index}>
                                        <div>
                                            <span className="text-sm text-slate-700">{news.news_outlet}</span>
                                            <h4 className="text-sm">{news.news_headline}</h4>
                                        </div>
                                        <Button onClick={() => handleIsReading(index)}>Read</Button>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center">
                                    <svg className="animate-bounce h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="text-gray-200" cx="12" cy="12" r="10" strokeWidth="4" fill="none" />
                                        <path className="text-blue-500" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z" />
                                    </svg>
                                    <span>Going to the news stand real quick...</span>
                                </div>
                            )}

                            
                        </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', zIndex: 1, top: 110, right: 30, width: '350px', backgroundColor: 'white', borderRadius: '8px', padding: '19px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div >
                        <div className="flex flex-col gap-4 text-lg">
                            <h3><strong>Multiplayer Leaderboard:</strong></h3>

                            <div className="flex justify-between items-center">
                                <h4>🇺🇸 USA</h4>
                                <h5 className="text-sm">GDP: $1.2M | Crb. Emis.: 23</h5>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4>🇬🇧 UK</h4>
                                <h5 className="text-sm">GDP: $1.2M | Crb. Emis.: 23</h5>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4>🇨🇦 Canada</h4>
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
                        <h2>{ generatedIssue && generatedIssue[AddressingIssues].issue }</h2>
                        <p className="text-sm">{ generatedIssue && generatedIssue[AddressingIssues].issue_story }</p>

                        <h2 className="text-sm mt-8">The Debate</h2>
                        {generatedIssue ? (
                            generatedIssue[AddressingIssues].debate_solution.map((debate, index) => (
                                <div className="flex justify-between items-center gap-4" key={debate.id || index}>
                                    <h4 className="text-sm">{debate.solution}</h4>
                                    <Button onClick={() => handleSubmitAdress(AddressingIssues, index)}>Approve</Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center">
                                <svg className="animate-bounce h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="text-gray-200" cx="12" cy="12" r="10" strokeWidth="4" fill="none" />
                                    <path className="text-blue-500" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z" />
                                </svg>
                                <span>Discussing with the government bodies...</span>
                            </div>
                        )}

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
                        <h2 className="text-center text-sm">{ generatedNews[news].news_outlet }</h2>
                        <h2 className="text-center text-md">{ generatedNews[news].news_headline }</h2>
                        <p className="text-sm">{generatedNews[news].news_story}</p>

                        <h2 className="text-sm mt-8">Effect Modifier</h2>
                        <p className="text-sm">Public Sentiment: {generatedNews[news].public_opinion[0].sentiment}</p>
                        <p className="text-sm">Public Modifier:</p>
                        {generatedNews[news].public_opinion[0].modifier_to_country.map((modifier, index) => (
                            <div className="flex justify-start gap-5 items-center" key={index}>
                                <p className="text-sm">{modifier.protocol_item}</p>
                                <p className="text-sm">{modifier.value_affected}</p>
                            </div>
                        ))}
                     

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
