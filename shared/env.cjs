const path = require('path');
const dotenv = require('dotenv');

// 1. Load local .env
dotenv.config();

// 2. Load root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log(`[Shared Env (CJS)] Loaded variables.`);
