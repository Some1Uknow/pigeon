/**
 * Comprehensive Encryption Test Script
 * Run with: npx tsx src/test-encryption.ts
 * 
 * Tests:
 * 1. Key derivation from wallet public keys
 * 2. ECDH shared secret computation
 * 3. Message encryption/decryption
 * 4. Edge cases and error handling
 */

import { PublicKey, Keypair } from "@solana/web3.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { chacha20poly1305 } from "@noble/ciphers/chacha.js";

const NONCE_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Replicate client-side encryption logic
function deriveEncryptionKeypair(walletPubkey: PublicKey): {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
} {
  const walletPubkeyBytes = walletPubkey.toBytes();
  const info = new TextEncoder().encode("pigeon-encryption-keypair-v1");
  const seed = hkdf(sha256, walletPubkeyBytes, undefined, info, 32);
  
  // Use the seed as X25519 private key directly (with proper clamping)
  const privateKey = seed.slice();
  privateKey[0] &= 248;
  privateKey[31] &= 127;
  privateKey[31] |= 64;
  
  // Generate X25519 public key from the clamped private key
  const publicKey = x25519.getPublicKey(privateKey);
  
  return { privateKey, publicKey };
}

function deriveSharedSecret(
  myPrivateKey: Uint8Array,
  theirPublicKey: Uint8Array
): Uint8Array {
  // Both keys are already X25519, just do ECDH
  const sharedSecret = x25519.scalarMult(myPrivateKey, theirPublicKey);
  
  // HKDF
  const info = new TextEncoder().encode("pigeon-message-encryption-v1");
  const derivedKey = hkdf(sha256, sharedSecret, undefined, info, 32);
  
  return derivedKey;
}

function generateNonce(counter: number): Uint8Array {
  const nonce = new Uint8Array(NONCE_LENGTH);
  const view = new DataView(nonce.buffer);
  
  const timestamp = Date.now();
  view.setBigUint64(0, BigInt(timestamp), false);
  view.setUint32(8, counter, false);
  
  return nonce;
}

function encryptMessage(
  plaintext: string,
  sharedSecret: Uint8Array,
  nonce: Uint8Array
): Uint8Array {
  const plaintextBytes = new TextEncoder().encode(plaintext);
  const cipher = chacha20poly1305(sharedSecret, nonce);
  const ciphertext = cipher.encrypt(plaintextBytes);
  
  // Combine: nonce + ciphertext (includes auth tag)
  const encrypted = new Uint8Array(NONCE_LENGTH + ciphertext.length);
  encrypted.set(nonce, 0);
  encrypted.set(ciphertext, NONCE_LENGTH);
  
  return encrypted;
}

function decryptMessage(
  encryptedData: Uint8Array,
  sharedSecret: Uint8Array
): string {
  if (encryptedData.length < NONCE_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("Encrypted data too short");
  }
  
  const nonce = encryptedData.slice(0, NONCE_LENGTH);
  const ciphertextWithTag = encryptedData.slice(NONCE_LENGTH);
  
  const cipher = chacha20poly1305(sharedSecret, nonce);
  
  try {
    const decrypted = cipher.decrypt(ciphertextWithTag);
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error("Decryption failed - message may be corrupted or tampered with");
  }
}

// Test suite
async function runTests() {
  log('\n🔐 Starting Comprehensive Encryption Tests\n', 'cyan');
  
  let passed = 0;
  let failed = 0;
  
  const test = (name: string, fn: () => void | Promise<void>) => {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.then(() => {
          log(`✓ ${name}`, 'green');
          passed++;
        }).catch((error) => {
          log(`✗ ${name}`, 'red');
          log(`  Error: ${error.message}`, 'red');
          failed++;
        });
      } else {
        log(`✓ ${name}`, 'green');
        passed++;
      }
    } catch (error: any) {
      log(`✗ ${name}`, 'red');
      log(`  Error: ${error.message}`, 'red');
      failed++;
    }
  };
  
  // Test 1: Key Derivation
  log('📋 Test Suite 1: Key Derivation', 'blue');
  
  const userA = Keypair.generate();
  const userB = Keypair.generate();
  
  test('Derives deterministic keypairs from wallet public keys', () => {
    const keypair1 = deriveEncryptionKeypair(userA.publicKey);
    const keypair2 = deriveEncryptionKeypair(userA.publicKey);
    
    if (Buffer.from(keypair1.privateKey).toString('hex') !== Buffer.from(keypair2.privateKey).toString('hex')) {
      throw new Error('Private keys are not deterministic');
    }
    if (Buffer.from(keypair1.publicKey).toString('hex') !== Buffer.from(keypair2.publicKey).toString('hex')) {
      throw new Error('Public keys are not deterministic');
    }
    
    log(`  → Encryption private key: ${Buffer.from(keypair1.privateKey).toString('hex').slice(0, 32)}...`, 'reset');
    log(`  → Encryption public key: ${Buffer.from(keypair1.publicKey).toString('hex').slice(0, 32)}...`, 'reset');
  });
  
  test('Different wallets produce different encryption keys', () => {
    const keypairA = deriveEncryptionKeypair(userA.publicKey);
    const keypairB = deriveEncryptionKeypair(userB.publicKey);
    
    if (Buffer.from(keypairA.privateKey).toString('hex') === Buffer.from(keypairB.privateKey).toString('hex')) {
      throw new Error('Different wallets produced same private key');
    }
  });
  
  // Test 2: ECDH Shared Secret
  log('\n📋 Test Suite 2: ECDH Shared Secret', 'blue');
  
  const keypairA = deriveEncryptionKeypair(userA.publicKey);
  const keypairB = deriveEncryptionKeypair(userB.publicKey);
  
  test('Both parties compute same shared secret', () => {
    const secretA = deriveSharedSecret(keypairA.privateKey, keypairB.publicKey);
    const secretB = deriveSharedSecret(keypairB.privateKey, keypairA.publicKey);
    
    console.log(`  → A's private: ${Buffer.from(keypairA.privateKey).toString('hex').slice(0, 32)}...`);
    console.log(`  → B's public:  ${Buffer.from(keypairB.publicKey).toString('hex').slice(0, 32)}...`);
    console.log(`  → Secret A: ${Buffer.from(secretA).toString('hex').slice(0, 32)}...`);
    console.log(`  → B's private: ${Buffer.from(keypairB.privateKey).toString('hex').slice(0, 32)}...`);
    console.log(`  → A's public:  ${Buffer.from(keypairA.publicKey).toString('hex').slice(0, 32)}...`);
    console.log(`  → Secret B: ${Buffer.from(secretB).toString('hex').slice(0, 32)}...`);
    
    if (Buffer.from(secretA).toString('hex') !== Buffer.from(secretB).toString('hex')) {
      throw new Error('Shared secrets do not match');
    }
    
    log(`  → Shared secret: ${Buffer.from(secretA).toString('hex').slice(0, 32)}...`, 'reset');
  });
  
  // Test 3: Message Encryption/Decryption
  log('\n📋 Test Suite 3: Message Encryption/Decryption', 'blue');
  
  const sharedSecret = deriveSharedSecret(keypairA.privateKey, keypairB.publicKey);
  
  test('Encrypts and decrypts short messages', () => {
    const plaintext = "Hello, World!";
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    const decrypted = decryptMessage(encrypted, sharedSecret);
    
    if (decrypted !== plaintext) {
      throw new Error(`Decryption failed: expected "${plaintext}", got "${decrypted}"`);
    }
    
    log(`  → Plaintext: "${plaintext}"`, 'reset');
    log(`  → Encrypted size: ${encrypted.length} bytes`, 'reset');
  });
  
  test('Encrypts and decrypts maximum length messages (280 chars)', () => {
    const plaintext = "a".repeat(280);
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    const decrypted = decryptMessage(encrypted, sharedSecret);
    
    if (decrypted !== plaintext) {
      throw new Error('Decryption failed for max length message');
    }
    if (decrypted.length !== 280) {
      throw new Error(`Expected 280 chars, got ${decrypted.length}`);
    }
    if (encrypted.length !== 12 + 280 + 16) {
      throw new Error(`Expected 308 bytes encrypted, got ${encrypted.length}`);
    }
    
    log(`  → Message length: ${plaintext.length} chars`, 'reset');
    log(`  → Encrypted size: ${encrypted.length} bytes (max allowed: 308)`, 'reset');
  });
  
  test('Handles Unicode and emojis correctly', () => {
    const plaintext = "👋 Hello! 你好 🚀 Solana ✨";
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    const decrypted = decryptMessage(encrypted, sharedSecret);
    
    if (decrypted !== plaintext) {
      throw new Error('Unicode characters not preserved');
    }
    
    log(`  → Unicode message: "${plaintext}"`, 'reset');
  });
  
  test('Different nonces produce different ciphertexts', () => {
    const plaintext = "Same message";
    const encrypted1 = encryptMessage(plaintext, sharedSecret, generateNonce(0));
    const encrypted2 = encryptMessage(plaintext, sharedSecret, generateNonce(1));
    
    if (Buffer.from(encrypted1).toString('hex') === Buffer.from(encrypted2).toString('hex')) {
      throw new Error('Same ciphertext for different nonces');
    }
    
    const decrypted1 = decryptMessage(encrypted1, sharedSecret);
    const decrypted2 = decryptMessage(encrypted2, sharedSecret);
    
    if (decrypted1 !== plaintext || decrypted2 !== plaintext) {
      throw new Error('Decryption failed with different nonces');
    }
    
    log(`  → Nonce 0 ciphertext: ${Buffer.from(encrypted1).toString('hex').slice(0, 40)}...`, 'reset');
    log(`  → Nonce 1 ciphertext: ${Buffer.from(encrypted2).toString('hex').slice(0, 40)}...`, 'reset');
  });
  
  // Test 4: Security Features
  log('\n📋 Test Suite 4: Security Features', 'blue');
  
  test('Fails decryption with wrong shared secret', () => {
    const userC = Keypair.generate();
    const keypairC = deriveEncryptionKeypair(userC.publicKey);
    
    const plaintext = "Secret message";
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    
    const wrongSecret = deriveSharedSecret(keypairC.privateKey, keypairA.publicKey);
    
    let failed = false;
    try {
      decryptMessage(encrypted, wrongSecret);
    } catch (error) {
      failed = true;
    }
    
    if (!failed) {
      throw new Error('Decryption should have failed with wrong secret');
    }
    
    log(`  → Poly1305 authentication works correctly`, 'reset');
  });
  
  test('Detects tampered ciphertext', () => {
    const plaintext = "Important message";
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    
    // Tamper with the ciphertext
    const tampered = new Uint8Array(encrypted);
    tampered[NONCE_LENGTH] ^= 0xFF;
    
    let failed = false;
    try {
      decryptMessage(tampered, sharedSecret);
    } catch (error) {
      failed = true;
    }
    
    if (!failed) {
      throw new Error('Should have detected tampering');
    }
    
    log(`  → Tampering detection works correctly`, 'reset');
  });
  
  test('Rejects messages that are too short', () => {
    const tooShort = new Uint8Array(20); // Less than NONCE + TAG
    
    let failed = false;
    try {
      decryptMessage(tooShort, sharedSecret);
    } catch (error: any) {
      if (error.message.includes('too short')) {
        failed = true;
      }
    }
    
    if (!failed) {
      throw new Error('Should reject short messages');
    }
  });
  
  // Test 5: Size Constraints
  log('\n📋 Test Suite 5: Size Constraints', 'blue');
  
  test('Encrypts messages up to 280 characters', () => {
    const plaintext = "a".repeat(280);
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    
    if (encrypted.length > 308) {
      throw new Error(`Encrypted size ${encrypted.length} exceeds 308 bytes`);
    }
    
    log(`  → 280 chars → ${encrypted.length} bytes encrypted`, 'reset');
  });
  
  test('Messages over 280 chars would exceed 308 byte limit', () => {
    const plaintext = "a".repeat(281);
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    
    if (encrypted.length <= 308) {
      throw new Error('Expected encrypted size to exceed 308 bytes');
    }
    
    log(`  → 281 chars → ${encrypted.length} bytes (exceeds limit)`, 'yellow');
  });
  
  // Test 6: Buffer Encoding (for Anchor)
  log('\n📋 Test Suite 6: Buffer Encoding for Anchor', 'blue');
  
  test('Converts Uint8Array to Buffer correctly', () => {
    const plaintext = "Test message";
    const nonce = generateNonce(0);
    const encrypted = encryptMessage(plaintext, sharedSecret, nonce);
    
    const buffer = Buffer.from(encrypted);
    
    if (buffer.length !== encrypted.length) {
      throw new Error('Buffer conversion changed length');
    }
    
    // Convert back to Uint8Array and decrypt
    const backToUint8 = new Uint8Array(buffer);
    const decrypted = decryptMessage(backToUint8, sharedSecret);
    
    if (decrypted !== plaintext) {
      throw new Error('Buffer round-trip failed');
    }
    
    log(`  → Uint8Array → Buffer → Uint8Array works correctly`, 'reset');
  });
  
  // Test 7: Real-world Scenarios
  log('\n📋 Test Suite 7: Real-world Scenarios', 'blue');
  
  test('Conversation between two users with multiple messages', () => {
    const messages = [
      { from: 'A', to: 'B', text: 'Hey! How are you?' },
      { from: 'B', to: 'A', text: 'Good! Just testing encryption 🔐' },
      { from: 'A', to: 'B', text: 'Nice! It works perfectly!' },
    ];
    
    let counter = 0;
    for (const msg of messages) {
      const nonce = generateNonce(counter++);
      const encrypted = encryptMessage(msg.text, sharedSecret, nonce);
      const decrypted = decryptMessage(encrypted, sharedSecret);
      
      if (decrypted !== msg.text) {
        throw new Error(`Message ${counter} failed: ${msg.text}`);
      }
    }
    
    log(`  → Successfully encrypted/decrypted ${messages.length} messages`, 'reset');
  });
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log(`Tests Passed: ${passed}`, 'green');
  log(`Tests Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('='.repeat(60) + '\n', 'cyan');
  
  if (failed === 0) {
    log('🎉 All tests passed! Encryption is working correctly!', 'green');
    log('\n✅ Ready to deploy to devnet\n', 'green');
    process.exit(0);
  } else {
    log('❌ Some tests failed. Please fix issues before deploying.', 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
