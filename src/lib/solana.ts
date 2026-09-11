import { Connection } from "@solana/web3.js";

export const COOKIE_RPC = process.env.NEXT_PUBLIC_COOKIE_RPC!;
export const COOKIE_WS = process.env.NEXT_PUBLIC_COOKIE_WS;

export const connection = new Connection(COOKIE_RPC, {
  commitment: "confirmed",
  wsEndpoint: COOKIE_WS,
});
