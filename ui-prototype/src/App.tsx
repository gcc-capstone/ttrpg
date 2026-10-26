import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { GlobalStoreProvider } from "./GlobalStore";
import StartScreen from "./StartScreen";
import StyleGuide from "./StyleGuide";
import HostScreen from "./HostScreen";
import ClientScreen from "./ClientScreen";
import SessionLobby from "./SessionLobby";
import RequireLobby from "./RequireLobby";
import HostSetup from "./HostSetup";

export default function App() {
  return (
    <GlobalStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/lobby" element={<SessionLobby />} />
          <Route path="/host-setup" element={<HostSetup />} />

          <Route
            path="/host"
            element={
              <RequireLobby>
                <HostScreen />
              </RequireLobby>
            }
          />

          <Route
            path="/client1"
            element={
              <RequireLobby>
                <ClientScreen clientId={1} />
              </RequireLobby>
            }
          />

          <Route
            path="/client2"
            element={
              <RequireLobby>
                <ClientScreen clientId={2} />
              </RequireLobby>
            }
          />

          <Route path="/style" element={<StyleGuide />} />
        </Routes>
      </BrowserRouter>
    </GlobalStoreProvider>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "transparent",
    minHeight: "100vh",
    padding: "0",
    margin: "0",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: "0",
    marginBottom: "0",
  },
  navLogo: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#4CC9A3",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
  navButton: {
    backgroundColor: "transparent",
    color: "#4CC9A3",
    border: "2px solid #4CC9A3",
    borderRadius: "6px",
    padding: "6px 10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },
  content: {
    marginTop: "0",
  },
};
