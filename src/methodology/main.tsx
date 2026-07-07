import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MethodologyPage } from "./page";
import "../ui/components.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MethodologyPage />
    </StrictMode>,
  );
}
