import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import AlertProvider from "./contexts/AlertContext.tsx";
import { ApplicationProvider } from "./contexts/ApplicationContext.tsx";
import { CenterProvider } from "./contexts/CenterContext.tsx";
import "./i18n.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <ApplicationProvider>
            <CenterProvider>
              <App />
            </CenterProvider>
          </ApplicationProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
