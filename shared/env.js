import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load local .env (if it exists)
dotenv.config();

// 2. Load root .env (for shared variables like MONGODB_URI)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log(`[Shared Env] Loaded variables. (MONGODB_URI: ${process.env.MONGODB_URI ? 'OK' : 'MISSING'}, TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'OK' : 'MISSING'})`);
