use anchor_lang::prelude::*;

declare_id!("8S5v7DvbagdFYZzDL9RGnmqHZ12CJynxkW3Wq374tHgj");

#[program]
pub mod pigeon_program {
    use super::*;

    pub fn send_dm(ctx: Context<SendDm>, text: String) -> Result<()> {
        let chat_account = &mut ctx.accounts.chat_account;
        let sender = &ctx.accounts.sender;

        // Guard for message size
        require!(text.len() <= 280, ChatError::MessageTooLong);

        // Initialize participants if this is a new chat
        if chat_account.participants == [Pubkey::default(), Pubkey::default()] {
            chat_account.participants = [*sender.key, ctx.accounts.receiver.key()];
        }

        // Append new message
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
        // 8 (discriminator) + 2*32 (participants) + 4 (vec len) + 10 messages * (32 pubkey + 4 str len + 280 text + 8 timestamp)
        space = 8 + 64 + 4 + (10 * (32 + 4 + 280 + 8)),
        seeds = [
            b"chat",
            sender.key().as_ref(),
            receiver.key().as_ref(),
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
    pub participants: [Pubkey; 2],
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
