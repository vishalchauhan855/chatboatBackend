import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoute from './routes/chatRoute.js';
import authRoute from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});