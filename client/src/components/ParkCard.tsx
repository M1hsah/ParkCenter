import { useNavigate } from 'react-router-dom';

interface Park {
    _id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    images: { url: string; filename: string }[];
}

const Card: React.FC<Park> = ({ _id, title, images, description, location,price }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleViewClick = () => {
        navigate(`/parks/${_id}`); // Navigate to the park details page with the park's id
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className='w-full h-[200px]'>
                {images.length > 0 && (
                    <img 
                        src={images[0].url} 
                        alt={title} 
                        className="w-[400px] h-[200px] " // Set fixed width and height
                    />
                )}
            </div>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-gray-700 text-base">${price}</p>
                <p className="text-gray-700 text-base">{location}</p>
                <p className="text-gray-700 text-base">{description}</p>
            </div>
            <div className="px-6 py-4">
                <button
                    onClick={handleViewClick} // Handle the click event
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    View
                </button>
            </div>
        </div>
    );
};

export default Card;
