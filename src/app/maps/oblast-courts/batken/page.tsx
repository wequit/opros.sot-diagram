'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/utils/AuthContext';
import BatkenMap from '../components/BatkenMap';
import { CourtData } from '../types';
import { getCookie } from '@/api/login';

export default function BatkenPage() {
  const [courtData, setCourtData] = useState<CourtData[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        const response = await fetch('https://opros.sot.kg/api/v1/courts/batken', {
          headers: {
            'Authorization': `Bearer ${getCookie('access_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch court data');
        }

        const data = await response.json();
        setCourtData(data.courts || []);
      } catch (error) {
        console.error('Error fetching court data:', error);
      }
    };

    if (user?.role === '2') {
      fetchCourtData();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Суды Баткенской области</h1>
      <BatkenMap
        selectedCourt={selectedCourt}
        courtData={courtData}
        onSelectCourt={setSelectedCourt}
      />
    </div>
  );
}