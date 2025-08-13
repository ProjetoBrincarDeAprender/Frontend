import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { Toaster } from "./components/ui/sonner";
import { UserProvider } from "./contexts/User/provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
    <Toaster position="bottom-right" />
  </StrictMode>,
);
