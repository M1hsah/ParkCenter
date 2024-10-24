import React, { useState } from 'react';
import axios from 'axios';
import ParkForm from '../components/ParkForm';
import { useNavigate } from 'react-router-dom';

const CreateParkPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [images, setImages] = useState<File[]>([]); // Store uploaded images as File objects
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(); // Using FormData for file uploads
        formData.append('title', title);
        formData.append('price', price.toString());
        formData.append('description', description);
        formData.append('location', location);

        // Append all selected image files
        images.forEach((image) => {
            formData.append('image', image); // Change key from images[] to image
        });

        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await axios.post('http://localhost:5000/api/parks', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header

                },
            });
            console.log('Park created:', response.data);
            navigate('/parks');
        } catch (error) {
            console.error('Error creating park:', error);
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
            location={location} 
            setLocation={setLocation} 
            images={images} 
            setImages={setImages} 
            handleSubmit={handleSubmit} 
        />
    );
};

export default CreateParkPage;
