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

type Store = {
  characters: Character[];
  messages: Message[];
  hosts: HostSession[];
  selectedHost: string | null;

  hostClients: Record<string, { client1: boolean; client2: boolean }>;

  createHost: (name: string) => HostSession;
  joinHost: (hostId: string) => void;
  markClientJoined: (hostId: string, clientId: number) => void;

  addCharacter: (c: Character) => void;
  addMessage: (m: Message) => void;
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

  // Track which clients have joined each host
  const [hostClients, setHostClients] = useState<
    Record<string, { client1: boolean; client2: boolean }>
  >(() => {
    const saved = localStorage.getItem("hostClients");
    return saved ? JSON.parse(saved) : {};
  });

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

  return (
    <GlobalContext.Provider
      value={{
        characters,
        messages,
        hosts,
        selectedHost,
        hostClients,
        createHost,
        joinHost,
        markClientJoined,
        addCharacter,
        addMessage,
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
