const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("Error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
}

async function test() {
    console.log("Attempting to connect to MongoDB Atlas...");
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully!");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

test();
