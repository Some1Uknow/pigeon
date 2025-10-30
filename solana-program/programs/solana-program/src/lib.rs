use anchor_lang::prelude::*;

declare_id!("9v4KnCjYJSTe7Cgt2JdNnDkkUJFADZrAkUPapfrh8N4N");

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
        require!(encrypted_text.len() <= 308, ChatError::MessageTooLong);
        require!(!encrypted_text.is_empty(), ChatError::EmptyMessage);

        // Check if chat is full
        require!(chat_account.messages.len() < 10, ChatError::ChatFull);

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

        // Append new encrypted message
        chat_account.messages.push(DirectMessage {
            sender: *authority.key,
            encrypted_text,
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
        // 8 (discriminator) + 64 (participants) + 4 (vec len) + 10 messages * 352 bytes each
        // Each message: 32 (pubkey) + 4 (vec len) + 308 (encrypted_text) + 8 (timestamp) = 352 bytes
        space = 8 + 64 + 4 + (10 * 352),
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
    pub encrypted_text: Vec<u8>,
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
