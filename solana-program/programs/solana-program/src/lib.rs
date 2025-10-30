use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

pub use errors::ChatError;
pub use state::{ChatAccount, DirectMessage};

declare_id!("9v4KnCjYJSTe7Cgt2JdNnDkkUJFADZrAkUPapfrh8N4N");

#[program]
pub mod pigeon_program {
    use super::*;

    pub fn send_dm(ctx: Context<SendDm>, encrypted_text: Vec<u8>) -> Result<()> {
        instructions::send_dm::handler(ctx, encrypted_text)
    }
}

#[derive(Accounts)]
pub struct SendDm<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        // Pre-allocate space for the chat account + 10 fixed-size encrypted messages.
        space = constants::CHAT_ACCOUNT_SIZE,
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
