import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
 
import App from "./app/App";
import "./styles/index.css";
import './styles/tailwind.css';
import './styles/default_shadcn_theme.css';
import './styles/fonts.css';
import './styles/theme.css';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const root = document.getElementById("root");

// if (!root) {
//   throw new Error("Root element not found");
// }

// createRoot(root).render(<App />);