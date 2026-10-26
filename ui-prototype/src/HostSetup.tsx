import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";

// Import your icon
import playerIcon from "./assets/player.svg";



// Scenario options
const THREATS = [
  "Zorgon the Conqueror",
  "The Hive Armada",
  "Rogue Captain",
  "Space Pirates",
  "Cyber Zombies",
  "Alien Brain Worms",
];

const THREAT_GOALS = [
  "Destroy / Corrupt",
  "Steal / Capture",
  "Bond with",
  "Protect / Empower",
  "Build / Synthesize",
  "Pacify / Occupy",
];

const OBJECTS = [
  "Space Pirate King/Queen",
  "Void Crystals",
  "Star Dreadnought",
  "Quantum Tunnel",
  "Ancient Space Ruin",
  "Alien Artifact",
];

const CONSEQUENCES = [
  "Destroy a solar system",
  "Reverse Time",
  "Enslave a planet",
  "Start a war / invasion",
  "Rip a hole in reality",
  "Fix Everything",
];

export default function HostSetup() {
  const navigate = useNavigate();

  const { selectedHost, setScenario } = useGlobalStore();

  const [threat, setThreat] = useState("");
  const [goal, setGoal] = useState("");
  const [objectItem, setObjectItem] = useState("");
  const [consequence, setConsequence] = useState("");
  const [notes, setNotes] = useState("");
  const [playerCount, setPlayerCount] = useState(4);

  if (!selectedHost) {
    return <div style={{ color: "#fff" }}>No host selected.</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Scenario Setup</h1>

      {/* TOP BOX — Player Visual */}
      <div style={styles.playerVisualBox}>
        {Array.from({ length: playerCount }).map((_, i) => (
          <img key={i} src={playerIcon} alt="" style={styles.playerVisualIcon} />
        ))}
      </div>

      {/* 2×2 GRID */}
      <div style={styles.grid}>
        {/* THREAT */}
        <div style={styles.card}>
          <label style={styles.label}>A THREAT…</label>
          <select
            style={styles.select}
            value={threat}
            onChange={(e) => setThreat(e.target.value)}
          >
            <option value="">Select Threat</option>
            {THREATS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* GOAL */}
        <div style={styles.card}>
          <label style={styles.label}>WANTS TO…</label>
          <select
            style={styles.select}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="">Select Goal</option>
            {THREAT_GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* OBJECT */}
        <div style={styles.card}>
          <label style={styles.label}>THE…</label>
          <select
            style={styles.select}
            value={objectItem}
            onChange={(e) => setObjectItem(e.target.value)}
          >
            <option value="">Select Object</option>
            {OBJECTS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* CONSEQUENCE */}
        <div style={styles.card}>
          <label style={styles.label}>WHICH WILL…</label>
          <select
            style={styles.select}
            value={consequence}
            onChange={(e) => setConsequence(e.target.value)}
          >
            <option value="">Select Outcome</option>
            {CONSEQUENCES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* NOTES BOX */}
      <div style={styles.notesSection}>
        <label style={styles.label}>Game Setup Notes</label>
        <textarea
          style={styles.textarea}
          placeholder="Write any custom rules, mission details, or GM notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* PLAYER NUMBER SELECTOR */}
      <div style={styles.playerIconRow}>
        {Array.from({ length: 6 }).map((_, i) => {
          const num = i + 1;
          const selected = num === playerCount;

          return (
            <div
              key={num}
              style={{
                ...styles.playerIconOption,
                ...(selected ? styles.playerIconSelected : {})
              }}
              onClick={() => setPlayerCount(num)}
            >
              <img src={playerIcon} alt="" style={styles.playerIconImage} />
              <div style={styles.playerIconNumber}>{num}</div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM BUTTONS */}
      <div style={styles.bottomRow}>
        <button style={styles.backButton} onClick={() => navigate("/lobby")}>
          ← Back
        </button>

        <button
            style={styles.confirmButton}
            onClick={() => {
                setScenario({
                threat,
                goal,
                objectItem,
                consequence,
                notes,
                playerCount,
                });

                navigate("/host");
            }}
            >
            Confirm
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "#4CC9A3",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial",
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
    marginBottom: "30px",
  },

  playerVisualBox: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    padding: "20px",
    backgroundColor: "#111",
    border: "2px solid #4CC9A3",
    borderRadius: "12px",
    marginBottom: "30px",
  },

  playerVisualIcon: {
    width: "40px",
    height: "40px",
    filter: "brightness(0) saturate(100%) invert(69%) sepia(12%) saturate(1290%) hue-rotate(109deg) brightness(96%) contrast(92%)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#111",
    border: "2px solid #4CC9A3",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "left",
  },

  label: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  select: {
    width: "100%",
    padding: "10px",
    background: "#000",
    color: "#fff",
    border: "2px solid #4CC9A3",
    borderRadius: "6px",
  },

  notesSection: {
    marginTop: "20px",
    marginBottom: "20px",
    textAlign: "left",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    backgroundColor: "#000",
    color: "#fff",
    border: "2px solid #4CC9A3",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  playerIconRow: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
    marginBottom: "40px",
  },

  playerIconOption: {
    width: "70px",
    height: "90px",
    backgroundColor: "#111",
    border: "2px solid #4CC9A3",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  playerIconSelected: {
    backgroundColor: "#4CC9A3",
    border: "2px solid #FFFFFF",
    boxShadow: "0 0 12px rgba(255,255,255,0.6)",
  },

  playerIconImage: {
    width: "36px",
    height: "36px",
    marginBottom: "6px",
    pointerEvents: "none",
  },

  playerIconNumber: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  backButton: {
    padding: "12px 24px",
    backgroundColor: "#222",
    color: "#4CC9A3",
    border: "2px solid #4CC9A3",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  confirmButton: {
    padding: "12px 24px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
