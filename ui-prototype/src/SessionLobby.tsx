import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";

export default function SessionLobby() {
  const {
    createHost,
    joinHostByCode,
    hostClients,
    markClientJoined
  } = useGlobalStore();

  const [hostName, setHostName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");

  const navigate = useNavigate();

  // Create a host and navigate to HostScreen
  const handleCreateHost = () => {
    if (!hostName.trim()) {
      setNameError("Please enter a name for the lobby.");
      return;
    }

    const newHost = createHost(hostName);
    navigate("/host-setup");
  };

  // Join a host using a join code
  const handleJoinByCode = () => {
    if (!joinCode.trim()) {
      setCodeError("Please enter a join code.");
      return;
    }

    const host = joinHostByCode(joinCode);
    if (!host) {
      alert("Invalid join code");
      return;
    }

    const status = hostClients[host.id] || { client1: false, client2: false };

    if (!status.client1) {
      markClientJoined(host.id, 1);
      navigate("/client1");
    } else if (!status.client2) {
      markClientJoined(host.id, 2);
      navigate("/client2");
    } else {
      alert("Session full");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Lobbies</h1>

      {/* JOIN BY CODE */}
      <div style={styles.section}>
        <h2>Join a Lobby</h2>

        <input
          style={styles.input}
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value);
            setCodeError("");
          }}
        />

        {codeError && <div style={styles.error}>{codeError}</div>}

        <button style={styles.button} onClick={handleJoinByCode}>
          Join
        </button>
      </div>

      {/* CREATE HOST */}
      <div style={styles.section}>
        <h2>Create a Lobby</h2>

        <input
          style={styles.input}
          placeholder="Enter a Lobby Name"
          value={hostName}
          onChange={(e) => {
            setHostName(e.target.value);
            setNameError("");
          }}
        />

        {nameError && <div style={styles.error}>{nameError}</div>}

        <button style={styles.button} onClick={handleCreateHost}>
          Create
        </button>
      </div>
      <button
        style={{ ...styles.button, marginTop: "40px" }}
        onClick={() => navigate("/")}
      >
        ← Back
    </button>

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
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
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
  error: {
    color: "#B4473A",
    fontSize: "14px",
    marginBottom: "6px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CC9A3",
    color: "#000",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px",
  }
};
