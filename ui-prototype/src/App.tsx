import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { GlobalStoreProvider } from "./GlobalStore";
import StyleGuide from "./StyleGuide";
import HostScreen from "./HostScreen";
import ClientScreen from "./ClientScreen";

export default function App() {
  return (
    <GlobalStoreProvider>
      <BrowserRouter>
        <div style={styles.page}>
          <header style={styles.nav}>
            <div style={styles.navLogo}>AI GM Prototype</div>

            <nav style={styles.navLinks}>
              <Link to="/style" style={styles.navButton}>Style Guide</Link>
              <Link to="/host" style={styles.navButton}>Host</Link>
              <Link to="/client" style={styles.navButton}>Client</Link>
            </nav>
          </header>

          <div style={styles.content}>
            <Routes>
              <Route path="/" element={<StyleGuide />} />
              <Route path="/style" element={<StyleGuide />} />
              <Route path="/host" element={<HostScreen />} />
              <Route path="/client" element={<ClientScreen />} />
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
    backgroundColor: "#F7F5F0",
    minHeight: "100vh",
    padding: "16px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2F4F3A",
    color: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  navLogo: {
    fontSize: "18px",
    fontWeight: 700,
  },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
  navButton: {
    backgroundColor: "#B4473A",
    color: "#FFFFFF",
    borderRadius: "6px",
    padding: "6px 10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },
  content: {
    marginTop: "8px",
  },
};
