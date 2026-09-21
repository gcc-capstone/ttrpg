# Capstone Team Report

# Section 1: Cover Page
### **[Project Title]**

![Project Logo]()

[Add your name], JohnMichael Ross, Henry Tan

---

# Section 2: Introduction

---

# Section 3: Representative Tasks
### Adventure Summary

- **MVP:** Jimmy and his friends have had trouble scheduling time to get together and play as a group, so it's been a week or two since the last time they played. In this time, they've forgotten a lot of what happened the last time they played, so Jimmy uses the summary feature to have the AI Game Master create a summary of what happened last time in their adventures.

### Character Creation

- **MVP:** After the session is started, Walter and his friends connect with their individual devices to create their characters for the campaign. Walter starts to design his character, choosing for them to be a dangerous chemist with a stat number of 2, making his character more science-oriented and coldly rational. Right as he's about to name his character, Walter's friends start laughing at him because they see on the main screen that he's accidently made his character a dangerous envoy. Walter quickly navigates back to the character's role part of the creation, changing it to chemist before going back to name his character Heisenberg and select that he is ready to play. He does not need to redo any of the other character choices again (like choosing a stat number) because the app saved what he had chosen and maintained it even after changing a previous character trait/stat.

### Narrative Tone

- **MVP:** Bill is in the process of setting up the weekly game session for him and his friends when he learns that Carl has had a particularly rough week with work. Typically these friends enjoy hard-fought, intense combat and making high-risk decisions, so their tone parameters usually include serious, strategic, and deadly keywords. However, Bill doesn't want this session to add to Carl's stress, so he silently edits the tone parameters of the campaign, removing the more serious keywords and replacing them with lighter, more-fun alternatives, changing the tone of the AI Game Master's descriptions as well as the severity of some consequences, leading to a session enjoyed by all participants.

### Storing Save Data

- **MVP:** Caleb has just finished another long session of his solo campaign and wants to continue this adventure at a later point in time. He has noticed the occasional message of 'Quick Saved' pop up across his various play sessions and noted that his game picks up right where he left off when he returns. However, Caleb plans on trading in his computer due to its poor performance and inability to handle required software for work. With this, Caleb saves a file-copy of his game data to later transfer his game to his new device, load up the data and continue playing that same campaign with his favorite character. 

---

# Section 4: Related Work
### Pokémon FireRed/LeafGreen

- Pokémon FireRed<sup>[1]</sup> is vastly different than our product, but one feature of the games has inspired part of our design. These games have a feature where when the player launches the game, it shows a brief summary of a couple of events/actions that the player took part in the last time they played the game. These games show text along with a little recording of the player at the place of the events described. This is similar to the summary feature that will be in our product, since both will describe to the players a summary of the key events that took place in the last session they played. There are definitely some differences however, as we will be using an AI model to summarize the key events since there is a large focus on the AI Game Master in our product. There will also be no visual component along with the text descriptions, as visual displays of the adventure are less important with regards to our target audience's important tasks related to a more text-based experience, and do not lie within the proposed design of our product.

### The Devils and the Details

- The Devils and the Details is one of the games featured in The Jackbox Party Pack 7<sup>[2]</sup>, having players take on the roles of various family members to work either together or individually to complete tasks and raise a collective team score above a threshold. This game shares several superficial elements with our project in that they both have a primary screen where the team status is shown and utilize individual devices on which players can perform actions. However, the actual gameplay and actions performed are radically different, with The Devils and the Details playing as a series of minigames and our project serving as means for text input and action-order resolution. One aspect of The Devils and the Details we do want to emulate however is the emergency meter; during the game, players can perform selfish actions which give a lot of individual points but lower the team score and raise the emergency rating. Upon the emergency rating reaching a critical point, the game switches to a salvage point where everyone is forced to fix a 'family emergency' such as the basement flooding. While this exact idea will not work for Lasers and Feelings as the players are entirely cooperative, having an emergency meter displayed on the main screen along with encroaching danger lights for the ship or general team status would help to add tension to a series of bad rolls, lead to team discussion and inerplay, and depending on what parameters the players create the session with, lead to a game-over given Lasers and Feelings does not specify an actual endpoint.

---

# Section 10: Bibiliography

[1] Game Freak, "Pokémon FireRed," [GameBoy Advance], Tokyo, Japan: Nintendo, 2004.

[2] "The Jackbox Party Pack 7," [PC], Chicago, IL, U.S.A.: Jackbox Games, 2020.