import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AboutModal from "./AboutModal";

import bg1 from "./assets/bg1.png";
import bg2 from "./assets/bg2.png";
import bg3 from "./assets/bg3.jpg";

const backgroundImages = [bg1, bg2, bg3];

export default function StartScreen() {
  const [index, setIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `url(${backgroundImages[index]})`,
      }}
    >
      <div style={styles.leftColumn}>
        <Link to="/lobby" style={styles.button}>Play</Link>
        <button style={styles.button} onClick={() => setShowAbout(true)}>
          About
        </button>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",                 // prevents overflow
    backgroundSize: "100% 100%",   // forces full stretch
    backgroundPosition: "left top",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    paddingLeft: "40px",           // safe spacing
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  button: {
    backgroundColor: "#4CC9A3",
    color: "#000",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    width: "160px",
    textAlign: "center",
    textDecoration: "none",
  }
};
