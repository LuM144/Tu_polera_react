import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fontsource/nunito-sans/latin-400.css";
import "@fontsource/nunito-sans/latin-600.css";
import "@fontsource/nunito-sans/latin-700.css";
import "@fontsource/nunito-sans/latin-800.css";
import "@fontsource/nunito-sans/latin-900.css";
import "./assets/styles/admin.css";
import "./assets/styles/tienda.css";
import "./assets/styles/FichaPrenda.css";
import "./assets/styles/SelectorDireccion.css";
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
