import type { FormEvent } from "react";

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
  if (!showModal) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;
    const message = formData.get("message") as string;
    onStartChat(address.trim(), message.trim() || "👋 Hey there!");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-none flex items-center justify-center z-50">
      <div className="bg-black border border-[var(--color-term-green)] p-1 w-96 shadow-[4px_4px_0px_var(--color-term-dim)]">
        <div className="bg-[var(--color-term-green)] text-black px-4 py-2 font-display font-bold uppercase tracking-widest text-lg mb-4 flex justify-between items-center">
          <span>INIT_SESSION</span>
          <button onClick={onClose} className="hover:text-white">X</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[var(--color-term-green)] text-xs font-display uppercase tracking-widest">Target Address</label>
            <input
              name="address"
              placeholder="ENTER_WALLET_ADDRESS"
              required
              className="w-full bg-black border border-[var(--color-term-dim)] rounded-none px-4 py-3 outline-none text-[var(--color-term-green)] placeholder:text-[var(--color-term-dim)] font-body focus:border-[var(--color-term-green)]"
            />
          </div>
          
          <div className="space-y-2">
             <label className="text-[var(--color-term-green)] text-xs font-display uppercase tracking-widest">Initial Payload</label>
            <textarea
              name="message"
              placeholder="ENTER_MESSAGE..."
              className="w-full bg-black border border-[var(--color-term-dim)] rounded-none px-4 py-3 h-24 outline-none text-[var(--color-term-green)] placeholder:text-[var(--color-term-dim)] font-body focus:border-[var(--color-term-green)] resize-none"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[var(--color-term-dim)] text-[var(--color-term-dim)] hover:border-[var(--color-term-green)] hover:text-[var(--color-term-green)] font-display uppercase tracking-widest text-sm disabled:opacity-50"
            >
              [ CANCEL ]
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[var(--color-term-green)] text-black font-display font-bold uppercase tracking-widest text-sm hover:bg-white disabled:opacity-50 min-w-24"
            >
              {loading ? "INIT..." : "[ START ]"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
