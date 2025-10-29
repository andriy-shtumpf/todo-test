/**
 * Application entry point
 * - Renders the main App component into the root DOM element
 * - Wrapped in React.StrictMode for development warnings
 * - Imports global styles from index.css
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
