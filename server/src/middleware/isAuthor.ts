import Park from '../models/Park'; // Assuming the Park model is in a models folder
import { Request, Response, NextFunction } from 'express';
const isAuthor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const park = await Park.findById(id);
        // @ts-ignore
        if(!park?.author.equals(req.user.id)){
            throw new Error('You do not have permission');
        }
        next();
    } catch (error) {
        console.log("This is from the terminal")
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default isAuthor;