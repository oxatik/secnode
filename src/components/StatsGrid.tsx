"use client";
import { useNetworkStats } from "@/hooks/useNetworkStats";

export function StatsGrid() {
  const { data, error } = useNetworkStats();

  if (error) return <p className="text-red-400">RPC error — check NEXT_PUBLIC_COOKIE_RPC</p>;
  if (!data) return <p className="text-neutral-400">Loading network stats…</p>;

  const cards = [
    { label: "Current Slot", value: data.slot.toLocaleString() },
    { label: "TPS (30-sample avg)", value: data.tps.toFixed(2) },
    { label: "Epoch", value: String(data.epoch) },
    { label: "Block Height", value: data.blockHeight.toLocaleString() },
    { label: "RPC Latency", value: `${data.latencyMs} ms` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-400">{c.label}</p>
          <p className="mt-1 truncate text-lg font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
