import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoute from './routes/chatRoute.js';

const app = express();

app.use(cors());           // ← YE HAI?
app.use(express.json());

connectDB();

app.use('/api/chat', chatRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});