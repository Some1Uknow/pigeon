use anchor_lang::prelude::*;

declare_id!("B1kqTcmKKi44qPBjpnCM1yJyvunrfkwRvQLuEKdKLAbj");

#[program]
pub mod pigeon_program {
    use super::*;

    pub fn send_dm(ctx: Context<SendDm>, text: String) -> Result<()> {
        let chat_account = &mut ctx.accounts.chat_account;
        let sender = &ctx.accounts.sender;

        // Guard for message size
        require!(text.len() <= 280, ChatError::MessageTooLong);

        chat_account.messages.push(DirectMessage {
            sender: *sender.key,
            text,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendDm<'info> {
    #[account(
        init_if_needed,
        payer = sender,
        // Large enough space for 100 messages (each ~324 bytes)
        space = 8 + 4 + (100 * (32 + 4 + 280 + 8)),
        seeds = [
            b"chat",
            sorted_keys(&sender.key(), &receiver.key()).0.as_ref(),
            sorted_keys(&sender.key(), &receiver.key()).1.as_ref(),
        ],
        bump
    )]
    pub chat_account: Account<'info, ChatAccount>,

    #[account(mut)]
    pub sender: Signer<'info>,

    /// CHECK: receiver doesn’t need to sign
    pub receiver: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct ChatAccount {
    pub messages: Vec<DirectMessage>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DirectMessage {
    pub sender: Pubkey,
    pub text: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ChatError {
    #[msg("Message too long!")]
    MessageTooLong,
}

// ✅ Helper to ensure deterministic PDA between both users
fn sorted_keys(a: &Pubkey, b: &Pubkey) -> (Pubkey, Pubkey) {
    if a.to_string() < b.to_string() {
        (*a, *b)
    } else {
        (*b, *a)
    }
}

// build and test this