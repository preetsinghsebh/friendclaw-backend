import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dostai';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return true;

    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
        console.warn(`[Database] MONGO_URI or MONGODB_URI is missing in environment. Falling back to default: ${MONGODB_URI}`);
    }

    try {
        console.log(`[Database] Connecting to MongoDB...`);
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        isConnected = true;
        console.log(`[Database] MongoDB Connected Successfully`);
        return true;
    } catch (error) {
        console.error(`[Database] Connection Failed: ${error.message}`);
        console.error(`[Database] Error Stack: ${error.stack}`);
        return false;
    }
};
