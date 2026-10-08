import React, { createContext, useContext, useState, useEffect } from "react";

export type Character = {
  name: string;
  style: string;
  class: string;
  number: number;
  background: string;
  clientId?: number;
};

export type Message = {
  from: string;   // gm, client1, client2
  text: string;
};

export type HostSession = {
  id: string;
  name: string;
  createdAt: number;
};

export type QueueMember = {
  clientId: number;
  characterName: string;
  helperClientId?: number;
  helperCharacterName?: string;
};

type Store = {
  characters: Character[];
  messages: Message[];
  hosts: HostSession[];
  selectedHost: string | null;

  hostClients: Record<string, { client1: boolean; client2: boolean }>;
  queue: QueueMember[];

  helpUser: (helperClientId: number, targetClientId: number) => void; 
  undoHelp: (helperClientId: number) => void; 
  createHost: (name: string) => HostSession;
  joinHost: (hostId: string) => void;
  markClientJoined: (hostId: string, clientId: number) => void;

  enterQueue: (member: QueueMember) => void;
  leaveQueue: (clientId: number) => void;
  endTurn: (clientId: number) => void;
  

  addCharacter: (c: Character) => void;
  addMessage: (m: Message) => void;
  hullIntegrity: number;
  updateHullIntegrity: (delta: number) => void;
};

const GlobalContext = createContext<Store | null>(null);

const channel = new BroadcastChannel("ai-gm-channel");

export function GlobalStoreProvider({ children }: { children: React.ReactNode }) {
  // Hosts persist across tabs
  const [hosts, setHosts] = useState<HostSession[]>(() => {
    const saved = localStorage.getItem("hosts");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHost, setSelectedHost] = useState<string | null>(null);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Hull integrity belongs to each session, not to the whole application.
  const [hullByHost, setHullByHost] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("hullByHost") || "{}"); }
    catch { return {}; }
  });
  const hullIntegrity = selectedHost ? (hullByHost[selectedHost] ?? 6) : 6;

  // Track which clients have joined each host
  const [hostClients, setHostClients] = useState<
    Record<string, { client1: boolean; client2: boolean }>
  >(() => {
    const saved = localStorage.getItem("hostClients");
    return saved ? JSON.parse(saved) : {};
  });

  const [queue, setQueue] = useState<QueueMember[]>([]);

  // Persist hosts + client locks
  useEffect(() => {
    localStorage.setItem("hosts", JSON.stringify(hosts));
  }, [hosts]);

  useEffect(() => {
    localStorage.setItem("hostClients", JSON.stringify(hostClients));
  }, [hostClients]);

  // BroadcastChannel listener
  useEffect(() => {
    channel.onmessage = (event) => {
      const data = event.data;

      if (data.type === "host-created") {
        setHosts((prev) => [...prev, data.host]);
      }

      if (data.type === "queue-help") {
  setQueue((prev) =>
    prev.map((member) => {
      if (member.clientId === data.targetClientId) {
        return {
          ...member,
          helperClientId: data.helperClientId,
          helperCharacterName: data.helperCharacterName,
        };
      }

      return member;
    })
  );
}

      if (data.type === "client-joined") {
        setHostClients((prev) => ({
          ...prev,
          [data.hostId]: {
            client1: prev[data.hostId]?.client1 || data.clientId === 1,
            client2: prev[data.hostId]?.client2 || data.clientId === 2,
          },
        }));
      }

      if (data.type === "addCharacter") {
        setCharacters((prev) => [...prev, data.payload]);
      }

      if (data.type === "addMessage") {
        setMessages((prev) => [...prev, data.payload]);
      }

      if (data.type === "hull-integrity" && data.hostId) {
        setHullByHost((prev) => ({
          ...prev,
          [data.hostId]: Math.max(0, (prev[data.hostId] ?? 6) + data.delta),
        }));
      }
      if (data.type === "queue-enter") {
        setQueue((prev) => {
          if (
            prev.some(
              (member) => member.clientId === data.member.clientId
            )
          ) {
            return prev;
          }

          return [...prev, data.member];
        });
      }

      if (data.type === "queue-leave") {
  setQueue((prev) =>
    prev
      .filter((member) => member.clientId !== data.clientId)
      .map((member) => {
        if (member.helperClientId === data.clientId) {
          return {
            ...member,
            helperClientId: undefined,
            helperCharacterName: undefined,
          };
        }

        return member;
      })
  );
}

if (data.type === "queue-undo-help") {
  setQueue((prev) =>
    prev.map((member) => {
      if (member.helperClientId === data.helperClientId) {
        return {
          ...member,
          helperClientId: undefined,
          helperCharacterName: undefined,
        };
      }

      return member;
    })
  );
}

      if (data.type === "queue-end-turn") {
  setQueue((prev) => {
    if (prev.length === 0) {
      return prev;
    }

    if (prev[0].clientId !== data.clientId) {
      return prev;
    }

    return prev.slice(1).map((member) => {
      if (member.helperClientId === data.clientId) {
        return {
          ...member,
          helperClientId: undefined,
          helperCharacterName: undefined,
        };
      }

      return member;
    });
  });
}
    };
  }, []);

  // Create a host session
  const createHost = (name: string): HostSession => {
    const newHost: HostSession = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };

    setHosts((prev) => [...prev, newHost]);
    setHullByHost((prev) => ({ ...prev, [newHost.id]: 6 }));
    channel.postMessage({ type: "host-created", host: newHost });

    return newHost; // critical for navigation
  };

  // Select a host
  const joinHost = (hostId: string) => {
    setSelectedHost(hostId);
  };

  // Mark client1 or client2 as joined
  const markClientJoined = (hostId: string, clientId: number) => {
    setHostClients((prev) => ({
      ...prev,
      [hostId]: {
        client1: prev[hostId]?.client1 || clientId === 1,
        client2: prev[hostId]?.client2 || clientId === 2,
      },
    }));

    channel.postMessage({
      type: "client-joined",
      hostId,
      clientId,
    });
  };

  const enterQueue = (member: QueueMember) => {
    setQueue((prev) => {
      // Prevent the same player from entering the queue twice.
      if (prev.some((item) => item.clientId === member.clientId)) {
        return prev;
      }

      return [...prev, member];
    });

    channel.postMessage({
      type: "queue-enter",
      member,
    });
  };

  const leaveQueue = (clientId: number) => {
  setQueue((prev) =>
    prev
      .filter((member) => member.clientId !== clientId)
      .map((member) => {
        // Remove this player as a helper if they were helping someone.
        if (member.helperClientId === clientId) {
          return {
            ...member,
            helperClientId: undefined,
            helperCharacterName: undefined,
          };
        }

        return member;
      })
  );

  channel.postMessage({
    type: "queue-leave",
    clientId,
  });
};

  const helpUser = (
  helperClientId: number,
  targetClientId: number
) => {
  const helper = characters.find(
    (character) => character.clientId === helperClientId
  );

  if (!helper) {
    return;
  }

  setQueue((prev) =>
    prev.map((member) => {
      if (member.clientId === targetClientId) {
        return {
          ...member,
          helperClientId,
          helperCharacterName: helper.name,
        };
      }

      return member;
    })
  );

  channel.postMessage({
    type: "queue-help",
    helperClientId,
    helperCharacterName: helper.name,
    targetClientId,
  });
};

const undoHelp = (helperClientId: number) => {
  setQueue((prev) =>
    prev.map((member) => {
      if (member.helperClientId === helperClientId) {
        return {
          ...member,
          helperClientId: undefined,
          helperCharacterName: undefined,
        };
      }

      return member;
    })
  );

  channel.postMessage({
    type: "queue-undo-help",
    helperClientId,
  });
};

  const endTurn = (clientId: number) => {
    setQueue((prev) => {
      // Only the player whose turn it currently is can end the turn.
      if (prev.length === 0 || prev[0].clientId !== clientId) {
        return prev;
      }

      return prev.slice(1);
    });

    channel.postMessage({
      type: "queue-end-turn",
      clientId,
    });
  };

  // Add character
  const addCharacter = (c: Character) => {
    setCharacters((prev) => [...prev, c]);
    channel.postMessage({ type: "addCharacter", payload: c });
  };

  // Add message
  const addMessage = (m: Message) => {
    setMessages((prev) => [...prev, m]);
    channel.postMessage({ type: "addMessage", payload: m });
  };

  // Change hull integrity from client actions.
  // A delta is broadcast so multiple tabs can contribute changes.
  const updateHullIntegrity = (delta: number) => {
    if (!selectedHost) return;
    setHullByHost((prev) => ({
      ...prev,
      [selectedHost]: Math.max(0, (prev[selectedHost] ?? 6) + delta),
    }));
    channel.postMessage({ type: "hull-integrity", hostId: selectedHost, delta });
  };

  useEffect(() => {
    localStorage.setItem("hullByHost", JSON.stringify(hullByHost));
  }, [hullByHost]);

  return (
    <GlobalContext.Provider
      value={{
        characters,
        messages,
        hosts,
        selectedHost,
        hostClients,
        queue,
        createHost,
        joinHost,
        markClientJoined,
        enterQueue,
        endTurn,
        addCharacter,
        addMessage,
        hullIntegrity,
        updateHullIntegrity,
        helpUser,
        undoHelp,
        leaveQueue,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalStore() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("GlobalStore used outside provider");
  return ctx;
}
