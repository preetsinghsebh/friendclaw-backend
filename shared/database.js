import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostai';

let isConnected = false;

export const connectDB = async (maxRetries = 5, initialDelay = 2000) => {
    if (isConnected) return true;

    if (!process.env.MONGO_URI) {
        console.warn(`[Database] MONGO_URI is missing. Falling back to default: ${MONGO_URI}`);
    }

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`[Database] Connection attempt ${i + 1}/${maxRetries} to MongoDB...`);
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 30000, // Increased from 10000
                socketTimeoutMS: 90000,          // Increased from 45000
                connectTimeoutMS: 30000,
            });
            isConnected = true;
            console.log(`[Database] MongoDB Connected Successfully`);
            return true;
        } catch (error) {
            lastError = error;
            const delay = initialDelay * Math.pow(2, i);
            console.error(`[Database] Connection attempt ${i + 1} failed: ${error.message}`);
            if (i < maxRetries - 1) {
                console.log(`[Database] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    console.error(`[Database] All connection attempts failed. Last error: ${lastError.message}`);
    return false;
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
