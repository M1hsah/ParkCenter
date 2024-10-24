import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stack } from '@mui/material';

interface Park {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: { url: string; filename: string }[];
    isOwner: boolean;
}

const ViewParkCard: React.FC<Park> = ({ _id, title, images, description, location, price,isOwner }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleDelete = async() => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            await axios.delete(`http://localhost:5000/api/parks/${_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
                },
            });
            navigate('/parks');
        } catch (error) {
            console.error('Error fetching park:', error);
        }
    };

    // Create the `park` object using the passed props
    const park = {
        _id,
        title,
        images,
        description,
        location,
        price,
    };

    return (
        <div className="max-w-3xl rounded overflow-hidden shadow-lg bg-white">
            <div className="w-full h-[400px]">
                {images.length > 0 && (
                    <img 
                        src={images[0].url} 
                        alt={title} 
                        className="w-[750px] h-[400px] object-cover" // Set fixed width and height
                    />
                )}
            </div>
            <div className="px-6 py-4">
                <Stack gap={1}>
                    <h2 className="font-bold text-xl mb-2">{title}</h2>
                    <div className="text-gray-700 text-base h-40 overflow-y-auto overflow-x-hidden break-words">
                        {description}
                    </div>
                </Stack>
                
                <div className="text-gray-700 text-base border-b">
                    <span className="block mb-2">${price}</span>
                </div>
                <div className="text-gray-700 text-base border-b">
                    <span className="block mb-2">{location}</span>
                </div>
                
            </div>

            <div className="px-6 py-4">
                {isOwner && (
                <Link
                    to={`/parks/${_id}/edit`}
                    state={{ park }} // Pass the park data via state
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Edit
                </Link>
                )}
                <button
                    onClick={handleDelete} // Handle the click event
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 mx-2 px-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>

    );
};

export default ViewParkCard;
