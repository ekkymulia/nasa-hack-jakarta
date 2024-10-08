// src/app/play/select-country/page.js
'use client';
import { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from 'js-cookie'; // Ensure you have js-cookie installed

export default function PlayPage() {
  const [data, setData] = useState(null);
  const [generatedIssue, setGeneratedIssue] = useState(null);
  const [generatedNews, setGeneratedNews] = useState(null);
  const Map = useMemo(() => dynamic(
    () => import('@/components/maps/playmap'), // Import the Map component dynamically
    { 
      loading: () => <p>A map is loading...</p>, // Loading message while the map is loading
      ssr: false // Prevent server-side rendering for this component
    }
  ), []);

  // Handler to make a POST request when the map is loaded
  const handleMapLoad = async () => {
    // Get countryId from cookies
    const countryId = Cookies.get('countryId'); // Replace 'countryId' with your actual cookie name
    console.log('Loaded countryId:', countryId);

    try {
      const response = await fetch('/api/country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryId }), // Send the countryId in the request body
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Cookies.set('countryName', data.countryName);
      setData(data); // Update the state with the response data
      console.log('Response data:', data);
    } catch (error) {
      console.error('Error while fetching country:', error);
    }
  };

  const handleGenerateIssue = async () => {
    // Get countryId from cookies
    const countryId = Cookies.get('countryId'); // Replace 'countryId' with your actual cookie name
    console.log('Loaded countryId:', countryId);
    const countryName = Cookies.get('countryName');
    try {
      const response = await fetch('/api/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryName: countryName, countryId: countryId }), // Send
      });

      const data = await response.json();
      setGeneratedIssue(data);
      console.log(data)

    } catch (error) {
      console.error('Error while fetching country:', error);
    }
  }

  const handleGenerateNews = async () => {
    // Get countryId from cookies
    const countryId = Cookies.get('countryId'); // Replace 'countryId' with your actual cookie name
    console.log('Loaded countryId:', countryId);
    const countryName = Cookies.get('countryName');
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryName: countryName, countryId: countryId }), // Send
      });

      const data = await response.json();
      setGeneratedNews(data);
      console.log(data)

    } catch (error) {
      console.error('Error while fetching country:', error);
    }
  }

  const handleSubmitIssue = async (issue, solution) => {
    // Get countryId from cookies
    const countryId = Cookies.get('countryId'); // Replace 'countryId' with your actual cookie name

    try {
      const response = await fetch('/api/issue/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue: issue, choosen_solution: solution, countryId: countryId }), // Send
      });

      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Error while fetching country:', error);
    }
  }

  // Use an effect to run the handler when the component mounts
  useEffect(() => {
    handleMapLoad();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    if(data !== null){
      handleGenerateIssue();
    }
  }, [data]);

  useEffect(() => {
    if(generatedIssue !== null){
      handleGenerateNews();
    }
  }, [generatedIssue]);

  return (
    <div>
      <Map onLoad={handleMapLoad} mapData={data} generatedIssue={generatedIssue} handleSubmitIssue={handleSubmitIssue} generatedNews={generatedNews} /> {/* Pass the handler to the Map component if needed */}
    </div>
  );
}
