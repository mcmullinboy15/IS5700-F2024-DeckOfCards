import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import ChatComponent from "./components/ChatComponent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ChatComponent chatName="Global Chat" />
  </StrictMode>
);
