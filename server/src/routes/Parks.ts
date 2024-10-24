// src/routes/parks.ts
import express, { Request, Response } from 'express';
import Park from '../models/Park';
import multer from 'multer';
import verifyToken from '../middleware/verifyToken';
import isAuthor from '../middleware/isAuthor';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const {storage} = require('../cloudinary')
const upload = multer({storage})
const router = express.Router();

interface ParkImage {
    url: string;
    filename: string;
}


// GET route to fetch all parks
router.get('/api/parks', async (req: Request, res: Response) => {
    try {
        const parks = await Park.find({}); // Fetch all parks from the database
        res.json(parks);
    } catch (error) {
        console.error('Error fetching parks:', error);
        res.status(500).json({ message: 'Failed to fetch parks' });
    }
});

router.get('/api/parks/:id', async (req: Request, res: Response) => {
    try {
        const park = await Park.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author');
        if(!park){
            throw new Error('Listing does not exist');
        }
        res.json(park);
    } catch (error) {
        console.error('Error fetching park:', error);
        res.status(500).json({ message: 'Failed to fetch parks' });
    }
});
router.put('/api/parks/:id', upload.array('image'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newPark = await Park.findByIdAndUpdate(id, { ...req.body }, { new: true });
        
        if (!newPark) {
            throw new Error('Listing does not exist');
        }

        const geoData = await geocoder.forwardGeocode({
            query: newPark.location,
            limit:1
        }).send()
        // Handle image uploads
        const imageFiles = req.files as Express.Multer.File[]; // Cast to the correct type
        const parkImages: ParkImage[] = imageFiles.map(file => ({
            url: file.path,
            filename: file.filename,
        }));

        newPark.images.push(...parkImages); // Add new images to the park
        newPark.geometry = geoData.body.features[0].geometry;
        await newPark.save(); // Save the updated park with the new images

        res.status(201).json(newPark); // Respond with the updated park
    } catch (error) {
        console.error('Error updating park:', error);
        res.status(500).json({ message: 'Failed to update park' });
    }
});


// POST route to create a new park
// @ts-ignore
router.post('/api/parks', verifyToken, upload.array('image'), async (req: Request, res: Response) => {
    try {
        const { title, price, description, location } = req.body;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit:1
        }).send()
        const imageFiles = req.files as Express.Multer.File[];
        const parkImages: ParkImage[] = imageFiles.map(file => ({
            url: file.path,
            filename: file.filename,
        }));

        // Create a new park instance with the user ID as the author
        const newPark = new Park({
            title,
            images: parkImages,
            price,
            description,
            location,
            // @ts-ignore
            author: req.user.id,  // Set the author to the logged-in user's ID
        });
        newPark.geometry = geoData.body.features[0].geometry;
        
        // Save the new park to the database
        const savedPark = await newPark.save();
        console.log(savedPark);
        res.status(201).json(savedPark);
    } catch (error) {
        console.error('Error creating park:', error);
        res.status(500).json({ message: 'Failed to create park' });
    }
});

// POST route to create a new park
// @ts-ignore
router.delete('/api/parks/:id', verifyToken, isAuthor, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Park.findByIdAndDelete(id);
        res.status(201);
    } catch (error) {
        console.error('Error deleting park:', error);
        res.status(500).json({ message: 'Failed to delete park' });
    }
});

export default router;
