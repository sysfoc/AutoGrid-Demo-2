"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const DistanceContext = createContext();

export const useDistance = () => {
  const context = useContext(DistanceContext);
  if (!context) {
    throw new Error('useDistance must be used within a DistanceProvider');
  }
  return context;
};

export const DistanceProvider = ({ children }) => {
  const [distance, setDistance] = useState('km');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistance();
    
    // Listen for distance updates
    const handleDistanceUpdate = () => {
      fetchDistance();
    };
    
    window.addEventListener('distance-updated', handleDistanceUpdate);
    
    return () => {
      window.removeEventListener('distance-updated', handleDistanceUpdate);
    };
  }, []);

  const fetchDistance = async () => {
    try {
      const response = await fetch('/api/default-settings');
      if (response.ok) {
        const data = await response.json();
        setDistance(data.distance || 'km');
      }
    } catch (error) {
      console.error('Error fetching distance setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDistance = () => {
    fetchDistance();
  };

  return (
    <DistanceContext.Provider value={{ distance, loading, refreshDistance }}>
      {children}
    </DistanceContext.Provider>
  );
};