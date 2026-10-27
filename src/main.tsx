import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { appPath } from "./sitePaths";
import "./styles.css";

const root = document.getElementById("root")!;
const legacy =
  new URLSearchParams(location.search).get("version") === "previous" ||
  appPath(location.pathname).startsWith("/previous");
const app = (
  <StrictMode>
    <App initialPath={appPath(location.pathname)} legacy={legacy} />
  </StrictMode>
);
if (root.hasChildNodes() && !legacy) hydrateRoot(root, app);
else createRoot(root).render(app);
