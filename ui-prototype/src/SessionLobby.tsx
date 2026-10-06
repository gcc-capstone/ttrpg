import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";

export default function SessionLobby() {
  const {
    hosts,
    createHost,
    joinHost,
    hostClients,
    markClientJoined
  } = useGlobalStore();

  const [hostName, setHostName] = useState("");
  const navigate = useNavigate();

  // Create a host and immediately navigate to HostScreen
  const handleCreateHost = () => {
    if (!hostName.trim()) return;

    const newHost = createHost(hostName);
    joinHost(newHost.id);
    navigate("/host");
  };

  // Join a host as Client1 or Client2
  const handleJoin = (hostId: string, clientId: number) => {
    joinHost(hostId);
    markClientJoined(hostId, clientId);
    navigate(clientId === 1 ? "/client1" : "/client2");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Session Lobby</h1>

      {/* CREATE HOST */}
      <div style={styles.section}>
        <h2>Create a Host Session</h2>

        <input
          style={styles.input}
          placeholder="Host Name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />

        <button style={styles.button} onClick={handleCreateHost}>
          Create Host
        </button>
      </div>

      {/* JOIN HOST */}
      <div style={styles.section}>
        <h2>Join a Host Session</h2>

        {hosts.length === 0 && (
          <p style={{ color: "#AAA" }}>No hosts available. Create one above.</p>
        )}

        {hosts.map((host) => {
          const status = hostClients[host.id] || {
            client1: false,
            client2: false,
          };

          return (
            <div key={host.id} style={styles.hostRow}>
              <span>{host.name}</span>

              {/* CLIENT 1 BUTTON */}
              <button
                style={{
                  ...styles.button,
                  ...(status.client1 ? styles.disabledButton : {})
                }}
                disabled={status.client1}
                onClick={() => handleJoin(host.id, 1)}
              >
                {status.client1 ? "Client 1 Taken" : "Join as Client 1"}
              </button>

              {/* CLIENT 2 BUTTON */}
              <button
                style={{
                  ...styles.button,
                  ...(status.client2 ? styles.disabledButton : {})
                }}
                disabled={status.client2}
                onClick={() => handleJoin(host.id, 2)}
              >
                {status.client2 ? "Client 2 Taken" : "Join as Client 2"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#000",
    color: "#4CC9A3",
    height: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  section: {
    backgroundColor: "#111",
    border: "2px solid #4CC9A3",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#000",
    color: "#FFF",
    border: "2px solid #4CC9A3",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginLeft: "10px",
  },
  disabledButton: {
    backgroundColor: "#555",
    color: "#999",
    cursor: "not-allowed",
    border: "2px solid #333",
  },
  hostRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #333",
    alignItems: "center",
  },
};
