import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ChatWindow } from "../components";
import { useAppShellContext } from "./appShellContext";

export default function ChatWorkspace() {
  const { receiver } = useParams();
  const {
    chat,
    wallet,
    input,
    onInputChange,
    onSendMessage,
    balance,
    connection,
  } = useAppShellContext();
  const { activeChat, loading, openChat } = chat;

  useEffect(() => {
    if (!receiver || receiver === activeChat?.receiver) return;
    void openChat(receiver);
  }, [receiver, activeChat?.receiver, openChat]);

  return (
    <ChatWindow
      activeChat={activeChat}
      wallet={wallet}
      input={input}
      onInputChange={onInputChange}
      onSendMessage={onSendMessage}
      loading={loading}
      balance={balance}
      connection={connection}
    />
  );
}
