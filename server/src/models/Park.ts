import mongoose, { Schema, Document } from 'mongoose';
import Review from './Review'; // Ensure you have the correct import for the Review model

// Interface for Image
interface IImage {
    url: string;
    filename: string;
}

// Interface for the Park document
interface IPark extends Document {
    title: string;
    images: IImage[];
    geometry: {
        type: 'Point';
        coordinates: number[];
    };
    price: number;
    description: string;
    location: string;
    author: mongoose.Types.ObjectId; // Adjust this if you have a User model
    reviews: mongoose.Types.ObjectId[]; // Array of Review references
}

const ImageSchema = new Schema<IImage>({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function (this: IImage) {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const ParkSchema = new Schema<IPark>(
    {
        title: { type: String, required: true },
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            }
        },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    },
    opts
);

ParkSchema.virtual('properties.popUpMarkup').get(function (this: IPark) {
    return `
    <strong><a href="/parks/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

ParkSchema.post('findOneAndDelete', async function (doc: IPark | null) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

export default mongoose.model<IPark>('Park', ParkSchema);
