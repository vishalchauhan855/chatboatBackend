import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout if MongoDB is down
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Error:', error.message);
        process.exit(1);
    }
};

export default connectDB;