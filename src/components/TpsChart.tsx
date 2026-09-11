"use client";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNetworkStats } from "@/hooks/useNetworkStats";

export function TpsChart() {
  const { data } = useNetworkStats();
  const [points, setPoints] = useState<{ t: string; tps: number }[]>([]);

  useEffect(() => {
    if (!data) return;
    setPoints((p) => [
      ...p.slice(-59),
      { t: new Date().toLocaleTimeString(), tps: Number(data.tps.toFixed(2)) },
    ]);
  }, [data]);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="mb-2 text-sm text-neutral-400">Live TPS</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <XAxis dataKey="t" hide />
            <YAxis width={40} stroke="#737373" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="tps" stroke="#f97316" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
