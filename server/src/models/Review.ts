import mongoose, { Schema, Document } from 'mongoose';

// Define the interface representing a document in MongoDB
interface IReview extends Document {
    body: string;
    rating: number;
    author: mongoose.Types.ObjectId; // Reference to the 'User' model
}

// Create the schema for the Review
const reviewSchema = new Schema<IReview>({
    body: { type: String, required: true },
    rating: { type: Number, required: true },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Export the model with the IReview interface
export default mongoose.model<IReview>('Review', reviewSchema);
