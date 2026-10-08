import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";

export default function HostScreen() {
  const navigate = useNavigate();
  const {
    characters,
    messages,
    createHost,
    queue,
    selectedHost,
    hosts,
    hullIntegrity,
  } = useGlobalStore();

  const gameOver = hullIntegrity <= 0 || hullIntegrity >= 12;
  const won = hullIntegrity >= 12;

  // Register this host session only once
  React.useEffect(() => {
    // If this host already exists, do nothing
    if (selectedHost) return;

    // Create a new host session
    createHost("Host");
  }, []);

  if (gameOver) {
    return <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"grid",placeItems:"center",fontFamily:"Arial"}}>
      <div style={{background:"#111",border:`2px solid ${won ? "#4CC9A3" : "#B4473A"}`,borderRadius:12,padding:40,textAlign:"center"}}>
        <h1 style={{color:won ? "#4CC9A3" : "#B4473A"}}>{won ? "VICTORY" : "DEFEAT"}</h1>
        <h2 style={{color:"#fff"}}>{won ? "The Crew Wins!" : "The Ship Was Destroyed"}</h2>
        <button onClick={() => navigate("/lobby")} style={{marginTop:18,padding:"12px 22px",background:"#4CC9A3",color:"#000",border:0,borderRadius:8,fontWeight:700,cursor:"pointer"}}>Back to Lobby</button>
      </div>
    </div>;
  }

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

      {/* CENTER — Queue + AI Response + Player Action + Chat Log */}
<div style={styles.centerColumn}>

  <div style={styles.centerBox}>
    <h2 style={styles.centerHeading}>Player Queue</h2>

    {queue.length === 0 ? (
      <p style={styles.centerText}>
        No players are currently waiting.
      </p>
    ) : (
      <div>
        {queue.map((member, index) => (
          <div
            key={member.clientId}
            style={{
              ...styles.queueRow,
              ...(index === 0 ? styles.activeQueueRow : {}),
            }}
          >
            <div>
              <div style={styles.queueName}>
                {index + 1}. {member.characterName}
              </div>

              <div style={styles.queuePlayer}>
                Player {member.clientId}
              </div>

              {member.helperCharacterName && (
                <div style={styles.helperName}>
                  Helping: {member.helperCharacterName}
                </div>
              )}
            </div>

            {index === 0 && (
              <div style={styles.nextLabel}>
                CURRENT TURN
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

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

      {/* BOTTOM — ship hull integrity */}
      <div style={styles.hullRow}>
        <div style={styles.hullLabel}>
          <span style={styles.hullTitle}>HULL INTEGRITY</span>
          <span style={styles.hullValue}>
            {hullIntegrity} / {MAX_HULL_INTEGRITY}
            {hullIntegrity > MAX_HULL_INTEGRITY
              ? ` (+${hullIntegrity - MAX_HULL_INTEGRITY})`
              : ""}
          </span>
        </div>

        <div style={styles.hullTrack}>
          {Array.from({ length: MAX_HULL_INTEGRITY }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.hullPoint,
                ...(i < Math.min(hullIntegrity, MAX_HULL_INTEGRITY)
                  ? {
                      ...styles.hullPointFilled,
                      backgroundColor: getHullColor(hullIntegrity),
                      borderColor: getHullColor(hullIntegrity),
                    }
                  : {}),
              }}
            />
          ))}

          <div
            style={{
              ...styles.hullPointer,
              left: `${(
                (Math.min(Math.max(hullIntegrity, 1), MAX_HULL_INTEGRITY) - 0.5) /
                MAX_HULL_INTEGRITY
              ) * 100}%`,
            }}
            aria-label={`Hull integrity pointer at ${hullIntegrity}`}
          />
        </div>

        {hullIntegrity > MAX_HULL_INTEGRITY && (
          <div style={styles.hullOverflow}>
            Hull integrity is above the visible hit points.
          </div>
        )}
      </div>
    </div>
  );
}

const MAX_HULL_INTEGRITY = 6;

function getHullColor(health: number) {
  // 0 health = red, 6+ health = green.
  // Hue moves through yellow as the hull recovers.
  const clamped = Math.min(Math.max(health, 0), MAX_HULL_INTEGRITY);
  const hue = (clamped / MAX_HULL_INTEGRITY) * 120;
  return `hsl(${hue}, 70%, 45%)`;
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
  helperName: {
  fontSize: "13px",
  color: "#4CC9A3",
  marginTop: "4px",
  fontWeight: 600,
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

  hullRow: {
    gridColumn: "1 / span 3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 20px 12px",
    backgroundColor: "#000000",
    borderTop: "1px solid #2B2B2B",
    gap: "6px",
  },
  hullLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "440px",
    color: "#FFFFFF",
  },
  hullTitle: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  hullValue: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  hullTrack: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "7px",
    alignItems: "center",
    width: "100%",
    maxWidth: "440px",
    height: "32px",
    paddingTop: "10px",
    boxSizing: "border-box",
  },
  hullPoint: {
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "#202020",
    border: "1px solid #555555",
    boxSizing: "border-box",
    transition: "background-color 0.2s, border-color 0.2s",
  },
  hullPointFilled: {
    backgroundColor: "#2F4F3A",
  },
  hullPointer: {
    position: "absolute",
    top: "-1px",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: "9px solid #FFFFFF",
    transform: "translateX(-6px)",
    transition: "left 0.2s ease",
    filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))",
  },
  hullOverflow: {
    width: "100%",
    maxWidth: "440px",
    fontSize: "11px",
    color: "#888888",
    textAlign: "right",
  },
  queueRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  color: "#2B2B2B",
  padding: "12px 16px",
  borderRadius: "6px",
  border: "1px solid #DDD",
  marginBottom: "8px",
},

activeQueueRow: {
  border: "2px solid #B4473A",
},

queueName: {
  fontSize: "17px",
  fontWeight: 700,
},

queuePlayer: {
  fontSize: "13px",
  color: "#555555",
  marginTop: "4px",
},

nextLabel: {
  backgroundColor: "#B4473A",
  color: "#FFFFFF",
  padding: "5px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: 700,
},
};
