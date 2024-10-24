import React from 'react';

interface ParkFormProps {
    title: string;
    setTitle: (value: string) => void;
    price: number;
    setPrice: (value: number) => void;
    description: string;
    setDescription: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    images: File[]; // Adjust if necessary
    setImages: (files: File[]) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const ParkForm: React.FC<ParkFormProps> = ({ 
    title, setTitle, 
    price, setPrice, 
    description, setDescription, 
    location, setLocation, 
    images, setImages, 
    handleSubmit 
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files)); // Convert FileList to an array of File objects
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Create Park</h1>

            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <input 
                    type="number" 
                    placeholder="Price" 
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <input 
                    type="text" 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <input 
                    type="text" 
                    placeholder="Location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
                Save Changes
            </button>
        </form>
    );
};

export default ParkForm;
