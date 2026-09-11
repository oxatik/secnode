"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PulseButton } from "@/components/PulseButton";
import { StatsGrid } from "@/components/StatsGrid";
import { TpsChart } from "@/components/TpsChart";

export default function Home() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🍪 SecNode — Cookie Chain</h1>
        <WalletMultiButton />
      </header>

      {connected && publicKey && (
        <p className="break-all font-mono text-sm text-green-400">
          Connected: {publicKey.toBase58()}
        </p>
      )}

      <StatsGrid />
      <TpsChart />

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-3 text-xl font-semibold">On-Chain Pulse</h2>
        <PulseButton />
      </section>
    </main>
  );
}
