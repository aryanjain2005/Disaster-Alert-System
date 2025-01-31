import { StrictMode } from "react";
import { createRoot, ReactDOM } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "@/components/LoginContext";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <App />
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>
);
