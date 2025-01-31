import { StrictMode } from "react";
import { createRoot, ReactDOM } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "@/components/LoginContext";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>
);
