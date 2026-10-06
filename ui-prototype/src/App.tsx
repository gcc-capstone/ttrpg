import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { GlobalStoreProvider } from "./GlobalStore";
import StyleGuide from "./StyleGuide";
import HostScreen from "./HostScreen";
import ClientScreen from "./ClientScreen";
import SessionLobby from "./SessionLobby";
import RequireLobby from "./RequireLobby";

export default function App() {
  return (
    <GlobalStoreProvider>
      <BrowserRouter>
        <div style={styles.page}>
          <header style={styles.nav}>
            <div style={styles.navLogo}>AI GM Prototype</div>

            <nav style={styles.navLinks}>
              <Link to="/lobby" style={styles.navButton}>Lobby</Link>
              <Link to="/style" style={styles.navButton}>Style Guide</Link>
            </nav>
          </header>

          <div style={styles.content}>
            <Routes>
              {/* LOBBY */}
              <Route path="/" element={<SessionLobby />} />
              <Route path="/lobby" element={<SessionLobby />} />

              {/* HOST (protected) */}
              <Route
                path="/host"
                element={
                  <RequireLobby>
                    <HostScreen />
                  </RequireLobby>
                }
              />

              {/* CLIENTS (protected) */}
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

              <Route
                path="/client"
                element={
                  <RequireLobby>
                    <ClientScreen />
                  </RequireLobby>
                }
              />

              {/* STYLE GUIDE */}
              <Route path="/style" element={<StyleGuide />} />
            </Routes>
          </div>
        </div>
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
