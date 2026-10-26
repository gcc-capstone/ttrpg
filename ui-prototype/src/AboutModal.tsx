import React, { useState } from "react";

const sections = {
  "Players: Create Characters": [
    "Choose a style",
    "Choose a role",
    "Choose your number",
    "Give your character a name",
    "Player goal",
    "Character goal"
  ],
  "Players: Create the Ship": [
    "Pick two strengths",
    "Pick one problem"
  ],
  "Rolling the Dice": [
    "How rolls work",
    "Laser Feelings",
    "Helping"
  ],
  "GM: Create a Space Adventure": [
    "Threat tables",
    "Adventure structure"
  ],
  "GM: Run the Game": [
    "Play to find out",
    "Show signs of danger",
    "Ask questions"
  ]
};

export default function AboutModal({ onClose }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {!activeSection && (
          <>
            <h2 style={styles.title}>About the Game</h2>

            {Object.keys(sections).map((section) => (
              <button
                key={section}
                style={styles.sectionButton}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}

            <button style={styles.closeButton} onClick={onClose}>Close</button>
          </>
        )}

        {activeSection && (
          <>
            <h2 style={styles.title}>{activeSection}</h2>

            <ul style={styles.list}>
              {sections[activeSection].map((item, i) => (
                <li key={i} style={styles.listItem}>{item}</li>
              ))}
            </ul>

            <button
              style={styles.backButton}
              onClick={() => setActiveSection(null)}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#111",
    border: "3px solid #4CC9A3",
    borderRadius: "12px",
    padding: "30px",
    width: "400px",
    color: "#4CC9A3",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  sectionButton: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  },
  list: {
    textAlign: "left",
    marginBottom: "20px",
  },
  listItem: {
    marginBottom: "8px",
    color: "#CCC",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  },
  closeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  }
};
