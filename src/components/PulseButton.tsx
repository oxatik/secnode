"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useState } from "react";
import { toast } from "sonner";

const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
type TxState = "idle" | "signing" | "sent" | "confirmed" | "error";

export function PulseButton() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [state, setState] = useState<TxState>("idle");
  const [sig, setSig] = useState("");

  function buildTx(withMemo: boolean, blockhash: string) {
    const tx = new Transaction({ feePayer: publicKey!, recentBlockhash: blockhash });
    if (withMemo) {
      tx.add(new TransactionInstruction({
        keys: [{ pubkey: publicKey!, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM,
        data: Buffer.from("devscan:pulse:" + Date.now(), "utf8"),
      }));
    } else {
      tx.add(SystemProgram.transfer({ fromPubkey: publicKey!, toPubkey: publicKey!, lamports: 1 }));
    }
    return tx;
  }

  async function pulse() {
    if (!publicKey) { toast.error("Connect Nightly wallet first"); return; }
    try {
      setState("signing");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      let signature: string;
      try {
        signature = await sendTransaction(buildTx(true, blockhash), connection);
      } catch (err: any) {
        if (String(err?.message ?? err).toLowerCase().includes("reject")) throw err;
        toast.info("Memo program unavailable — retrying with plain transfer");
        const fresh = await connection.getLatestBlockhash();
        signature = await sendTransaction(buildTx(false, fresh.blockhash), connection);
      }

      setSig(signature);
      setState("sent");
      toast.info("Transaction sent — confirming…");

      const conf = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight }, "confirmed"
      );
      if (conf.value.err) throw new Error("Transaction failed on-chain");

      setState("confirmed");
      toast.success("Pulse confirmed on Cookie Chain!");
    } catch (e: any) {
      setState("error");
      toast.error(e?.message ?? "Transaction failed");
    }
  }

  const label: Record<TxState, string> = {
    idle: "🍪 Send On-Chain Pulse",
    signing: "✍️ Signing in Nightly…",
    sent: "📡 Confirming…",
    confirmed: "✅ Confirmed! Pulse Again",
    error: "❌ Failed — Retry",
  };

  return (
    <div>
      <button
        onClick={pulse}
        disabled={state === "signing" || state === "sent"}
        className="rounded-lg bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400 disabled:opacity-50"
      >
        {label[state]}
      </button>
      {sig && <p className="mt-2 break-all font-mono text-xs text-neutral-400">{sig}</p>}
    </div>
  );
}
