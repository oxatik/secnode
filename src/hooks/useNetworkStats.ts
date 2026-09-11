import useSWR from "swr";
import { connection } from "@/lib/solana";

type PerfSample = { numTransactions: number; samplePeriodSecs: number };

export function useNetworkStats() {
  return useSWR("netstats", async () => {
    const started = Date.now();
    const [slot, perf, epoch, blockHeight] = await Promise.all([
      connection.getSlot(),
      connection.getRecentPerformanceSamples(30) as Promise<PerfSample[]>,
      connection.getEpochInfo(),
      connection.getBlockHeight().catch(() => 0),
    ]);
    const latencyMs = Date.now() - started;

    const txCount = perf.reduce((a: number, s: PerfSample) => a + s.numTransactions, 0);
    const secs = perf.reduce((a: number, s: PerfSample) => a + s.samplePeriodSecs, 0);

    return {
      slot,
      tps: secs ? txCount / secs : 0,
      epoch: epoch.epoch,
      blockHeight,
      latencyMs,
    };
  }, { refreshInterval: 3000 });
}
