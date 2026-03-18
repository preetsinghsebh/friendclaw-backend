import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Basic signature verification for Razorpay Webhooks
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_secret";

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature && process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(rawBody);

        // Handle Subscription events
        switch (event.event) {
            case "subscription.activated":
                console.log("Subscription activated for user:", event.payload.subscription.entity.customer_id);
                // TODO: Update Supabase user record to premium tier
                break;
            case "subscription.charged":
                console.log("Successful payment for subscription:", event.payload.subscription.entity.id);
                break;
            case "subscription.cancelled":
                console.log("Subscription cancelled:", event.payload.subscription.entity.id);
                // TODO: Downgrade user record to free tier
                break;
            default:
                console.log(`Unhandled webhook event: ${event.event}`);
        }

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error("Webhook Error:", err instanceof Error ? err.message : "Unknown");
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
