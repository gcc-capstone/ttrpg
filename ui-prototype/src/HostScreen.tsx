import React from "react";
import { useGlobalStore } from "./GlobalStore";

export default function HostScreen() {
  const {
    characters,
    messages,
    createHost,
    selectedHost,
    hosts
  } = useGlobalStore();

  // Register this host session only once
  React.useEffect(() => {
    // If this host already exists, do nothing
    if (selectedHost) return;

    // Create a new host session
    createHost("Host");
  }, []);

  return (
    <div style={styles.page}>
      {/* LEFT SIDE — angled portraits */}
      <div style={styles.leftColumn}>
        {characters.length === 0 && (
          <>
            <div style={styles.portraitCard}>Portrait 1</div>
            <div style={styles.portraitCard}>Portrait 2</div>
            <div style={styles.portraitCard}>Portrait 3</div>
          </>
        )}

        {characters.map((c, i) => (
          <div key={i} style={styles.portraitCard}>
            {c.name}
          </div>
        ))}
      </div>

      {/* CENTER — AI Response + Player Action + Chat Log */}
      <div style={styles.centerColumn}>
        <div style={styles.centerBox}>
          <h2 style={styles.centerHeading}>AI Response</h2>
          <p style={styles.centerText}>
            The AI GM describes the next scene or reacts to player actions.
          </p>
        </div>

        <div style={styles.centerBox}>
          <h2 style={styles.centerHeading}>Player Action</h2>
          <p style={styles.centerText}>
            Player actions appear here as they are submitted.
          </p>
        </div>

        <div style={styles.centerBox}>
          <h2 style={styles.centerHeading}>Live Chat Log</h2>

          <div style={styles.chatLog}>
            {messages.length === 0 && (
              <div style={styles.chatEmpty}>No messages yet.</div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={styles.chatLine}>
                <strong>{m.from.includes("client") ? m.from : "GM"}:</strong>{" "}
                {m.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Persona-style party status */}
      <div style={styles.rightColumn}>
        {characters.length === 0 && (
          <div style={styles.noPlayers}>No characters created yet.</div>
        )}

        {characters.map((c, i) => (
          <div key={i} style={styles.statusCard}>
            <div style={styles.statusPortrait}>P</div>

            <div style={styles.statusInfo}>
              <div style={styles.statusName}>{c.name}</div>
              <div style={styles.statusSub}>{c.style} {c.class}</div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM — color palette */}
      <div style={styles.paletteRow}>
        {["#2F4F3A", "#4A6B52", "#7C8F6A", "#B4473A", "#8C3A2F", "#5A3A2F"].map(
          (color, i) => (
            <div key={i} style={{ ...styles.swatch, backgroundColor: color }} />
          )
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gridTemplateRows: "auto 80px",
    height: "100vh",
    backgroundColor: "#000000",
    fontFamily: "Arial, sans-serif",
    color: "#E0E0E0",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
  },
  portraitCard: {
    backgroundColor: "#1A1A1A",
    color: "#FFFFFF",
    height: "130px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "skew(-10deg)",
    fontSize: "20px",
    fontWeight: 700,
    border: "3px solid #4CC9A3",
    boxShadow: "0 0 12px rgba(76, 201, 255, 0.4)",
  },

  centerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "20px",
  },
  centerBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: "12px",
    padding: "20px",
    border: "3px solid #4CC9A3",
    boxShadow: "0 0 12px rgba(76, 201, 255, 0.4)",
    height: "100%",
  },
  centerHeading: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#4CC9A3",
  },
  centerText: {
    fontSize: "16px",
    lineHeight: 1.4,
    color: "#CCCCCC",
  },

  chatLog: {
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#0F0F0F",
    padding: "10px",
    borderRadius: "8px",
    border: "2px solid #4CC9A3",
  },
  chatLine: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#E0E0E0",
  },
  chatEmpty: {
    fontStyle: "italic",
    color: "#777",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
  },
  noPlayers: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#888",
  },
  statusCard: {
    display: "flex",
    backgroundColor: "#1A1A1A",
    borderRadius: "12px",
    padding: "14px",
    border: "3px solid #4CC9A3",
    gap: "14px",
    boxShadow: "0 0 12px rgba(76, 201, 255, 0.4)",
  },
  statusPortrait: {
    width: "60px",
    height: "60px",
    backgroundColor: "#4CC9A3",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    fontWeight: 700,
    fontSize: "20px",
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    fontWeight: 700,
    marginBottom: "4px",
    fontSize: "18px",
    color: "#FFFFFF",
  },
  statusSub: {
    fontSize: "14px",
    marginBottom: "10px",
    color: "#CCCCCC",
  },

  paletteRow: {
    gridColumn: "1 / span 3",
    display: "flex",
    gap: "12px",
    padding: "12px",
    justifyContent: "center",
  },
  swatch: {
    width: "60px",
    height: "30px",
    borderRadius: "6px",
    border: "2px solid #4CC9A3",
    boxShadow: "0 0 8px rgba(76, 201, 255, 0.4)",
  },
};
