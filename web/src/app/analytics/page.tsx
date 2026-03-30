"use client";

import { useEffect, useMemo, useState } from "react";

type StatsPayload = {
  totalUsers: number;
  totalMessages: number;
  topPersona: string | null;
  topPersonaUsageCount?: number;
  personaUsage?: Record<string, number>;
};

const statsCard = (title: string, value: string | number, accent?: string) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/30">
    <p className="text-xs uppercase text-white/50">{title}</p>
    <p className={`mt-3 text-3xl font-semibold ${accent || "text-white"}`}>{value}</p>
  </div>
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ?? "";
  const statsUrl = baseUrl ? `${baseUrl}/stats` : "/stats";

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(statsUrl);
        if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
        const payload: StatsPayload = await res.json();
        setStats(payload);
      } catch (err) {
        console.error("[Buddy Claw] Analytics page:", err);
        setError("Unable to reach Buddy Claw analytics right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [statsUrl]);

  const personaList = useMemo(() => {
    if (!stats?.personaUsage) return [];
    return Object.entries(stats.personaUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [stats]);

  return (
    <div className="min-h-screen bg-[#05050A] text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Buddy Claw Analytics</h1>
          <p className="text-white/60">
            Simple insight into how your Telegram companion ecosystem is performing. No overengineering, just counts.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/60">Syncing usage metrics...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {stats && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {statsCard("Total Users", stats.totalUsers, "text-[#FFB300]")}
              {statsCard("Total Messages", stats.totalMessages, "text-[#92F3FF]")}
              {statsCard("Top Persona", stats.topPersona || "none", "text-[#F97316]")}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Persona Usage Snapshot</h2>
              <div className="mt-4 space-y-3">
                {personaList.length === 0 && (
                  <p className="text-white/40">No persona interactions logged yet.</p>
                )}
                {personaList.map(([personaId, count]) => (
                  <div
                    key={personaId}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                  >
                    <span className="text-lg font-medium">{personaId}</span>
                    <span className="text-xl font-semibold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {stats.topPersonaUsageCount !== undefined && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Top Persona Signal</p>
                <p className="mt-3 text-xl">
                  {stats.topPersona} has been selected {stats.topPersonaUsageCount} times.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
