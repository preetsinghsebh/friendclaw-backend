import '../shared/env.js';
import { connectDB } from '../shared/database.js';
import { personaManager } from '../buddy-claw-service/persona-manager.js';
import fs from 'fs';
import path from 'path';

async function seed() {
    console.log('[Seed] Starting persona synchronization...');
    try {
        await connectDB();
        
        // Force load from JSON first
        const configPath = path.resolve(process.cwd(), 'buddy-claw-service', 'config', 'personas.json');
        if (!fs.existsSync(configPath)) {
            console.error('[Seed] personas.json NOT FOUND at:', configPath);
            process.exit(1);
        }

        const raw = fs.readFileSync(configPath, 'utf8');
        const personas = JSON.parse(raw);

        console.log(`[Seed] Found ${personas.length} personas in JSON. Synchronizing with MongoDB...`);

        // Use the manager to add each one (which handles the upsert to Mongo)
        personaManager.useMongo = true;
        for (const p of personas) {
            await personaManager.addPersona(p);
            console.log(`[Seed] Synced: ${p.id}`);
        }

        console.log('[Seed] Synchronization complete! 27+ personas are now live.');
        process.exit(0);
    } catch (err) {
        console.error('[Seed] Failed:', err);
        process.exit(1);
    }
}

seed();
