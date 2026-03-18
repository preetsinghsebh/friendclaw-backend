const fs = require('fs');
const path = require('path');
const { connectDB } = require('../shared/database');
const User = require('../shared/models/User');
const Memory = require('../shared/models/Memory');
const Chat = require('../shared/models/Chat');

const DATA_DIR = path.join(__dirname, '../data');

async function migrate() {
    console.log("🚀 Starting Data Migration to MongoDB...");
    await connectDB();

    // 1. Migrate Users
    const personasPath = path.join(DATA_DIR, 'personas.json');
    if (fs.existsSync(personasPath)) {
        const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));
        for (const [chatId, personaId] of personas) {
            await User.findOneAndUpdate({ chatId }, { personaId }, { upsert: true });
        }
        console.log(`✅ Migrated ${personas.length} user persona links.`);
    }

    // 2. Migrate Profiles
    const profilesPath = path.join(DATA_DIR, 'profiles.json');
    if (fs.existsSync(profilesPath)) {
        const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
        for (const [chatId, profile] of profiles) {
            await User.findOneAndUpdate({ chatId }, { ...profile }, { upsert: true });
        }
        console.log(`✅ Migrated ${profiles.length} detailed user profiles.`);
    }

    // 3. Migrate Memories
    const services = ['ziva', 'liam', 'anime', 'safespace', 'celeb', 'mindreset', 'openclaw'];
    for (const s of services) {
        const memPath = path.join(DATA_DIR, `${s}_memories.json`);
        if (fs.existsSync(memPath)) {
            const memories = JSON.parse(fs.readFileSync(memPath, 'utf8'));
            for (const [chatId, summary] of memories) {
                await Memory.findOneAndUpdate({ chatId, service: s }, { summary }, { upsert: true });
            }
            console.log(`✅ Migrated ${memories.length} memories for ${s}-service.`);
        }

        const anchorPath = path.join(DATA_DIR, `${s}_anchors.json`);
        if (fs.existsSync(anchorPath)) {
            const anchors = JSON.parse(fs.readFileSync(anchorPath, 'utf8'));
            for (const [chatId, list] of anchors) {
                await Memory.findOneAndUpdate({ chatId, service: s }, { anchors: list }, { upsert: true });
            }
            console.log(`✅ Migrated anchors for ${s}-service.`);
        }
    }

    console.log("🏁 Migration Complete! You can now safely switch services to 'mongo' mode.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("❌ Migration Failed:", err);
    process.exit(1);
});
