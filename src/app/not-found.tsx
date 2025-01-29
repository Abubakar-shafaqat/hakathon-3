// pages/car-not-available.js
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CarNotAvailable() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect for the content after 300ms
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 animate-gradient"></div>

      {/* Content Wrapper */}
      <div className={`text-center space-y-6 relative z-10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-6xl font-extrabold text-white animate__animated animate__fadeInUp">
          The Car You Want Is Currently Unavailable
        </h1>
        <p className="text-xl text-gray-200 animate__animated animate__fadeInUp animate__delay-1s">
          Looks like this car is on another journey right now. But don’t worry, plenty of other vehicles are waiting for you!
        </p>
        <div className="mt-8">
        
        </div>

        <Link href="/">
          <button className="mt-8 px-8 py-3 bg-yellow-500 text-white text-lg font-medium rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:translate-x-4 animate__animated animate__slideInUp animate__delay-3s">
            Find Another Ride
          </button>
        </Link>
      </div>
    </div>
  );
}
