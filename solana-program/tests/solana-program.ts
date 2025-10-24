import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PigeonProgram } from "../target/types/pigeon_program"; // ✅ updated
import assert from "assert";

describe("Pigeon DM Chat", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider as AnchorProvider);
  const program = anchor.workspace.PigeonProgram as Program<PigeonProgram>;

  const payer = provider.wallet as any;
  const userA = web3.Keypair.generate();
  const userB = web3.Keypair.generate();

  const CHAT_SEED = Buffer.from("chat");

  // ✅ Sorting function (external now)
  const sortPubkeys = (x: web3.PublicKey, y: web3.PublicKey): [web3.PublicKey, web3.PublicKey] =>
    x.toBase58().localeCompare(y.toBase58()) <= 0 ? [x, y] : [y, x];

  const getChatPda = (a: web3.PublicKey, b: web3.PublicKey) => {
    const [x, y] = sortPubkeys(a, b);
    return web3.PublicKey.findProgramAddressSync(
      [CHAT_SEED, x.toBuffer(), y.toBuffer()],
      program.programId
    );
  };

  before(async () => {
    const lamports = 2 * web3.LAMPORTS_PER_SOL;
    const tx = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: userA.publicKey,
        lamports,
      }),
      web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: userB.publicKey,
        lamports,
      })
    );
    await provider.sendAndConfirm(tx);
  });

  it("derives deterministic PDA for both users", async () => {
    const [pda1] = getChatPda(userA.publicKey, userB.publicKey);
    const [pda2] = getChatPda(userB.publicKey, userA.publicKey);
    assert.equal(pda1.toBase58(), pda2.toBase58(), "PDA must be same for both orderings");
  });

  it("sends first DM (A -> B) and creates chat account", async () => {
    const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);

    await program.methods
      .sendDm("Hello from A to B!")
      .accounts({
        chatAccount: chatPda,
        sender: userA.publicKey,
        receiver: userB.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([userA])
      .rpc();

    const account = await program.account.chatAccount.fetch(chatPda);
    assert.ok(account.messages.length === 1, "Should contain one message");
    const msg = account.messages[0];
    assert.equal(msg.text, "Hello from A to B!");
    assert.equal(msg.sender.toBase58(), userA.publicKey.toBase58());
  });

  it("sends reply (B -> A) into same PDA", async () => {
    const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);

    await program.methods
      .sendDm("Hello back from B!")
      .accounts({
        chatAccount: chatPda,
        sender: userB.publicKey,
        receiver: userA.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([userB])
      .rpc();

    const account = await program.account.chatAccount.fetch(chatPda);
    assert.ok(account.messages.length === 2, "Should contain two messages now");
    const lastMsg = account.messages[1];
    assert.equal(lastMsg.text, "Hello back from B!");
    assert.equal(lastMsg.sender.toBase58(), userB.publicKey.toBase58());
  });

  it("rejects overly long message (>280 chars)", async () => {
    const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);
    const longText = "x".repeat(400);
    let threw = false;

    try {
      await program.methods
        .sendDm(longText)
        .accounts({
          chatAccount: chatPda,
          sender: userA.publicKey,
          receiver: userB.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userA])
        .rpc();
    } catch (err: any) {
      threw = true;
      const msg = err.toString();
      assert.ok(
        msg.includes("MessageTooLong") ||
          msg.includes("Message too long") ||
          msg.includes("6000"),
        "Should return ChatError::MessageTooLong"
      );
    }

    assert.equal(threw, true, "Expected sendDm to fail with long message");
  });
});