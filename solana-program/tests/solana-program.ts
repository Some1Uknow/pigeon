import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PigeonProgram } from "../target/types/pigeon_program";
import assert from "assert";

describe("Pigeon DM Chat", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider as AnchorProvider);
  const program = anchor.workspace.PigeonProgram as Program<PigeonProgram>;

  const payer = provider.wallet as any;
  const userA = web3.Keypair.generate();
  const userB = web3.Keypair.generate();
  const userC = web3.Keypair.generate();

  const CHAT_SEED = Buffer.from("chat");

  // Get PDA based on sender and receiver order (not sorted!)
  const getChatPda = (sender: web3.PublicKey, receiver: web3.PublicKey) => {
    return web3.PublicKey.findProgramAddressSync(
      [CHAT_SEED, sender.toBuffer(), receiver.toBuffer()],
      program.programId
    );
  };

  before(async () => {
    // Ensure the payer has sufficient funds on localnet for test transfers
    const connection = provider.connection as anchor.web3.Connection;
    const minRequiredLamports = 6 * web3.LAMPORTS_PER_SOL; // 2 SOL each for A, B, C
    const currentBalance = await connection.getBalance(payer.publicKey);
    if (currentBalance < minRequiredLamports) {
      const airdropSig = await connection.requestAirdrop(
        payer.publicKey,
        10 * web3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSig, "confirmed");
      const newBal = await connection.getBalance(payer.publicKey);
      console.log(
        `✅ Airdropped to payer. Balance: ${(newBal / web3.LAMPORTS_PER_SOL).toFixed(2)} SOL`
      );
    }

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
      }),
      web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: userC.publicKey,
        lamports,
      })
    );
    await provider.sendAndConfirm(tx);
    console.log("✅ Test wallets funded");
  });

  describe("PDA Derivation", () => {
    it("derives different PDAs based on sender/receiver order", async () => {
      const [pdaAtoB] = getChatPda(userA.publicKey, userB.publicKey);
      const [pdaBtoA] = getChatPda(userB.publicKey, userA.publicKey);
      
      assert.notEqual(
        pdaAtoB.toBase58(), 
        pdaBtoA.toBase58(), 
        "PDAs should be different when sender/receiver order changes"
      );
      console.log(`  PDA (A->B): ${pdaAtoB.toBase58()}`);
      console.log(`  PDA (B->A): ${pdaBtoA.toBase58()}`);
    });

    it("derives consistent PDA for same sender/receiver pair", async () => {
      const [pda1] = getChatPda(userA.publicKey, userB.publicKey);
      const [pda2] = getChatPda(userA.publicKey, userB.publicKey);
      
      assert.equal(
        pda1.toBase58(), 
        pda2.toBase58(), 
        "Same sender/receiver should always give same PDA"
      );
    });
  });

  describe("Sending Messages", () => {
    it("sends first DM (A -> B) and creates chat account", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);

      await program.methods
        .sendDm("Hello from A to B!")
        .accountsPartial({
          sender: userA.publicKey,
          receiver: userB.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userA])
        .rpc();

      const account = await program.account.chatAccount.fetch(chatPda);
      assert.equal(account.messages.length, 1, "Should contain one message");
      
      const msg = account.messages[0];
      assert.equal(msg.text, "Hello from A to B!");
      assert.equal(msg.sender.toBase58(), userA.publicKey.toBase58());
      assert.ok(msg.timestamp.toNumber() > 0, "Should have valid timestamp");
      
      // Check participants were initialized
      assert.equal(
        account.participants[0].toBase58(), 
        userA.publicKey.toBase58(),
        "First participant should be sender"
      );
      assert.equal(
        account.participants[1].toBase58(), 
        userB.publicKey.toBase58(),
        "Second participant should be receiver"
      );
      
      console.log(`  ✅ Message sent at timestamp: ${msg.timestamp}`);
    });

    it("sends additional messages to same chat (A -> B)", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);

      await program.methods
        .sendDm("Second message from A")
        .accountsPartial({
          sender: userA.publicKey,
          receiver: userB.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userA])
        .rpc();

      const account = await program.account.chatAccount.fetch(chatPda);
      assert.equal(account.messages.length, 2, "Should contain two messages");
      
      const lastMsg = account.messages[1];
      assert.equal(lastMsg.text, "Second message from A");
      assert.equal(lastMsg.sender.toBase58(), userA.publicKey.toBase58());
      
      console.log(`  ✅ Total messages in chat: ${account.messages.length}`);
    });

    it("creates separate chat when B initiates to A", async () => {
      const [chatPdaBtoA] = getChatPda(userB.publicKey, userA.publicKey);

      await program.methods
        .sendDm("Hello from B to A!")
        .accountsPartial({
          sender: userB.publicKey,
          receiver: userA.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userB])
        .rpc();

      const account = await program.account.chatAccount.fetch(chatPdaBtoA);
      assert.equal(account.messages.length, 1, "Should be a new chat with one message");
      
      const msg = account.messages[0];
      assert.equal(msg.text, "Hello from B to A!");
      assert.equal(msg.sender.toBase58(), userB.publicKey.toBase58());
      
      // Verify A->B chat still has 2 messages
      const [chatPdaAtoB] = getChatPda(userA.publicKey, userB.publicKey);
      const accountAtoB = await program.account.chatAccount.fetch(chatPdaAtoB);
      assert.equal(accountAtoB.messages.length, 2, "Original chat should still have 2 messages");
      
      console.log(`  ✅ Separate chats: A->B has ${accountAtoB.messages.length} msgs, B->A has ${account.messages.length} msg`);
    });

    it("sends multiple messages in succession", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userC.publicKey);
      const messages = ["Message 1", "Message 2", "Message 3"];

      for (const msg of messages) {
        await program.methods
          .sendDm(msg)
          .accountsPartial({
            sender: userA.publicKey,
            receiver: userC.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([userA])
          .rpc();
      }

      const account = await program.account.chatAccount.fetch(chatPda);
      assert.equal(account.messages.length, 3, "Should contain three messages");
      
      messages.forEach((msg, idx) => {
        assert.equal(account.messages[idx].text, msg, `Message ${idx} should match`);
      });
      
      console.log(`  ✅ Successfully sent ${messages.length} messages in succession`);
    });

    it("handles maximum length message (280 chars)", async () => {
      const [chatPda] = getChatPda(userC.publicKey, userA.publicKey);
      const maxText = "a".repeat(280);

      await program.methods
        .sendDm(maxText)
        .accountsPartial({
          sender: userC.publicKey,
          receiver: userA.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userC])
        .rpc();

      const account = await program.account.chatAccount.fetch(chatPda);
      assert.equal(account.messages[0].text.length, 280, "Should accept 280 char message");
      
      console.log(`  ✅ 280 character message accepted`);
    });

    it("handles empty message", async () => {
      const [chatPda] = getChatPda(userC.publicKey, userB.publicKey);

      await program.methods
        .sendDm("")
        .accountsPartial({
          sender: userC.publicKey,
          receiver: userB.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userC])
        .rpc();

      const account = await program.account.chatAccount.fetch(chatPda);
      assert.equal(account.messages[0].text, "", "Should accept empty message");
      
      console.log(`  ✅ Empty message accepted`);
    });
  });

  describe("Error Handling", () => {
    it("rejects message exceeding 280 characters", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);
      const longText = "x".repeat(281);
      let threw = false;
      let errorCode = "";

      try {
        await program.methods
          .sendDm(longText)
          .accountsPartial({
            sender: userA.publicKey,
            receiver: userB.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([userA])
          .rpc();
      } catch (err: any) {
        threw = true;
        errorCode = err.error?.errorCode?.code || "";
        const msg = err.toString();
        assert.ok(
          msg.includes("MessageTooLong") ||
            msg.includes("Message too long") ||
            msg.includes("6000") ||
            errorCode === "MessageTooLong",
          "Should return ChatError::MessageTooLong"
        );
        console.log(`  ✅ Correctly rejected with error: ${errorCode || "MessageTooLong"}`);
      }

      assert.equal(threw, true, "Expected sendDm to fail with long message");
    });

    it("rejects message far exceeding limit", async () => {
      const [chatPda] = getChatPda(userB.publicKey, userC.publicKey);
      const veryLongText = "x".repeat(1000);
      let threw = false;

      try {
        await program.methods
          .sendDm(veryLongText)
          .accountsPartial({
            sender: userB.publicKey,
            receiver: userC.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([userB])
          .rpc();
      } catch (err: any) {
        threw = true;
        console.log(`  ✅ Correctly rejected 1000 char message`);
      }

      assert.equal(threw, true, "Expected to reject message with 1000 chars");
    });

    it("requires sender signature", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);
      let threw = false;

      try {
        // Try to send without userA signing
        await program.methods
          .sendDm("Unsigned message")
          .accountsPartial({
            sender: userA.publicKey,
            receiver: userB.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([]) // No signers!
          .rpc();
      } catch (err: any) {
        threw = true;
        console.log(`  ✅ Correctly rejected unsigned transaction`);
      }

      assert.equal(threw, true, "Should reject transaction without sender signature");
    });
  });

  describe("Account State Verification", () => {
    it("verifies timestamp ordering", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);
      const account = await program.account.chatAccount.fetch(chatPda);
      
      for (let i = 1; i < account.messages.length; i++) {
        const prevTime = account.messages[i - 1].timestamp.toNumber();
        const currTime = account.messages[i].timestamp.toNumber();
        assert.ok(
          currTime >= prevTime, 
          `Message ${i} timestamp should be >= previous message`
        );
      }
      
      console.log(`  ✅ All ${account.messages.length} messages have valid timestamp ordering`);
    });

    it("verifies participants are immutable after initialization", async () => {
      const [chatPda] = getChatPda(userC.publicKey, userA.publicKey);
      
      // Fetch account twice, before and after sending another message
      const accountBefore = await program.account.chatAccount.fetch(chatPda);
      const participantsBefore = accountBefore.participants;
      
      await program.methods
        .sendDm("Another message")
        .accountsPartial({
          sender: userC.publicKey,
          receiver: userA.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userC])
        .rpc();
      
      const accountAfter = await program.account.chatAccount.fetch(chatPda);
      const participantsAfter = accountAfter.participants;
      
      assert.equal(
        participantsBefore[0].toBase58(),
        participantsAfter[0].toBase58(),
        "First participant should remain unchanged"
      );
      assert.equal(
        participantsBefore[1].toBase58(),
        participantsAfter[1].toBase58(),
        "Second participant should remain unchanged"
      );
      
      console.log(`  ✅ Participants remain immutable`);
    });

    it("lists all messages with correct senders", async () => {
      const [chatPda] = getChatPda(userA.publicKey, userB.publicKey);
      const account = await program.account.chatAccount.fetch(chatPda);
      
      console.log(`  📝 Chat history (${account.messages.length} messages):`);
      account.messages.forEach((msg, idx) => {
        const senderLabel = msg.sender.toBase58() === userA.publicKey.toBase58() ? "A" : "B";
        console.log(`    [${idx}] ${senderLabel}: "${msg.text.substring(0, 50)}${msg.text.length > 50 ? '...' : ''}"`);
      });
      
      assert.ok(account.messages.length > 0, "Should have messages in chat");
    });
  });
});