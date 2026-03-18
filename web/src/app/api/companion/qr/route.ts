import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // 1. In a real app, query the OpenClaw service or a shared Postgres 
        //    table where OpenClaw Baileys adapter drops the Base64 QR code.
        // 2. We mock the response for the MVP UI to function:

        // Simulate finding a QR code in the DB
        const mockQrData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

        return NextResponse.json({
            status: "ready", // loading | ready | scanned
            qrCodeData: mockQrData
        });

    } catch (err: unknown) {
        console.error("QR Fetch Error:", err instanceof Error ? err.message : "Unknown");
        return NextResponse.json({ error: "Failed to fetch QR status" }, { status: 500 });
    }
}
