# 🍪 SecNode — Cookie Chain Network Intelligence Hub

> Real-time network analytics + on-chain interaction dashboard for **Cookie Chain**, the fast, community-driven SVM ecosystem.

**Live app:** https://secnode.bond

---

## What is SecNode?

SecNode gives builders and users a live view of Cookie Chain health — current slot, TPS, epoch, block height, and RPC latency — plus an **On-Chain Pulse**: anyone with a Nightly wallet can send a real transaction to Cookie Chain and watch the full lifecycle (signing → sent → confirmed) in real time.

Built to demonstrate meaningful on-chain interaction with Cookie Chain: sub-second finality, near-zero fees, and full Solana tooling compatibility.

## Features

| Feature | Details |
|---|---|
| 🔌 Wallet connection | Nightly via Solana Wallet Standard (auto-detected) |
| 👛 Address display | Connected wallet pubkey shown in the UI |
| 🍪 On-Chain Pulse | SPL Memo transaction (`secnode:pulse:<ts>`) with automatic fallback to a 1-lamport self-transfer |
| ✅ Tx lifecycle | Live states: idle → signing → sent → confirmed / error, with signature output |
| 🛡 Error handling | Wallet rejection, RPC failures, and on-chain errors all surface as user-friendly toasts |
| 📊 Network dashboard | Slot, TPS (30-sample avg), epoch, block height, RPC round-trip latency |
| 📈 Live TPS chart | Recharts line chart, refreshed every 3 seconds |

## Architecture

```
┌──────────────┐    HTTPS     ┌───────────────┐   QUIC tunnel   ┌──────────────────────────┐
│   Browser    │ ◄──────────► │  Cloudflare   │ ◄────────────── │  VPS (Ubuntu24.04 LXC)  │
│  + Nightly   │              │   Edge/CDN    │                 │  cloudflared │
│   Wallet     │              └───────────────┘                 │     ↓                    │
└──────────────┘                                               │  Next.js :3100           │
                                                               │  (systemd: devscan)      │
                                                               └───────────┬──────────────┘
                                                                           │ JSON-RPC
                                                                           ▼
                                                               ┌──────────────────────────┐
                                                               │   Cookie Chain (SVM)     │
                                                               │   rpc.cookiescan.io      │
                                                               └──────────────────────────┘
```

No inbound ports required — the Cloudflare Tunnel connects **outbound**, so the app works even behind NAT.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4
- **Chain:** @solana/web3.js · @solana/wallet-adapter (Nightly)
- **Data:** SWR polling · Recharts · sonner
- **Infra:** systemd · Cloudflare Tunnel · UFW (SSH-only ingress)

## Getting Started

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/secnode.git
cd secnode
npm install --legacy-peer-deps
```

Create `.env.local`:

```bash
NEXT_PUBLIC_COOKIE_RPC=https://rpc.cookiescan.io
NEXT_PUBLIC_COOKIE_WS=wss://rpc.cookiescan.io
NEXT_PUBLIC_EXPLORER_API=https://api.cookiescan.io
```

Run the dev server:

```bash
npm run dev
# → http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_COOKIE_RPC` | Cookie Chain JSON-RPC endpoint |
| `NEXT_PUBLIC_COOKIE_WS` | Cookie Chain WebSocket endpoint |
| `NEXT_PUBLIC_EXPLORER_API` | CookieScan API base URL |

## How to Use

1. Install the **Nightly** wallet browser extension
2. Bridge funds to Cookie Chain via the official **Cookie Chain Bridge**
3. Open https://secnode.bond → **Select Wallet** → approve in Nightly
4. Click **🍪 Send On-Chain Pulse** and sign the transaction
5. Watch the status pipeline and copy your transaction signature

## Deployment (the DevOps story)

SecNode runs on a NAT'd LXC container with no direct inbound connectivity, so ingress is handled by a **Cloudflare Tunnel** (outbound QUIC). The firewall allows SSH only — zero exposed web ports.

**systemd services:**

| Service | Purpose |
|---|---|
| `devscan.service` | Next.js production server on port 3100 |
| `cloudflared-secnode.service` | Cloudflare Tunnel → https://secnode.bond |

**Deploy updates:**

```bash
git pull
npm run build
systemctl restart devscan
```

## Cookie Chain Resources

- Homepage: https://www.cookiechain.wtf
- Docs: https://docs.cookiechain.wtf
- RPC: https://rpc.cookiescan.io
- Explorer API: https://api.cookiescan.io
- Telegram: https://t.me/TheCookieNetChain
- X: https://x.com/TheCookieChain

## Roadmap

- [ ] Custom Anchor program on Cookie Chain (~$0.05 deployment) for persistent on-chain check-ins
- [ ] Global pulse activity feed + builder leaderboard
- [ ] Transaction inspector powered by the CookieScan API
- [ ] Cookieswap / Cookiebox integrations (swaps, liquidity stats)
- [ ] Historical TPS persistence with charts across epochs

## License

MIT — see [LICENSE](LICENSE).
