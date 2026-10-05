import React, { createContext, useContext, useState, useEffect } from "react";

export type Character = {
  name: string;
  style: string;
  class: string;
  number: number;
  background: string;
};

export type Message = {
  from: "client" | "gm";
  text: string;
};

type Store = {
  characters: Character[];
  messages: Message[];
  addCharacter: (c: Character) => void;
  addMessage: (m: Message) => void;
};

const GlobalContext = createContext<Store | null>(null);

const channel = new BroadcastChannel("ai-gm-channel");

export function GlobalStoreProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Receive updates from other tabs
  useEffect(() => {
    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "addCharacter") {
        setCharacters((prev) => [...prev, payload]);
      }

      if (type === "addMessage") {
        setMessages((prev) => [...prev, payload]);
      }
    };
  }, []);

  // Send updates to other tabs
  const addCharacter = (c: Character) => {
    setCharacters((prev) => [...prev, c]);
    channel.postMessage({ type: "addCharacter", payload: c });
  };

  const addMessage = (m: Message) => {
    setMessages((prev) => [...prev, m]);
    channel.postMessage({ type: "addMessage", payload: m });
  };

  return (
    <GlobalContext.Provider value={{ characters, messages, addCharacter, addMessage }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalStore() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("GlobalStore used outside provider");
  return ctx;
}
