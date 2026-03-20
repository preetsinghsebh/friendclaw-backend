"use client";

import { useEffect } from "react";

export function useAnalytics() {
    const trackEvent = (eventName: string, properties: any = {}) => {
        const timestamp = new Date().toISOString();
        console.log(`[Analytics] Tracked: ${eventName}`, { ...properties, timestamp });
        
        // In a real startup, you'd send this to PostHog or Mixpanel:
        /*
        posthog.capture(eventName, properties);
        */

        // For this local build, we can also log it to an internal stats API if needed
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        fetch(`${apiUrl}/api/analytics`, {
            method: 'POST',
            body: JSON.stringify({ eventName, properties, timestamp }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => {}); // Silent fail
    };

    return { trackEvent };
}
