# Pigeon - private conversations, without permission

In today’s time, our private conversations are no longer truly private. Centralized chat apps read our data, store our metadata, and now face laws like the EU’s proposed “Chat Control” that could force message scanning on every citizen.

Pigeon fights back: a decentralized, end‑to‑end encrypted messenger built on Solana, where no server, company, or government can ever read your messages.

Only you and the person you talk to hold the keys.
No tracking. No scanning. No middlemen. Just freedom to talk.


## Why Pigeon exists

Proposals in the EU to mandate scanning of private messages (“Chat Control,” formally the Regulation to Prevent and Combat Child Sexual Abuse) would require generalized detection of content and can undermine end‑to‑end encryption. See a neutral overview here:
- Wikipedia: Regulation to Prevent and Combat Child Sexual Abuse (aka Chat Control): https://en.wikipedia.org/wiki/Chat_control

Pigeon takes the opposite stance: keep content encrypted at the edges, minimize metadata, and remove the need for any trusted server in the middle. Your wallet is your identity, your encryption happens locally, and the blockchain only ever sees encrypted blobs.

### Technical Demo - https://www.loom.com/share/10ce1dad6c1b4996983ce68bf2b38875


## What you can do with Pigeon today

- End‑to‑end encryption by default
  - X25519 (Curve25519) ECDH + HKDF for shared keys
  - ChaCha20‑Poly1305 AEAD for fast, authenticated encryption
  - Deterministic, wallet‑derived encryption public keys; you sign once per session to “unlock” encryption locally
- Wallet‑native identity on Solana
  - No phone numbers or emails; your Solana wallet is your address
  - Works with solana‑wallet‑adapter (React)
- Fully decentralized transport
  - Messages are stored on Solana via an Anchor program; only encrypted payloads are written on‑chain
  - Real‑time updates via account change subscriptions (WebSocket) - no custom servers
- Honest metadata model
  - On‑chain data includes sender public key, timestamp, and a fixed‑size encrypted payload; plaintext never leaves your device
  - Client enforces sensible limits (e.g., up to 280 chars per message, up to 10 messages per chat in current program layout)
- Built with modern, auditable crypto libraries
  - Noble curves/ciphers/hashes in the browser

Where to look in this repo:
- Client (React/Vite/TypeScript/Tailwind) in `client/`
  - Encryption core in `client/src/utils/encryption.ts`
  - Wallet‑derived key management in `client/src/contexts/EncryptionContext.tsx`
  - Program integration and live subscriptions in `client/src/hooks/`
- Solana program (Anchor) in `solana-program/`
  - Devnet program id and provider config in `solana-program/Anchor.toml`
  - IDL mirrored to the app as `client/src/solana_program.json`


## How Pigeon pushes back against EU “Chat Control” - and centralized messengers

- End‑to‑end encryption stays end‑to‑end. There’s no “client‑side scanning” backdoor here.
- There is no central company to pressure: Pigeon doesn’t rely on a proprietary server that can be forced to scan.
- Minimal metadata by design. The chain stores only what’s needed for state validity; message contents are unreadable to everyone but the participants.

Compared to…
- WhatsApp: Great E2EE (Signal Protocol) for message content, but it’s centralized and collects metadata under Meta’s policies. Users must still trust a single operator and app store distribution.
- Telegram: Most chats are not end‑to‑end encrypted by default (only “Secret Chats” are E2EE). Group chats are server‑client encrypted. Pigeon makes E2EE the default and eliminates a central server from the trust model.

Privacy is a continuum; Pigeon is designed to move the line toward users - not platforms.


## The next leap: Private Ephemeral Rollups (PER) with MagicBlock

Privacy at the edges is necessary, but some powerful features (like fast private payments or private group state) are easiest to build with confidential off‑chain execution that still inherits Solana’s security. That’s exactly what MagicBlock’s Private Ephemeral Rollups provide:

- What PER are (at a glance)
  - Solana‑native, TEE‑protected rollups with Intel TDX attestation
  - Sub‑50ms private execution with no bridges or fragmentation
  - Selective privacy - keep what can be public on L1, shield what must be private in the rollup, then attest outcomes back to Solana
- Learn more: MagicBlock “Privacy for Solana” and PER: https://www.magicblock.xyz/solana-privacy

How PER can level up Pigeon:
- Private groups, smarter anti‑spam - do abuse heuristics privately, prove only outcomes, never content
- Private file transfers - ephemeral storage + attestations so nodes can verify delivery without seeing the data
- Integrated private tokens and payments - a seamless way to tip, settle, or pay for storage privately while staying composable with Solana

Roadmap (early look):
- Add PER‑backed private channels for group state and media
- Add file transfer with optional on‑chain receipts/attestations
- Add opt‑in payments/tipping flows (private where it counts)


## Architecture in brief

- Client: React + Vite + Tailwind + Solana Wallet Adapter
  - Noble crypto in the browser: X25519/HKDF/ChaCha20‑Poly1305
  - Encryption keys are derived from your wallet public key; a one‑time signMessage proves consent and unlocks local encryption state for the session
- Chain: Anchor program (`pigeon_program`) on Devnet
  - `send_dm(bytes)` instruction appends an encrypted message to a PDA chat account
  - `ChatAccount` holds participants and a vector of fixed‑size encrypted payloads with `payload_len` and `timestamp`
- Realtime: Subscriptions on account changes stream new encrypted payloads, which the client decrypts locally

Design constraints (current program):
- Max plaintext length ~280 chars (fits into the fixed encrypted buffer size)
- Max 10 messages per chat (can be raised with a new program layout when desired)


## Local development

Prerequisites:
- Node.js 20+, pnpm
- Rust toolchain
- Solana CLI and Anchor CLI

1) Run the web client
- From `client/`:
  - `pnpm install`
  - `pnpm dev`
- Open the URL printed by Vite, connect a Solana wallet (Devnet), and start a chat.

2) Use the deployed Devnet program (default)
- The repo points to a Devnet program id in `solana-program/Anchor.toml` and mirrors the IDL at `client/src/solana_program.json`.
- You can chat against Devnet out‑of‑the‑box. Make sure your wallet has a little SOL on Devnet for tx fees.

3) (Optional) Build and deploy your own program
- In `solana-program/`:
  - Configure your CLI wallet at `solana-program/id.json` (or update `Anchor.toml` to point to your keypair)
  - `anchor build` then `anchor deploy` (ensure your keypair has Devnet SOL)
- After deployment, copy the new IDL address and update `client/src/solana_program.json` so the UI targets your program.

4) (Optional) Run against a local validator
- You can run `solana-test-validator` and point Anchor to `localnet` in `Anchor.toml` if you prefer a fully local loop. This repo also contains a `test-ledger/` directory for advanced setups.

Troubleshooting tips:
- “blockhash not found / expired” - retry; the client already refreshes blockhashes and will re‑submit
- “Wallet doesn’t support signMessage” - use a wallet with `signMessage` support
- “Decryption failed” - ensure you’ve signed once per session; ensure both parties use the same derivation (wallet address)
- Browser security - use HTTPS in production environments (the client warns if not secure)


## Security notes

- Keys live in memory for the session only; clearing the encryption state wipes in‑memory buffers where possible
- Deterministic encryption public keys are derived from wallet public keys via HKDF; anyone can compute your encryption public key from your wallet address, but only you can decrypt messages sent to you
- On‑chain state includes sender pubkey and timestamp - this is unavoidable in a public ledger; content remains encrypted


## Status and contributions

This is an early, working prototype intended to prove the UX and architecture. Expect the on‑chain layout and limits to evolve. Issues and PRs are welcome - especially around:
- Expanding program capacity and message limits
- Hardening crypto ergonomics and edge‑case handling
- Adding PER‑backed features (groups, files, private payments)


## References

- EU “Chat Control” overview: https://en.wikipedia.org/wiki/Chat_control
- MagicBlock PER (Privacy for Solana): https://www.magicblock.xyz/solana-privacy
- Signal on threats to E2EE (context): https://signal.org/blog/uk-online-safety-bill/


- Pigeon: private conversations, without permission.
