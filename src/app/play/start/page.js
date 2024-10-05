// src/app/play/select-country/page.js
'use client';
import { useMemo } from "react";
import dynamic from "next/dynamic";

export default function MyPage() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/maps/playmap'), // Import the Map component dynamically
    { 
      loading: () => <p>A map is loading...</p>, // Loading message while the map is loading
      ssr: false // Prevent server-side rendering for this component
    }
  ), []);

  return (
    <div>
      <Map /> {/* Render the Map component */}
    </div>
  );
}
