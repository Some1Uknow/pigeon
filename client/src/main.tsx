import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { WalletContextProvider } from "./components/WalletContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
