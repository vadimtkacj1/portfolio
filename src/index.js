import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// for freelancehunt
const freelancehuntMeta = document.createElement('meta');
freelancehuntMeta.name = 'freelancehunt';
freelancehuntMeta.content = '79c1e4fa4630159';
document.head.appendChild(freelancehuntMeta);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
