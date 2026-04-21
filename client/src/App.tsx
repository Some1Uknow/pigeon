import { Navigate, Routes, Route, useParams } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./pages/Home";
import DesignSample from "./pages/DesignSample";

const AppShell = lazy(() => import("./pages/AppShell"));
const ChatWorkspace = lazy(() => import("./pages/ChatWorkspace"));
const SwapWorkspace = lazy(() => import("./pages/SwapWorkspace"));
const TransferWorkspace = lazy(() => import("./pages/TransferWorkspace"));

function LegacyChatRedirect() {
  const { receiver } = useParams();
  return (
    <Navigate
      to={receiver ? `/app/chats/${receiver}` : "/app/chats"}
      replace
    />
  );
}

function App() {
  return (
  <Suspense fallback={
    <div className="app-bg flex min-h-screen items-center justify-center font-display text-2xl uppercase text-[var(--color-text)]">
      &gt; INITIALIZING_SYSTEM<span className="animate-pulse">_</span>
    </div>
  }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/chats" replace />} />
          <Route path="chats" element={<ChatWorkspace />} />
          <Route path="chats/:receiver" element={<ChatWorkspace />} />
          <Route path="swap" element={<SwapWorkspace />} />
          <Route path="transfer" element={<TransferWorkspace />} />
        </Route>
        <Route path="/chat" element={<LegacyChatRedirect />} />
        <Route path="/chat/:receiver" element={<LegacyChatRedirect />} />
        <Route path="/chats" element={<LegacyChatRedirect />} />
        <Route path="/chats/:receiver" element={<LegacyChatRedirect />} />
        <Route path="/swap" element={<Navigate to="/app/swap" replace />} />
        <Route path="/transfer" element={<Navigate to="/app/transfer" replace />} />
        <Route path="/design-sample" element={<DesignSample />} />
      </Routes>
    </Suspense>
  );
}

export default App;
