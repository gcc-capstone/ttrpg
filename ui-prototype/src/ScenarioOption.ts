export const THREATS = [
  "Zorgon the Conqueror",
  "The Hive Armada",
  "Rogue Captain",
  "Space Pirates",
  "Cyber Zombies",
  "Alien Brain Worms",
];

export const THREAT_GOALS = [
  "Destroy / Corrupt",
  "Steal / Capture",
  "Bond with",
  "Protect / Empower",
  "Build / Synthesize",
  "Pacify / Occupy",
];

export const OBJECTS = [
  "Space Pirate King/Queen",
  "Void Crystals",
  "Star Dreadnought",
  "Quantum Tunnel",
  "Ancient Space Ruin",
  "Alien Artifact",
];

export const CONSEQUENCES = [
  "Destroy a solar system",
  "Reverse Time",
  "Enslave a planet",
  "Start a war / invasion",
  "Rip a hole in reality",
  "Fix Everything",
];

// How each threat starts the overview sentence (handles articles and plurals)
const THREAT_PHRASES: Record<string, string> = {
  "Zorgon the Conqueror": "Zorgon the Conqueror wants",
  "The Hive Armada": "The Hive Armada wants",
  "Rogue Captain": "A Rogue Captain wants",
  "Space Pirates": "Space Pirates want",
  "Cyber Zombies": "Cyber Zombies want",
  "Alien Brain Worms": "Alien Brain Worms want",
};

// "Destroy / Corrupt" -> "destroy or corrupt", "King/Queen" -> "King or Queen"
const withOr = (text: string) => text.replace(/\s*\/\s*/g, " or ");

// Turns the four scenario picks into one sentence, e.g.
// "Space Pirates want to steal or capture the Void Crystals, which will reverse time."
export function scenarioSentence(s: {
  threat: string;
  goal: string;
  objectItem: string;
  consequence: string;
}) {
  if (!s.threat && !s.goal && !s.objectItem && !s.consequence) {
    return "No scenario has been chosen yet.";
  }

  const threat = THREAT_PHRASES[s.threat] ?? (s.threat ? `${s.threat} wants` : "An unknown threat wants");
  const goal = s.goal ? withOr(s.goal).toLowerCase() : "do something with";
  const object = s.objectItem ? `the ${withOr(s.objectItem)}` : "something";
  const consequence = s.consequence
    ? `, which will ${withOr(s.consequence).toLowerCase()}`
    : "";

  return `${threat} to ${goal} ${object}${consequence}.`;
}
