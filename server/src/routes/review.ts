// @ts-nocheck
import express from 'express';
import Park from '../models/Park'; // Assuming the Park model is in a models folder
import Review from '../models/Review';
import verifyToken from '../middleware/verifyToken'; // Import the middleware


const router = express.Router();

// POST route to create a new review
router.post('/api/reviews', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id,rating,body} = req.body; 
        const park = await Park.findById(id);
        // Create a new park instance with the user ID as the author
        const review = new Review({
            body,
            rating,
            author: req.user.id,  // Set the author to the logged-in user's ID
        });
        park.reviews.push(review);
        await review.save();
        const savedPark = await park.save();
        console.log(savedPark);
        res.status(201).json(savedPark);
    } catch (error) {
        console.error('Error creating park:', error);
        res.status(500).json({ message: 'Failed to create park' });
    }
});

router.delete('/api/reviews/:reviewId', verifyToken, async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { parkId } = req.query;
        console.log(reviewId);
        console.log(parkId);
        await Park.findByIdAndUpdate(parkId, {$pull : {reviews : reviewId}})
        await Review.findByIdAndDelete(reviewId);
        console.log("done");
        res.status(201);
    } catch (error) {
        console.error('Error deleting park:', error);
        res.status(500).json({ message: 'Failed to delete park' });
    }
});
export default router;
