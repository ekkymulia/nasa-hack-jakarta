'use client';
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function SelectCountry() {
  const router = useRouter();
  const Map = useMemo(() => dynamic(
    () => import('@/components/maps/maps'), // Dynamically import the Map component
    { 
      loading: () => <p>A map is loading...</p>, // Loading message while the map is loading
      ssr: false // Prevent server-side rendering for this component
    }
  ), []);

  // Function to handle country selection and POST request
  const handleCountrySelect = async (country) => {
    const roomId = Cookies.get('roomId'); // Retrieve roomId from cookie
    const username = Cookies.get('username'); // Retrieve username from cookie

    try {
      const response = await fetch('/api/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryName: country, roomId, username }), // Send the selected country and cookies as the payload
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response for debugging
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      const data = await response.json();
      Cookies.set('countryId', data.countryId);
      Cookies.set('participantId', data.id);
      router.push("/play/start");
    } catch (error) {
      console.error('Error:', error); // Handle error here
    }
  };

  return (
    <div>
      <Map onCountrySelect={handleCountrySelect} /> {/* Pass the handler to the Map component */}
    </div>
  );
}
