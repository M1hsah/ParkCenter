import React, { useState } from 'react';
import axios from 'axios';
import { TextareaAutosize } from '@mui/base';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface Review {
  _id: string;
  body: string;
  rating: number;
  author: { _id: string };  // Reference to the User who authored the review
}
interface ReviewBoxProps {
  id: string;
  reviews: Review[]; // Array of Review objects
  authorId: string;
}

const ReviewBox: React.FC<ReviewBoxProps> = ({ id,reviews,authorId}) => {
    const [body, setBody] = useState('');
    const [rating, setRating] = useState<number | null>(2.5); // Default rating set to 2.5
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const data = {
        id,     
        body,
        rating: rating ? rating.toString() : '1',
      };
    
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.post('http://localhost:5000/api/reviews', data, {
          headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          },
        });
        console.log('Review submitted:', response.data);
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    };
    const handleDeleteReview = async (reviewId: string) => {
      try {
        const token = localStorage.getItem('token');
        console.log(reviewId);
        await axios.delete(`http://localhost:5000/api/reviews/${reviewId}?parkId=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        // Update the reviews list after deletion, either by re-fetching or updating the state
        //setReviews(reviews.filter((review) => review._id !== reviewId));
        console.log('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    };

  return (
    <div className='grid grid-cols-3 grid-rows-flow pt-3'>
      <h1 className='col-span-3 font-bold text-xl pb-2 text-center'>Park Reviews</h1>
      <div className='col-span-3 h-80 overflow-y-auto p-3 border rounded-md shadow-md'>
        <Stack spacing={2}>
        {reviews.map((x, index) => (
          <div key={index} className='p-2 border-b flex justify-between items-center'>
            <div>
              <p className="text-sm">{x.body}</p>
              <Rating value={x.rating} readOnly size="small" precision={0.5} />
            </div>

            {x.author._id === authorId && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => handleDeleteReview(x._id)}
                className="ml-4"
              >
                Delete
              </Button>
            )}
          </div>
        ))}
        </Stack>
      </div>

      <form onSubmit={handleSubmit} className="col-span-3 mt-5">
        <Stack className='col-span-3' spacing={2}>
          <Rating
            size="large"
            precision={0.5}
            value={rating} // Bind to state
            onChange={(e, newValue) => {
              setRating(newValue); // Update rating state when changed
            }}
          />

          <TextareaAutosize
            className="w-full text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md"
            placeholder="Leave a Review"
            value={body} // Bind to state
            onChange={(e) => setBody(e.target.value)} // Update body state when typed
          />

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </div>

  );
};

export default ReviewBox;
