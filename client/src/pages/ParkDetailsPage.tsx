import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ViewParkCard from '../components/ViewPardCard';
import { useAuth } from '../context/AuthContext';
import ReviewBox from '../components/ReviewBox';
import ParkMap from '../components/ParkMap';

interface Review {
    _id: string;
    body: string;
    rating: number;
    author: { _id: string };  // Reference to the User who authored the review
}

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
    author: { _id: string }; // Author object with _id
    reviews: Review[]; // Array of Review objects
}

const ParkDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract the park ID from the URL params
    const [park, setPark] = useState<Park | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Get the current logged-in user
    var userid ="";
    if(user){
        userid = user.id
    }
    useEffect(() => {
        const fetchPark = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/parks/${id}`);
                setPark(response.data);
                // Check ownership
                if (response.data.author._id === user?.id) {
                    setIsOwner(true); // Set ownership if logged-in user is the author
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching park:', error);
                setError('Failed to fetch park details');
                setLoading(false);
            }
        };

        fetchPark();
    }, [id, user]);

    if (loading) {
        return <p>Loading park details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!park) {
        return <p>Park not found.</p>;
    }

    return (
        <div className='container mx-auto p-5'>
            <div className='grid grid-cols-2 grid-rows-2 gap-4'>
                <div className="row-span-2">
                    <ViewParkCard
                        key={park._id}
                        _id={park._id}
                        title={park.title}
                        price={park.price}
                        location={park.location}
                        description={park.description}
                        images={park.images}
                        isOwner={isOwner}
                    />
                </div>

                <div className="row-span-2">
                    <ParkMap park={park} />
                    <ReviewBox
                        id={park._id} 
                        reviews={park.reviews}
                        authorId={userid}
                    />
                </div>
            </div>
        </div>

    );
};

export default ParkDetailsPage;
