import React, { useState } from 'react';
import axios from 'axios';
import ParkForm from '../components/ParkForm';
import { useNavigate, useLocation } from 'react-router-dom';

// Define the Park interface to properly type the park object
interface Park {
    _id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    images: { url: string; filename: string }[];
}

const EditParkPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    // Use type assertion to tell TypeScript that the location state contains a park object
    const park = location.state?.park as Park;
    
    // Set initial form states with park data if available
    const [title, setTitle] = useState(park?.title || '');
    const [price, setPrice] = useState(park?.price || 0);
    const [description, setDescription] = useState(park?.description || '');
    const [locationField, setLocationField] = useState(park?.location || ''); // Renamed location to avoid conflict with useLocation
    const [images, setImages] = useState<File[]>([]); // Handle new images to upload

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if form states are properly updated before submission
        console.log('Form values before submission:', { title, price, description, locationField, images });
    
        const formData = new FormData();
        formData.append('title', title); // Ensure this is the updated title
        formData.append('price', price.toString()); // Ensure this is the updated price
        formData.append('description', description); // Ensure this is the updated description
        formData.append('location', locationField); // Ensure this is the updated location
    
        // Append all selected image files
        images.forEach((image) => {
            formData.append('image', image);
        });
    
        try {
            const response = await axios.put(`http://localhost:5000/api/parks/${park._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Park updated:', response.data);
            navigate(`/parks/${park._id}`); // Navigate back to the park details page after update
        } catch (error) {
            console.error('Error updating park:', error);
        }
    };
    

    return (
        <ParkForm 
            title={title} 
            setTitle={setTitle} 
            price={price} 
            setPrice={setPrice} 
            description={description} 
            setDescription={setDescription} 
            location={locationField} // Pass renamed variable
            setLocation={setLocationField} 
            images={images} 
            setImages={setImages} 
            handleSubmit={handleSubmit} 
        />
    );
};

export default EditParkPage;
