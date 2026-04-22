# Pigeon

Privacy superapp for Solana wallets.

Pigeon starts with a simple idea: your wallet should be enough to move, swap, and communicate privately without handing your identity, contacts, or payment trail to a centralized app.

Today, Pigeon is a Solana privacy app in devnet testing. The first shipped module is encrypted wallet-to-wallet chat. The next MVP milestone is private money movement: Umbra for private transfers, and Privacy Cash for private swap research once the real swap execution path is confirmed.

## What Works Today

- **Privacy lab:** A gated route for verifying Umbra and Privacy Cash integration readiness.
- **Wallet identity:** Connect Phantom or Solflare and use the wallet as the app identity.
- **Encrypted chat module:** Wallet-to-wallet encrypted messaging is live as the first app surface.
- **On-chain anchoring:** The Solana program stores encrypted rolling message history.
- **App shell:** Chat, transfer, swap, and protocol-lab routes are available in the client.

## Current Privacy Protocol Status

Pigeon does not treat privacy as a marketing label. A protocol is only considered ready when the SDK path, signer path, transaction flow, and end-user recovery states are verified.

| Area | Protocol | Status | Notes |
| --- | --- | --- | --- |
| Private transfers | Umbra | Next MVP path | Umbra exposes the right SDK primitives for registration, encrypted balances, receiver-claimable UTXOs, scanning, and claiming. Pigeon still needs a safe wallet signer bridge before real Umbra transactions are enabled. |
| Private swaps | Privacy Cash | Blocked on confirmed swap API | Privacy Cash docs describe private swaps, but the public `privacycash@1.1.22` SDK currently exposes deposit, withdraw, balance, SOL, and SPL primitives. No documented public swap/Jupiter export has been verified yet. |
| Private balance/deposit/withdraw tests | Privacy Cash | Testable in isolation | The SDK supports key derivation, private balance reads, SOL/SPL deposits, and SOL/SPL withdrawals. These are isolated behind the privacy lab route while swap execution remains blocked. |
| Encrypted messaging | Pigeon program | Working devnet module | Chat proves wallet identity, encryption, and app shell patterns while private transfers and swaps are hardened. |

## Minimal Devnet MVP Plan

The goal is not to ship every privacy feature at once. The goal is to make one devnet path work reliably, then expand.

### Milestone 1 — Stable Privacy Lab

- Keep `/app/privacy-lab` as the only place where experimental privacy protocols run.
- Show one clear protocol check instead of raw SDK controls.
- Verify wallet capabilities: `publicKey`, `signMessage`, and `signTransaction`.
- Verify circuit assets load before any Privacy Cash operation.
- Block any swap execution until the real Privacy Cash swap endpoint or SDK function is confirmed.

### Milestone 2 — Umbra Devnet Transfer

- Build an audited signer bridge from the connected Solana wallet to Umbra’s expected signer interface.
- Add one action: `Enable Private Transfers`.
- Register the current wallet with Umbra on devnet.
- Add encrypted balance query for one supported token.
- Add one private transfer flow: sender creates a receiver-claimable UTXO, recipient scans and claims.
- Add clear states: preparing, signing, submitted, claimable, claimed, failed.

### Milestone 3 — Privacy Cash Devnet Swap Decision

- Confirm whether Privacy Cash exposes a private swap API outside the public SDK.
- If an official API exists, wrap only that documented path.
- If no public API exists, do not fake it. Build a composed beta flow instead:
  - withdraw from Privacy Cash to an ephemeral wallet,
  - swap through Jupiter with strict slippage,
  - deposit output back into Privacy Cash,
  - use a relayer/fee payer so the user does not fund the ephemeral wallet from their main wallet.

### Milestone 4 — End-User Smoothness

- Hide protocol names behind simple actions: `Send privately` and `Swap privately`.
- Show exact fees, expected output, and privacy caveats before signing.
- Add retry and recovery paths for failed proofs, failed relays, and stuck pending transactions.
- Add low-value devnet test fixtures so the full flow can be repeated safely.
- Add production logging rules: never log wallet, amount, route, IP, and timestamp together.

## Product Direction

Pigeon should feel like a private superapp for wallets, not a protocol dashboard and not just a messenger.

- **Send privately:** Umbra-powered private transfers after signer integration is verified.
- **Swap privately:** Privacy Cash-powered or Privacy Cash-composed swaps after the swap route is confirmed.
- **Chat privately:** encrypted wallet-to-wallet conversations as a built-in module.
- **Stay in control:** every transaction is wallet-approved, with visible network, fee, and recipient details.

## Architecture

- **Client:** Vite, React, TypeScript
- **Wallets:** Solana Wallet Adapter
- **Program:** Anchor-based Solana program
- **Current app module:** encrypted wallet-to-wallet chat
- **Messaging encryption:** X25519 plus ChaCha20-Poly1305
- **Privacy transfer research:** Umbra SDK
- **Privacy swap research:** Privacy Cash SDK and protocol docs
- **Storage:** on-chain encrypted rolling message buffer

## Repository Structure

```text
client/          React app
solana-program/  Anchor program
docs/            Protocol research and implementation notes
```

## Getting Started

```bash
git clone https://github.com/Some1Uknow/pigeon.git
cd pigeon/client
pnpm install
pnpm dev
```

Open the local Vite URL and connect Phantom or Solflare on devnet.

## Environment

Create `client/.env` with a devnet RPC endpoint:

```bash
VITE_RPC_URL=https://api.devnet.solana.com
```

For better reliability, use a Helius or QuickNode devnet URL.

## Requirements

- Node.js 18 or newer
- pnpm
- Phantom or Solflare
- Devnet SOL for test transactions

## Validation

```bash
cd client
pnpm build
```

The full lint suite currently includes older unrelated issues. For privacy integration changes, run targeted lint against touched files until the existing lint debt is cleaned up.

## Roadmap

- [x] Privacy superapp shell
- [x] Wallet-based identity
- [x] Encrypted chat module
- [x] On-chain encrypted message history
- [x] Privacy lab route for protocol verification
- [ ] Umbra wallet signer bridge
- [ ] Umbra devnet private transfer flow
- [ ] Privacy Cash swap API confirmation
- [ ] Private swap beta flow
- [ ] Relayer and fee-payer service
- [ ] Mobile-first privacy app
- [ ] Longer encrypted history with off-chain storage pointers
