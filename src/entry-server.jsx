import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export { ORIGIN, ROUTES } from "./routes.js";

export function render(path) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
