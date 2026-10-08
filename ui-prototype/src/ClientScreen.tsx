import React, { useState } from "react";
import { useGlobalStore } from "./GlobalStore";

export default function ClientScreen({ clientId }: { clientId?: number }) {
  const {
  addCharacter,
  addMessage,
  messages,
  queue,
  enterQueue,
  endTurn,
  helpUser,
  leaveQueue,
} = useGlobalStore();


  const [mode, setMode] = useState<"create" | "preview" | "chat">("create");
  const [waitingForRoll, setWaitingForRoll] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [showHelpOptions, setShowHelpOptions] = useState(false);

  const [character, setCharacter] = useState({
    name: "",
    style: "",
    class: "",
    number: 2,
    background: "",
  });

  const [text, setText] = useState("");
  const [showStats, setShowStats] = useState(false);

  const randomNames = [
    "Sparks McGee",
    "Nova Straylight",
    "Kade Hollow",
    "Seren Ashfall",
    "Vexa Ionblade",
    "Rook Starborn",
    "Juno Drift"
  ];

  const isInQueue =
  clientId !== undefined &&
  queue.some((member) => member.clientId === clientId);

const isMyTurn =
  clientId !== undefined &&
  queue.length > 0 &&
  queue[0].clientId === clientId;

const helpTargets =
  clientId === undefined
    ? []
    : queue.filter(
        (member) =>
          member.clientId !== clientId &&
          member.helperClientId === undefined
      );

const canHelpUser =
  clientId !== undefined &&
  !isMyTurn &&
  helpTargets.length > 0;

const handleEnterQueue = () => {
  if (clientId === undefined || isInQueue) return;

  enterQueue({
    clientId,
    characterName: character.name,
  });

  addMessage({
    from: `client${clientId}`,
    text: `${character.name} entered the player queue.`,
  });
};

const handleLeaveQueue = () => {
  if (clientId === undefined || !isInQueue) return;

  leaveQueue(clientId);

  addMessage({
    from: `client${clientId}`,
    text: `${character.name} left the player queue.`,
  });
};

const handleHelpUser = (targetClientId: number) => {
  if (!canHelpUser || clientId === undefined) return;

  const target = queue.find(
    (member) => member.clientId === targetClientId
  );

  if (!target) return;

  helpUser(clientId, targetClientId);

  addMessage({
    from: `client${clientId}`,
    text: `${character.name} is helping ${target.characterName}.`,
  });

  setShowHelpOptions(false);
};

const handleAction = (action: string) => {
  if (!isMyTurn) return;

  addMessage({
    from: `client${clientId}`,
    text: `Action: ${action}`,
  });

  // These actions require a dice roll.
  const requiresRoll =
    action === "Attack" ||
    action === "Investigate";

  if (requiresRoll) {
    setWaitingForRoll(true);
    setLastRoll(null);

    addMessage({
      from: "gm",
      text: `${action} requires a roll. Roll the dice to resolve your action.`,
    });

    return;
  }

  // Actions such as Defend or Negotiate can resolve immediately.
  addMessage({
    from: "gm",
    text: `Your ${action.toLowerCase()} action is resolved. Your turn is over.`,
  });

  endTurn(clientId!);
};

const handleRoll = () => {
  if (!isMyTurn || !waitingForRoll || clientId === undefined) return;

  const roll = Math.floor(Math.random() * 6) + 1;

  setLastRoll(roll);
  setWaitingForRoll(false);

  addMessage({
    from: `client${clientId}`,
    text: `Rolled a ${roll}.`,
  });

  addMessage({
    from: "gm",
    text: `The action is resolved with a roll of ${roll}. Your turn is over.`,
  });

  endTurn(clientId);
};

  const randomizeName = () => {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    setCharacter((prev) => ({ ...prev, name }));
  };

  const gmSuggestedStyles = ["Heroic", "Savvy", "Dangerous"];
  const gmSuggestedRoles = ["Explorer", "Scientist", "Pilot"];

  const goToPreview = () => {
    if (!character.name || !character.style || !character.class) return;
    setMode("preview");
  };

  const finalizeCharacter = () => {
    addCharacter({ ...character, clientId });

    addMessage({ from: "gm", text: `Welcome, ${character.name}. Your journey begins now.` });
    addMessage({ from: "gm", text: `You are a ${character.style} ${character.class} with a number of ${character.number}.` });
    addMessage({ from: "gm", text: "Describe your first action to enter the world." });

    setMode("chat");
  };

  const sendMessage = () => {
  if (!text.trim() || !isMyTurn || waitingForRoll) return;

  addMessage({
    from: `client${clientId ?? ""}`,
    text,
  });

  addMessage({
    from: "gm",
    text: "The scene shifts as your action influences the unfolding narrative.",
  });

  endTurn(clientId!);
  setText("");
};

  const sendAction = (action: string) => {
    addMessage({ from: `client${clientId ?? ""}`, text: `Action: ${action}` });
    addMessage({ from: "gm", text: "Your action ripples through the scene." });
  };

  // CREATE SCREEN
  if (mode === "create") {
    return (
      <div style={styles.createPage}>
        <h1 style={styles.createHeading}>Create Your Character</h1>

        <div style={styles.suggestionBox}>
          <div style={styles.suggestionTitle}>GM Suggestions</div>
          <div style={styles.suggestionRow}>
            Styles: {gmSuggestedStyles.join(", ")}
          </div>
          <div style={styles.suggestionRow}>
            Roles: {gmSuggestedRoles.join(", ")}
          </div>
        </div>

        <label style={styles.label}>
          Style
          <select
            style={styles.select}
            value={character.style}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, style: e.target.value }))
            }
          >
            <option value="">Select a style</option>
            <option value="Alien">Alien</option>
            <option value="Android">Android</option>
            <option value="Dangerous">Dangerous</option>
            <option value="Heroic">Heroic</option>
            <option value="Hot-Shot">Hot-Shot</option>
            <option value="Intrepid">Intrepid</option>
            <option value="Savvy">Savvy</option>
          </select>
        </label>

        <label style={styles.label}>
          Role
          <select
            style={styles.select}
            value={character.class}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, class: e.target.value }))
            }
          >
            <option value="">Select a role</option>
            <option value="Doctor">Doctor</option>
            <option value="Envoy">Envoy</option>
            <option value="Engineer">Engineer</option>
            <option value="Explorer">Explorer</option>
            <option value="Pilot">Pilot</option>
            <option value="Scientist">Scientist</option>
            <option value="Soldier">Soldier</option>
          </select>
        </label>

        <label style={styles.label}>
          Number (2–5)
          <input
            type="number"
            min={2}
            max={5}
            style={styles.input}
            value={character.number}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, number: Number(e.target.value) }))
            }
          />
        </label>

        <label style={styles.label}>
          Character Name
          <input
            style={styles.input}
            value={character.name}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>

        <button style={styles.randomButton} onClick={randomizeName}>
          Random Name
        </button>

        <label style={styles.label}>
          Background (optional)
          <textarea
            style={styles.textarea}
            value={character.background}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, background: e.target.value }))
            }
          />
        </label>

        <button style={styles.createButton} onClick={goToPreview}>
          Preview Character
        </button>
      </div>
    );
  }

  // PREVIEW SCREEN
  if (mode === "preview") {
    return (
      <div style={styles.previewPage}>
        <h1 style={styles.previewHeading}>Character Preview</h1>

        <div style={styles.previewCard}>
          <div><strong>Name:</strong> {character.name}</div>
          <div><strong>Style:</strong> {character.style}</div>
          <div><strong>Role:</strong> {character.class}</div>
          <div><strong>Number:</strong> {character.number}</div>
          <div><strong>Background:</strong> {character.background || "None"}</div>
        </div>

        <button style={styles.createButton} onClick={finalizeCharacter}>
          Begin Adventure
        </button>

        <button style={styles.backButton} onClick={() => setMode("create")}>
          Back
        </button>
      </div>
    );
  }

  // CHAT SCREEN
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.topIcon}>X</div>
        <div style={styles.topIcon} onClick={() => setShowStats(!showStats)}>≡</div>
      </div>

      <div style={styles.historyBox}></div>

      <div style={styles.queueStatus}>
  {!isInQueue && (
    <button
      style={styles.queueButton}
      onClick={handleEnterQueue}
    >
      Enter Queue
    </button>
  )}

  {isInQueue && (
    <button
      style={styles.leaveButton}
      onClick={handleLeaveQueue}
    >
      Leave Queue
    </button>
  )}

  {!isMyTurn && (
    <button
      style={{
        ...styles.helpButton,
        ...(!canHelpUser ? styles.disabledHelpButton : {}),
      }}
      disabled={!canHelpUser}
      onClick={() => setShowHelpOptions(!showHelpOptions)}
    >
      Help
    </button>
  )}

  {isInQueue && !isMyTurn && (
    <div style={styles.waitingText}>
      Waiting for your turn...
    </div>
  )}

  {isMyTurn && (
    <div style={styles.turnText}>
      It is your turn!
    </div>
  )}
</div>

{showHelpOptions && canHelpUser && (
  <div style={styles.helpOptions}>
    <div style={styles.helpTitle}>
      Who do you want to help?
    </div>

    {helpTargets.map((member) => (
      <button
        key={member.clientId}
        style={styles.helpOption}
        onClick={() => handleHelpUser(member.clientId)}
      >
        {member.characterName}
      </button>
    ))}

    <button
      style={styles.cancelHelpButton}
      onClick={() => setShowHelpOptions(false)}
    >
      Cancel
    </button>
  </div>
)}

<div style={styles.actionRow}>
  <button
    style={styles.actionButton}
    disabled={!isMyTurn || waitingForRoll}
    onClick={() => handleAction("Attack")}
  >
    Attack
  </button>

  <button
    style={styles.actionButton}
    disabled={!isMyTurn || waitingForRoll}
    onClick={() => handleAction("Defend")}
  >
    Defend
  </button>

  <button
    style={styles.actionButton}
    disabled={!isMyTurn || waitingForRoll}
    onClick={() => handleAction("Investigate")}
  >
    Investigate
  </button>

  <button
    style={styles.actionButton}
    disabled={!isMyTurn || waitingForRoll}
    onClick={() => handleAction("Negotiate")}
  >
    Negotiate
  </button>
</div>

{waitingForRoll && (
  <div style={styles.rollArea}>
    <p style={styles.rollText}>
      Your action requires a dice roll.
    </p>

    <button
      style={styles.rollButton}
      onClick={handleRoll}
    >
      Roll Dice
    </button>
  </div>
)}

{lastRoll !== null && (
  <div style={styles.rollResult}>
    You rolled: <strong>{lastRoll}</strong>
  </div>
)}

      <div style={styles.inputContainer}>
        <input
          style={styles.inputBox}
          placeholder="User Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button style={styles.sendButton} onClick={sendMessage}>
          <span style={styles.sendIcon}>➤</span>
        </button>
      </div>

      <div style={styles.keyboardArea}>Keyboard</div>

      {showStats && (
        <div style={styles.statsPanel}>
          <h2 style={styles.statsHeader}>Character Stats</h2>

          <div style={styles.statsRow}><strong>Name:</strong> {character.name}</div>
          <div style={styles.statsRow}><strong>Style:</strong> {character.style}</div>
          <div style={styles.statsRow}><strong>Role:</strong> {character.class}</div>
          <div style={styles.statsRow}><strong>Number:</strong> {character.number}</div>
          <div style={styles.statsRow}><strong>Background:</strong> {character.background || "None"}</div>

          <button style={styles.closeStatsButton} onClick={() => setShowStats(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  createPage: {
    padding: "24px",
    backgroundColor: "#111",
    color: "#FFF",
    height: "100vh",
  },
  createHeading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#4CC9A3",
  },
  suggestionBox: {
    backgroundColor: "#222",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "2px solid #4CC9A3",
  },
  suggestionTitle: {
    fontWeight: 700,
    marginBottom: "6px",
    color: "#4CC9A3",
  },
  suggestionRow: {
    fontSize: "14px",
    color: "#CCC",
  },
  label: {
    display: "block",
    marginBottom: "16px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "6px",
    border: "2px solid #4CC9A3",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "6px",
    border: "2px solid #4CC9A3",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "16px",
    minHeight: "80px",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "6px",
    border: "2px solid #4CC9A3",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "16px",
  },
  randomButton: {
    backgroundColor: "#4CC9A3",
    color: "#000",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginBottom: "16px",
    fontWeight: 700,
  },
  createButton: {
    marginTop: "20px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  previewPage: {
    padding: "24px",
    backgroundColor: "#111",
    color: "#FFF",
    height: "100vh",
  },
  previewHeading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#4CC9A3",
  },
  previewCard: {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #4CC9A3",
    marginBottom: "20px",
  },
  backButton: {
    marginTop: "10px",
    backgroundColor: "#333",
    color: "#FFF",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#000",
    color: "#FFF",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#000",
    color: "#4CC9A3",
    fontSize: "24px",
    fontWeight: 700,
  },
  topIcon: {
    cursor: "pointer",
  },
  historyBox: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    backgroundColor: "#111",
    borderTop: "2px solid #4CC9A3",
    borderBottom: "2px solid #4CC9A3",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-around",
    padding: "12px",
    backgroundColor: "#000",
    borderTop: "2px solid #4CC9A3",
  },
  actionButton: {
    backgroundColor: "#4CC9A3",
    color: "#000",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  inputContainer: {
    display: "flex",
    padding: "12px",
    backgroundColor: "#000",
    borderTop: "2px solid #4CC9A3",
  },
  inputBox: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "2px solid #4CC9A3",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "18px",
    marginRight: "12px",
  },
  sendButton: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#4CC9A3",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  sendIcon: {
    fontSize: "24px",
    color: "#000",
    fontWeight: 700,
  },
  keyboardArea: {
    height: "120px",
    backgroundColor: "#444",
    color: "#000",
    fontSize: "28px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statsPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "100vh",
    backgroundColor: "#111",
    color: "#FFF",
    borderLeft: "3px solid #4CC9A3",
    padding: "20px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
  },
  statsHeader: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#4CC9A3",
    fontWeight: 700,
  },
  statsRow: {
    fontSize: "16px",
    marginBottom: "12px",
  },
  closeStatsButton: {
    marginTop: "auto",
    backgroundColor: "#4CC9A3",
    color: "#000",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  queueStatus: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "16px",
},

queueButton: {
  backgroundColor: "#2F4F3A",
  color: "#FFFFFF",
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
},

waitingText: {
  color: "#555555",
  fontSize: "16px",
  fontWeight: 600,
},

turnText: {
  color: "#2F4F3A",
  fontSize: "18px",
  fontWeight: 700,
},

rollArea: {
  textAlign: "center",
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#E8E2D6",
  borderRadius: "8px",
},

rollText: {
  color: "#2B2B2B",
  marginBottom: "12px",
},

rollButton: {
  backgroundColor: "#B4473A",
  color: "#FFFFFF",
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
},

rollResult: {
  textAlign: "center",
  color: "#2B2B2B",
  marginTop: "12px",
  fontSize: "18px",
},

helpButton: {
  backgroundColor: "#4CC9A3",
  color: "#000000",
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
  marginLeft: "12px",
},
  disabledHelpButton: {
    backgroundColor: "#555",
    color: "#999",
    cursor: "not-allowed",
  },

  helpOptions: {
    backgroundColor: "#111",
    border: "2px solid #4CC9A3",
    borderRadius: "8px",
    padding: "16px",
    margin: "0 16px 16px 16px",
    textAlign: "center",
  },

  helpTitle: {
    color: "#4CC9A3",
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  helpOption: {
    display: "block",
    width: "100%",
    backgroundColor: "#4CC9A3",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    fontWeight: 700,
  },

  cancelHelpButton: {
    backgroundColor: "#333",
    color: "#FFF",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  leaveButton: {
  backgroundColor: "#B4473A",
  color: "#FFFFFF",
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
  marginRight: "12px",
},
};


