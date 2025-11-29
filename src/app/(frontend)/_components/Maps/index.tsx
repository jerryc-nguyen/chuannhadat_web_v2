'use client';
import MapDesktop from './MapDesktop';
import MapMobile from './MapMobile';
import { useEffect, useState } from 'react';

interface MapPageProps {
  isMobile?: boolean;
}

export default function MapPage({ isMobile }: MapPageProps) {
  const [userAgent, setUserAgent] = useState<{ isMobile: boolean } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);

    const detectUserAgent = () => {
      if (isMobile !== undefined) {
        setUserAgent({ isMobile });
      } else {
        // Client-side mobile detection
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;

        setUserAgent({ isMobile: isMobileDevice });
      }
    };

    detectUserAgent();
  }, [isMobile]);

  // Show loading state while on server or detecting user agent
  if (!isClient || !userAgent) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-lg">Loading map...</div>
      </div>
    );
  }

  return userAgent.isMobile ? <MapMobile /> : <MapDesktop />;
}
