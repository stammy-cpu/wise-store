import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear cart only once
if (!localStorage.getItem('cart_cleared_v2')) {
  localStorage.removeItem('cart');
  localStorage.setItem('cart_cleared_v2', 'true');
}

createRoot(document.getElementById("root")!).render(<App />);
