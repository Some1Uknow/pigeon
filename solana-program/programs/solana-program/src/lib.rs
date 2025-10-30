use anchor_lang::prelude::*;
use core::convert::TryFrom;

declare_id!("9v4KnCjYJSTe7Cgt2JdNnDkkUJFADZrAkUPapfrh8N4N");

pub const MAX_PLAINTEXT_LEN: usize = 280;
pub const NONCE_LEN: usize = 12;
pub const AUTH_TAG_LEN: usize = 16;
pub const MAX_ENCRYPTED_MESSAGE_LEN: usize = NONCE_LEN + MAX_PLAINTEXT_LEN + AUTH_TAG_LEN; // 308 bytes
pub const MAX_MESSAGES_PER_CHAT: usize = 10;
pub const DIRECT_MESSAGE_SIZE: usize = 32 /* sender pubkey */
    + MAX_ENCRYPTED_MESSAGE_LEN /* encrypted payload */
    + 2 /* payload length */
    + 8; /* timestamp */
pub const CHAT_ACCOUNT_SIZE: usize = 8 /* discriminator */
    + 64 /* participants */
    + 4 /* vec len prefix */
    + (MAX_MESSAGES_PER_CHAT * DIRECT_MESSAGE_SIZE);

fn ordered_keys(a: &Pubkey, b: &Pubkey) -> (Pubkey, Pubkey) {
    if a.as_ref() <= b.as_ref() {
        (*a, *b)
    } else {
        (*b, *a)
    }
}

#[program]
pub mod pigeon_program {
    use super::*;

    pub fn send_dm(ctx: Context<SendDm>, encrypted_text: Vec<u8>) -> Result<()> {
        let chat_account = &mut ctx.accounts.chat_account;
        let authority = &ctx.accounts.authority;
        let participant_a = &ctx.accounts.participant_a;
        let participant_b = &ctx.accounts.participant_b;

        // Guard for encrypted message size
        // Max: 12 (nonce) + 280 (ciphertext) + 16 (auth tag) = 308 bytes
        let encrypted_len = encrypted_text.len();
        require!(encrypted_len <= MAX_ENCRYPTED_MESSAGE_LEN, ChatError::MessageTooLong);
        require!(!encrypted_text.is_empty(), ChatError::EmptyMessage);

        // Check if chat is full
        require!(chat_account.messages.len() < MAX_MESSAGES_PER_CHAT, ChatError::ChatFull);

        // Enforce canonical ordering for participants (lexicographic)
        require!(participant_a.key().as_ref() <= participant_b.key().as_ref(), ChatError::InvalidParticipants);

        // Ensure the signer is one of the chat participants
        let authority_key = authority.key();
        require!(
            authority_key == participant_a.key() || authority_key == participant_b.key(),
            ChatError::UnauthorizedSender
        );

        // Resolve ordered pair
        let (first, second) = ordered_keys(&participant_a.key(), &participant_b.key());

        // Initialize participants if this is a new chat
        if chat_account.participants == [Pubkey::default(), Pubkey::default()] {
            chat_account.participants = [first, second];
        } else {
            require!(chat_account.participants == [first, second], ChatError::InvalidParticipants);
        }

        // Clear legacy message formats from earlier deployments to avoid corrupt state
        if chat_account
            .messages
            .iter()
            .any(|msg| msg.payload_len == 0 || (msg.payload_len as usize) > MAX_ENCRYPTED_MESSAGE_LEN)
        {
            msg!("Detected legacy chat layout, resetting stored messages");
            chat_account.messages.clear();
        }

        // Copy encrypted payload into fixed-size buffer to avoid dynamic reallocations
        let mut payload = [0u8; MAX_ENCRYPTED_MESSAGE_LEN];
        payload[..encrypted_len].copy_from_slice(&encrypted_text);

        chat_account.messages.push(DirectMessage {
            sender: *authority.key,
            encrypted_payload: payload,
            payload_len: u16::try_from(encrypted_len).map_err(|_| ChatError::MessageTooLong)?,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendDm<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        // Pre-allocate space for the chat account + 10 fixed-size encrypted messages.
        space = CHAT_ACCOUNT_SIZE,
        seeds = [
            b"chat",
            participant_a.key().as_ref(),
            participant_b.key().as_ref(),
        ],
        bump
    )]
    pub chat_account: Account<'info, ChatAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: canonical participant (lexicographically smaller)
    pub participant_a: UncheckedAccount<'info>,

    /// CHECK: canonical participant (lexicographically larger)
    pub participant_b: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct ChatAccount {
    pub participants: [Pubkey; 2],
    pub messages: Vec<DirectMessage>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DirectMessage {
    pub sender: Pubkey,
    pub encrypted_payload: [u8; MAX_ENCRYPTED_MESSAGE_LEN],
    pub payload_len: u16,
    pub timestamp: i64,
}

#[error_code]
pub enum ChatError {
    #[msg("Message too long!")]
    MessageTooLong,
    #[msg("Message cannot be empty!")]
    EmptyMessage,
    #[msg("Chat is full! Maximum 10 messages reached.")]
    ChatFull,
    #[msg("Chat participants do not match expected addresses.")]
    InvalidParticipants,
    #[msg("Only chat participants can send messages.")]
    UnauthorizedSender,
}
