import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dostai';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log(`[Database] MongoDB Connected: ${MONGODB_URI}`);
    } catch (error) {
        console.error(`[Database] Connection Failed: ${error.message}`);
    }
};
