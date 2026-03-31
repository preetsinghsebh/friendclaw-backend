import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostai';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return true;

    if (!process.env.MONGO_URI) {
        console.warn(`[Database] MONGO_URI is missing. Falling back to default: ${MONGO_URI}`);
    }

    try {
        console.log(`[Database] Connecting to MongoDB at ${MONGO_URI.split('://')[1].split('/')[0]}...`);
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
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

/**
 * Utility to retry a database operation with exponential backoff
 */
export const withRetry = async (operation, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            const delay = initialDelay * Math.pow(2, i);
            console.warn(`[Database] Operation failed (attempt ${i + 1}/${maxRetries}), retrying in ${delay}ms: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
};
