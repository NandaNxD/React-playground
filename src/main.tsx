import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import Clarity from "@microsoft/clarity";

const projectId = "yq1ser45ryn";

Clarity.init(projectId);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </StrictMode>
);
