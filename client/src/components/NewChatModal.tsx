import { useEffect, type FormEvent } from "react";

interface NewChatModalProps {
  showModal: boolean;
  onClose: () => void;
  onStartChat: (address: string, message: string) => void;
  loading: boolean;
}

export default function NewChatModal({
  showModal,
  onClose,
  onStartChat,
  loading,
}: NewChatModalProps) {
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showModal, onClose]);

  if (!showModal) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;
    const message = formData.get("message") as string;
    onStartChat(address.trim(), message.trim() || "Hey there!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,5,5,0.78)] p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-xl p-1">
        <div className="flex items-center justify-between border-b border-[rgba(119,117,117,0.16)] px-4 py-3 font-display text-lg font-bold uppercase text-[var(--color-text)]">
          <span>INIT_SESSION</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-text)]"
            aria-label="Close new chat modal"
          >
            X
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="new-chat-address" className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Target Address</label>
            <input
              id="new-chat-address"
              name="address"
              placeholder="ENTER_WALLET_ADDRESS"
              required
              autoComplete="off"
              className="h-12 w-full rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-secondary)]"
            />
          </div>
          
          <div className="space-y-2">
             <label htmlFor="new-chat-message" className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Initial Payload</label>
            <textarea
              id="new-chat-message"
              name="message"
              placeholder="ENTER_MESSAGE..."
              className="min-h-28 w-full resize-none rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-secondary)]"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary min-h-11 px-4 text-xs disabled:opacity-50"
            >
              [ CANCEL ]
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-h-11 min-w-28 px-5 text-xs disabled:opacity-50"
            >
              {loading ? "INIT..." : "[ START ]"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
