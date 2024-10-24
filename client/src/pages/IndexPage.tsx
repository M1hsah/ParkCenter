// src/pages/IndexPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ParkCard';
import ParkClusterMap from '../components/ClusterMap';
interface Park {
    _id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    geometry: {
        coordinates: [number, number]; // [longitude, latitude]
      };
    images: { url: string; filename: string }[];
}
const IndexPage: React.FC = () => {
    const [parks, setParks] = useState<Park[]>([]); // Define state to hold parks data
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    useEffect(() => {
        const fetchParks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/parks');
                console.log("worked")
                setParks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching parks:', error);
                setError('Failed to fetch parks');
                setLoading(false);
            }
        };

        fetchParks();
    }, []);
    if (loading) {
        return <p>Loading parks...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    return (
        <>
            <div className='container mx-auto p-5'>
            <div className="w-full h-16 rounded overflow-hidden shadow-lg bg-gray-400 flex items-center mb-5">
                <h1 className="text-white ml-4">Welcome to Park Center</h1>
            </div>
            <ParkClusterMap parks={parks} />
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-44 pt-5 mx-auto">
                    {parks.length === 0 ? (
                        <p>No parks available.</p>
                    ) : (
                        parks.map((park) => (
                            <Card
                                key={park._id}
                                _id={park._id}
                                title={park.title}
                                price={park.price}
                                location={park.location}
                                description={park.description}
                                images={park.images}
                            />
                        ))
                    )}
                </div>
            </div>

            </div>
        </>
    );
};

export default IndexPage;
