import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), '..', 'data', 'analytics_events.json');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventName, properties, timestamp } = body;

        // Ensure data directory exists
        const dataDir = path.dirname(STATS_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Read existing events (we use a simple append-to-array for this local demo)
        let events = [];
        if (fs.existsSync(STATS_FILE)) {
            const content = fs.readFileSync(STATS_FILE, 'utf-8');
            events = JSON.parse(content || '[]');
        }

        // Add new event
        events.push({ eventName, properties, timestamp });

        // Keep only last 1000 events to prevent file bloat
        if (events.length > 1000) events = events.slice(-1000);

        fs.writeFileSync(STATS_FILE, JSON.stringify(events, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
