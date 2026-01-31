import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./pages/Home";
// Lazy-load Chats to avoid evaluating heavy Solana/Anchor deps on initial load
const Chats = lazy(() => import("./pages/Chats"));

function App() {
  return (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-term-bg)] text-[var(--color-term-green)] font-display text-2xl tracking-widest uppercase">
      &gt; INITIALIZING_SYSTEM<span className="animate-pulse">_</span>
    </div>
  }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </Suspense>
  );
}

export default App;
