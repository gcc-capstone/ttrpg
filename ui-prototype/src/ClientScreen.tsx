import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";
import "./ClientScreen.css";

export default function ClientScreen({ clientId }: { clientId?: number }) {
  const navigate = useNavigate();
  const {
  addCharacter,
  addMessage,
  queue,
  enterQueue,
  endTurn,
  helpUser,
  undoHelp,
  leaveQueue,
  hullIntegrity,
} = useGlobalStore();
  const gameOver = hullIntegrity <= 0 || hullIntegrity >= 12;
  const won = hullIntegrity >= 12;

  const [mode, setMode] = useState<"create" | "preview" | "roll" | "chat">("create");
  const [showHelpOptions, setShowHelpOptions] = useState(false);
  const [helpTopic, setHelpTopic] = useState<"aptitude" | "style" | "role" | null>(null);

  const [character, setCharacter] = useState({
    name: "",
    style: "",
    class: "",
    number: 2,
    background: "",
  });

  const [text, setText] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [triedPreview, setTriedPreview] = useState(false);

  const randomNames = [
    "Sparks McGee",
    "Nova Straylight",
    "Kade Hollow",
    "Seren Ashfall",
    "Vexa Ionblade",
    "Rook Starborn",
    "Juno Drift",
    "Orion Vale",
    "Talia Quasar",
    "Dex Morrow",
    "Lyra Coldspark",
    "Zane Halcyon",
    "Mira Voidwalker",
    "Cass Ember",
    "Thorne Galeway",
    "Pixel Okonkwo",
    "Rigel Marsh"
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

const isHelpingSomeone =
  clientId !== undefined &&
  queue.some((member) => member.helperClientId === clientId);

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

const handleUndoHelp = () => {
  if (clientId === undefined || !isHelpingSomeone) return;

  const target = queue.find(
    (member) => member.helperClientId === clientId
  );

  undoHelp(clientId);

  if (target) {
    addMessage({
      from: `client${clientId}`,
      text: `${character.name} is no longer helping ${target.characterName}.`,
    });
  }
};

  const randomizeName = () => {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    setCharacter((prev) => ({ ...prev, name }));
  };

  const gmSuggestedStyles = ["Heroic", "Savvy", "Dangerous"];
  const gmSuggestedRoles = ["Explorer", "Scientist", "Pilot"];

  const missingFields = [
    !character.style && "Style",
    !character.class && "Role",
    !character.name && "Character Name",
  ].filter(Boolean);

  const goToPreview = () => {
    if (missingFields.length > 0) {
      setTriedPreview(true);
      return;
    }
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
    if (!text.trim() || !isMyTurn) { return; }

    addMessage({ from: `client${clientId ?? ""}`, text });
    setText("");

    setMode("roll");
  };

  const sendGMResponse = () => {
    addMessage({ from: "gm", text: "Your action ripples through the scene." });
    endTurn(clientId!);
    setMode("chat");
  }

  const generateDice = (numDice: number) => {
    for (let i = 0; i < numDice; i++) { addMessage({ from: "gm", text: "You rolled a " + (Math.floor(Math.random() * 6) + 1).toString() + "!" }); }
    sendGMResponse();
  }

  // CREATE SCREEN
  if (mode === "create") {
    return (
      <div style={styles.createPage}>
        <h1 style={styles.heading}>Create Your Character</h1>

        <div style={styles.suggestionBox}>
          <div style={styles.suggestionTitle}>GM Suggestions</div>
          <div style={styles.suggestionRow}>
            Styles: {gmSuggestedStyles.join(", ")}
          </div>
          <div style={styles.suggestionRow}>
            Roles: {gmSuggestedRoles.join(", ")}
          </div>
        </div>

        <div style={styles.label}>
          <div className="aptitude-title">
            <label htmlFor="character-style">Style</label>
            <button
              type="button"
              className="aptitude-help-button"
              aria-label="What do the styles mean?"
              aria-haspopup="dialog"
              onClick={() => setHelpTopic("style")}
            >
              ?
            </button>
          </div>
          <select
            id="character-style"
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
        </div>

        <div style={styles.label}>
          <div className="aptitude-title">
            <label htmlFor="character-role">Role</label>
            <button
              type="button"
              className="aptitude-help-button"
              aria-label="What do the roles mean?"
              aria-haspopup="dialog"
              onClick={() => setHelpTopic("role")}
            >
              ?
            </button>
          </div>
          <select
            id="character-role"
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
        </div>

        <div style={styles.label}>
          <div className="number-heading">
            <div className="aptitude-title">
              <label htmlFor="character-number">Aptitude Number</label>
              <button
                type="button"
                className="aptitude-help-button"
                aria-label="What is the Aptitude Number?"
                aria-haspopup="dialog"
                onClick={() => setHelpTopic("aptitude")}
              >
                ?
              </button>
            </div>
            <output htmlFor="character-number">{character.number}</output>
          </div>

          <div className="slider-row">
            <span className="slider-side">Feelings</span>
            <div className="slider-area">
              <div className="number-slider-wrapper">
                <div className="number-slider-track" aria-hidden="true">
                  {[2, 3, 4, 5].map((number) => (
                    <span
                      key={number}
                      className="number-tick"
                      style={{ left: `${((number - 2) / 3) * 100}%` }}
                    />
                  ))}
                </div>
                <input
                  id="character-number"
                  className="number-slider"
                  type="range"
                  min={2}
                  max={5}
                  step={1}
                  value={character.number}
                  onChange={(e) =>
                    setCharacter((prev) => ({
                      ...prev,
                      number: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="number-labels" aria-hidden="true">
                {[2, 3, 4, 5].map((number) => (
                  <span key={number}>{number}</span>
                ))}
              </div>
            </div>
            <span className="slider-side">Lasers</span>
          </div>
        </div>

        {helpTopic && (
          <div
            className="aptitude-modal-overlay"
            onClick={() => setHelpTopic(null)}
          >
            <div
              className="aptitude-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="aptitude-modal-title"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") setHelpTopic(null);
              }}
            >
              {helpTopic === "aptitude" && (
                <>
                  <h2 id="aptitude-modal-title">Aptitude Number</h2>
                  <p>
                    Your Aptitude Number (2–5) determines your character's
                    proficiency with two kinds of actions:
                  </p>
                  <p><strong>Feelings</strong> — intuition, diplomacy, and seduction.</p>
                  <p><strong>Lasers</strong> — technology, science, and cold rationality.</p>
                  <p>
                    Lower numbers favor Feelings-based actions; higher numbers
                    favor Lasers-based actions.
                  </p>
                </>
              )}
              {helpTopic === "style" && (
                <>
                  <h2 id="aptitude-modal-title">Style</h2>
                  <p>Your style is your character's personality and the way they carry themselves.</p>
                  {Object.entries(styleDescriptions).map(([name, description]) => (
                    <p key={name}><strong>{name}</strong> — {description}</p>
                  ))}
                </>
              )}
              {helpTopic === "role" && (
                <>
                  <h2 id="aptitude-modal-title">Role</h2>
                  <p>Your role is your character's job aboard the ship.</p>
                  {Object.entries(roleDescriptions).map(([name, description]) => (
                    <p key={name}><strong>{name}</strong> — {description}</p>
                  ))}
                </>
              )}
              <button
                type="button"
                className="aptitude-modal-close"
                onClick={() => setHelpTopic(null)}
                autoFocus
              >
                Got it
              </button>
            </div>
          </div>
        )}

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

        {triedPreview && missingFields.length > 0 && (
          <div style={styles.errorText} role="alert">
            Please fill in: {missingFields.join(", ")}
          </div>
        )}

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
          <div><strong>Aptitude Number:</strong> {character.number}</div>
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

  // ROLL DICE SCREEN
  if (mode === "roll") {
    return (
      <div style={styles.page}>
        <div style={styles.actionRow}>
          <button style={styles.rollButton} onClick={() => generateDice(3)}>Roll!</button>
        </div>
      </div>
    );
  }

  // CHAT SCREEN
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.topIcon}>X</div>
        <p style = {styles.heading}>PLAYER TERMINAL</p>
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
  <>
    {isHelpingSomeone ? (
      <button
        style={styles.undoHelpButton}
        onClick={handleUndoHelp}
      >
        Undo Help
      </button>
    ) : (
      <button
        style={{
          ...styles.helpButton,
          ...(!canHelpUser ? styles.disabledHelpButton : {}),
        }}
        disabled={!canHelpUser}
        onClick={() => setShowHelpOptions(!showHelpOptions)}
      >
        Help Another Player
      </button>
    )}
  </>
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
  <div style={styles.inputContainer}>
    <input
      style = { isMyTurn ? styles.inputBoxActive : styles.inputBoxDisabled }
      placeholder = { isMyTurn ? "Describe your action..." : (isInQueue ? "Wait for your turn..." : "Enter the queue to act...") }
      value={text}
      disabled = {!isMyTurn}
      onChange={(e) => setText(e.target.value)}
    />

    <button style={isMyTurn ? styles.sendButtonActive : styles.sendButtonDisabled} onClick={sendMessage}>
      <span style={styles.sendIcon}>➤</span>
    </button>
  </div>
</div>

      {gameOver && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:2000,display:"grid",placeItems:"center",padding:20}}>
          <div style={{background:"#111",border:`2px solid ${won ? "#4CC9A3" : "#B4473A"}`,borderRadius:12,padding:32,textAlign:"center",maxWidth:480}}>
            <h1 style={{color:won ? "#4CC9A3" : "#B4473A"}}>{won ? "VICTORY" : "DEFEAT"}</h1>
            <h2 style={{color:"#fff"}}>{won ? "The Crew Wins!" : "The Ship Was Destroyed"}</h2>
            <button onClick={() => navigate("/lobby")} style={{marginTop:18,padding:"12px 22px",background:"#4CC9A3",color:"#000",border:0,borderRadius:8,fontWeight:700,cursor:"pointer"}}>Back to Lobby</button>
          </div>
        </div>
      )}
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

const styleDescriptions = {
  Alien: "From another world, with strange customs and a fresh outlook on humanity.",
  Android: "A synthetic being, logical and precise, still figuring out what it means to be alive.",
  Dangerous: "Intimidating and unpredictable; others think twice before crossing you.",
  Heroic: "Brave and selfless, always first to step up when someone needs saving.",
  "Hot-Shot": "Cocky and flashy, living for risky stunts and showing off.",
  Intrepid: "Fearless and curious, eager to charge into the unknown.",
  Savvy: "Clever and street-smart, always working an angle.",
};

const roleDescriptions = {
  Doctor: "Heals the crew and treats injuries, illnesses, and alien ailments.",
  Envoy: "Speaks for the ship, handling diplomacy, negotiation, and first contact.",
  Engineer: "Keeps the ship running, fixing and building machines and systems.",
  Explorer: "Scouts new worlds, tracks, and leads away missions.",
  Pilot: "Flies the ship and any other vehicle, especially under pressure.",
  Scientist: "Studies anomalies, analyzes data, and explains the unexplained.",
  Soldier: "Handles combat and security, protecting the crew from threats.",
};

const styles = {
  errorText: {
    color: "#FF4D4D",
    fontWeight: 700,
    marginBottom: "12px",
  },
  createPage: {
    padding: "24px",
    backgroundColor: "#111",
    color: "#FFF",
    height: "100vh",
  },
  heading: {
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
    boxSizing: "border-box" as const,
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
    boxSizing: "border-box" as const,
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
    boxSizing: "border-box" as const,
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
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#000",
    borderTop: "2px solid #4CC9A3",
  },
  inputBoxActive: {
    flex: 1,
    padding: "20px 18px",
    borderRadius: "10px",
    border: "2px solid #4CC9A3",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "22px",
    marginRight: "14px",
  },
  inputBoxDisabled: {
    flex: 1,
    padding: "20px 18px",
    borderRadius: "10px",
    border: "2px solid #252525",
    backgroundColor: "#000",
    color: "#FFF",
    fontSize: "22px",
    marginRight: "14px",
  },
  sendButtonActive: {
    width: "76px",
    height: "76px",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "#4CC9A3",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  sendButtonDisabled: {
    width: "76px",
    height: "76px",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "#252525",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  sendIcon: {
    fontSize: "34px",
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
  flexWrap: "wrap" as const,
  justifyContent: "center",
  alignItems: "stretch",
  gap: "14px",
  margin: "16px",
},

queueButton: {
  backgroundColor: "#4CC9A3",
  color: "#000000",
  padding: "18px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  flex: "1 1 200px",
  maxWidth: "320px",
  boxShadow: "0 0 16px rgba(76, 201, 163, 0.6)",
},

waitingText: {
  flexBasis: "100%",
  textAlign: "center" as const,
  color: "#AAAAAA",
  fontSize: "16px",
  fontWeight: 600,
},

turnText: {
  flexBasis: "100%",
  textAlign: "center" as const,
  color: "#4CC9A3",
  fontSize: "20px",
  fontWeight: 700,
},
rollButton: {
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
helpButton: {
  backgroundColor: "#F2B33D",
  color: "#000000",
  padding: "18px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  flex: "1 1 200px",
  maxWidth: "320px",
  boxShadow: "0 0 16px rgba(242, 179, 61, 0.6)",
},
  disabledHelpButton: {
    backgroundColor: "#555",
    color: "#999",
    boxShadow: "none",
    cursor: "not-allowed",
  },

  helpOptions: {
    backgroundColor: "#111",
    border: "2px solid #F2B33D",
    borderRadius: "12px",
    boxShadow: "0 0 16px rgba(242, 179, 61, 0.4)",
    padding: "20px",
    width: "calc(100% - 32px)",
    maxWidth: "480px",
    boxSizing: "border-box" as const,
    margin: "0 auto 16px",
    textAlign: "center",
  },

  helpTitle: {
    color: "#F2B33D",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    marginBottom: "16px",
  },

  helpOption: {
    display: "block",
    width: "100%",
    backgroundColor: "#F2B33D",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    boxShadow: "0 0 12px rgba(242, 179, 61, 0.5)",
  },

  cancelHelpButton: {
    backgroundColor: "transparent",
    color: "#F2B33D",
    border: "2px solid #F2B33D",
    borderRadius: "10px",
    padding: "12px 24px",
    marginTop: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 800,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },

  leaveButton: {
  backgroundColor: "#B4473A",
  color: "#FFFFFF",
  padding: "18px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  flex: "1 1 200px",
  maxWidth: "320px",
  boxShadow: "0 0 16px rgba(180, 71, 58, 0.6)",
},
undoHelpButton: {
  backgroundColor: "#B4473A",
  color: "#FFFFFF",
  padding: "18px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  flex: "1 1 200px",
  maxWidth: "320px",
  boxShadow: "0 0 16px rgba(180, 71, 58, 0.6)",
},
};


