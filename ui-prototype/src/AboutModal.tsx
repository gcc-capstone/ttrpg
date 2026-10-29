import React, { useState } from "react";

const sections = {
  "Players: Create Characters": [
    "Choose a style (Alien, Android, Dangerous, Heroic, Hot‑Shot, Intrepid, Savvy).",
    "Choose a role (Doctor, Envoy, Engineer, Explorer, Pilot, Scientist, Soldier).",
    "Pick an Aptitude Number (2–5) to determine whether you excel at Lasers or Feelings.",
    "Give your character a cool space‑adventure name.",
    "Select a personal goal (Become Captain, Meet Aliens, Solve Mysteries, Shoot Bad Guys, etc.).",
    "Start with standard Consortium gear and a variable‑beam phase pistol."
  ],

  "Players: Create the Ship": [
    "Choose two strengths for the Raptor (Fast, Nimble, Well‑Armed, Powerful Shields, Superior Sensors, Cloaking Device, Fightercrafts).",
    "Choose one ship problem (Fuel Hog, Only One Medical Pod, Exploding Circuit Breakers, Grim Reputation)."
  ],

  "Rolling the Dice": [
    "Roll 1d6 when attempting something risky; gain extra dice if prepared or an expert.",
    "For Lasers actions: roll under your number. For Feelings actions: roll over your number.",
    "0 successes: things go wrong. 1 success: succeed with a complication. 2 successes: clean success. 3 successes: critical success.",
    "Rolling your number exactly grants Laser Feelings — ask the GM an important question.",
    "Helping: roll to assist another player; success gives them +1d."
  ],

  "GM: Create a Space Adventure": [
    "Build the mission using three tables: Threat, What the Threat Wants, and the Consequence if the crew fails.",
    "Combine these elements to form the core conflict of the adventure."
  ],

  "GM: Run the Game": [
    "Introduce the threat through clues, danger signs, or strange events.",
    "Ask players what they do before the threat acts; call for rolls when outcomes are uncertain.",
    "Use failures to escalate tension and push the story forward.",
    "Ask players questions and build on their answers to shape the narrative.",
    "Play to discover how the crew overcomes the threat — not to enforce a predetermined plot."
  ]
};

export default function AboutModal({ onClose }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div
      className="aptitude-modal-overlay"
      onClick={onClose}
    >
      <div
        className="aptitude-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        {!activeSection && (
          <>
            <h2 id="about-modal-title">About the Game</h2>

            {Object.keys(sections).map((section) => (
              <button
                key={section}
                type="button"
                className="aptitude-modal-close" // reused style for teal button
                style={{ width: "100%", marginBottom: "12px" }}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}

            <button
              type="button"
              className="aptitude-modal-close"
              onClick={onClose}
            >
              Close
            </button>
          </>
        )}

        {activeSection && (
          <>
            <h2>{activeSection}</h2>

            <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
              {sections[activeSection].map((item, i) => (
                <li key={i} style={{ marginBottom: "10px", color: "#eee" }}>
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="aptitude-modal-close"
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
