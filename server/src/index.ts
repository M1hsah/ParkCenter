if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import parksRoutes from './routes/Parks'; 
import authRoutes from './routes/auth';
import reviewRoutes from './routes/review';
import './passport-config';

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/park-db')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.JWT_SECRET || 'defaultsecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use(parksRoutes)
app.use('/api/auth', authRoutes);
app.use(reviewRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
