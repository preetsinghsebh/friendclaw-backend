import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
        return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
    }

    try {
        // Path to the shared persistence data
        // Note: In production, this would be a proper DB. 
        // For local development, we read from the common 'dostai/data' folder.
        const dataPath = path.resolve(process.cwd(), '../data/profiles.json');
        
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ profiles: [] });
        }

        const raw = fs.readFileSync(dataPath, 'utf8');
        const profiles = JSON.parse(raw); // Array of [key, value] pairs from PersistentMap
        
        // Find the user's profile
        const userProfile = profiles.find(([key]: [string, any]) => String(key) === String(chatId));

        if (!userProfile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Also fetch persona data to see which companions are active
        const personasPath = path.resolve(process.cwd(), '../data/personas.json');
        let activePersonas = [];
        if (fs.existsSync(personasPath)) {
            const personasRaw = fs.readFileSync(personasPath, 'utf8');
            const personas = JSON.parse(personasRaw);
            activePersonas = personas
                .filter(([key]: [string, any]) => String(key) === String(chatId))
                .map(([_, p]: [any, any]) => p);
        }

        return NextResponse.json({
            profile: userProfile[1],
            activePersonas
        });
    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}
