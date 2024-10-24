// @ts-nocheck
import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
        }
        else{
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.json({ token, userId: user._id });
        }


    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
});

export default router;
