import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = { id: decoded.id };  // Explicitly set req.user

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default verifyToken;
