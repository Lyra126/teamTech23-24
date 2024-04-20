import { StrictMode, React } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import App from "./App";

// Instead of ReactDOM.render, use createRoot
const root = createRoot(document.getElementById('root'));

// Render your app using the new root API
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
