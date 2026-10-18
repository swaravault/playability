# Implementation Plan: Galaxy Rescue 🚀

## Overview
Galaxy Rescue is an interactive space-adventure game designed to improve the listening skills, attention, and instruction-following abilities of hearing-impaired children. The game uses audio clues as the primary driver for gameplay.

## 1. Game Design & Visuals
- **Mascot**: A friendly alien (e.g., "Aria the Alien") who guides the user.
- **Theme**: Vibrant space adventure with planets, stars, and crystals.
- **Components**:
  - `GalaxyMap`: Visual progression showing unlocked planets.
  - `MissionControl`: The main game screen where instructions are given.
  - `ObjectCard`: Interactive cards for selecting items.
  - `StarCounter`: Persistent visual feedback on progress.

## 2. Graphics Generation Strategy 🎨
To ensure a polished and consistent visual style, we will generate the assets using AI:

1.  **Style Definition**: All graphics will follow a consistent "Child-friendly 3D cartoon" style with vibrant colors and soft lighting to make the objects stand out.
2.  **Mascot**: A custom-generated "friendly alien" mascot with multiple emotional states (happy, thinking, cheering).
3.  **Object Assets**: High-quality individual renders for crystals, rockets, keys, and planets.
4.  **Tooling**: Use the `generate_image` tool with specific prompt engineering to maintain thematic consistency across all assets.
5.  **Processing**: Images will be optimized and saved with transparent backgrounds (PNG) in `public/assets/games/galaxy-rescue/images/`.

## 3. Technical Architecture

### Component: `GalaxyRescue.jsx`
- **Location**: `src/components/features/games/GalaxyRescue.jsx`
- **State Management** (via `useAppStore` or local state):
  - `currentLevel`: 1, 2, or 3.
  - `stars`: Total stars earned (persistent).
  - `unlockedPlanets`: Array of planet IDs.
  - `currentMission`: The active instruction and target objects.
  - `gameState`: `intro`, `playing`, `feedback`, `planet-unlock`, `completion`.

### Level Progression
- **Level 1 (Rainbow Planet)**: Simple object recognition (3 choices).
- **Level 2 (Crystal Planet)**: Color + Object combination (3-4 choices).
- **Level 3 (Galaxy Station)**: Two-step instructions (Action/Destination). Implemented using **Drag-and-Drop** for intuitive interaction.

## 3. Interaction & Animation
- **Drag-and-Drop (Level 3)**: Use a lightweight approach (e.g., `framer-motion` or native touch events) to allow children to move objects to destinations.
- **Animations**:
  - Parallax space background for depth.
  - Mascot "talking" animation synced with Web Speech API events.
  - Hover/Tap effects on all interactive elements.

## 4. Audio Implementation Strategy (Main Focus) 🔊

Since this is for hearing-challenged kids, the audio must be exceptionally clear and well-articulated.

### Strategy: Browser Web Speech API (Dynamic Generation)
We will leverage the browser's built-in Text-to-Speech capabilities for maximum flexibility:

1.  **Voice Selection**: Implement logic to automatically select the highest-quality "Neural" or "Premium" voice available on the user's device (e.g., Google US English, Apple Samantha).
2.  **Audio Tuning**: 
    - **Rate**: Set to slightly slower (0.8x - 0.9x) to ensure clear articulation of consonants.
    - **Pitch**: Adjusted for optimal clarity based on typical hearing aid/cochlear implant profiles.
3.  **Audio-Only Instructions**: To ensure the child focuses entirely on listening and analyzing sound, **no text instructions or subtitles will be displayed** during missions. The child must rely solely on the audio clue and the optional Replay button.
4.  **Visual Accessibility**:
    - **Replay Button**: Large, accessible button to repeat instructions.
    - **Visual Sync**: Subtle visual pulse on the alien mascot while audio is playing.

### Audio Utilities:
- Create a `SpeechService` utility to handle speech synthesis, queuing, and interruptions.
- Ensure proper cleanup of the `speechSynthesis` object to prevent memory leaks or overlapping audio.

## 4. Gameplay Logic & Feedback
- **Stars**: +5 stars for every correct first-time answer.
- **Planet Unlocking**: Triggers when stars reach multiples of 15.
- **Feedback Loop**:
  - **Correct**: Celebration sound (clear and positive) + mascot animation + 5 stars.
  - **Incorrect**: Gentle "Try again" audio + visual hint (e.g., target object glows slightly).
- **Continue Button**: Clear transition between missions to avoid rushing the child.

## 5. Directory Structure
```
public/assets/games/galaxy-rescue/
├── audio/
│   ├── ui/ (click, win, lose sounds)
│   └── missions/ (instruction clips)
├── images/
│   ├── mascot/
│   ├── planets/
│   └── objects/ (keys, crystals, rockets, etc.)
```

## 6. Data Tracking & Reporting
To provide meaningful feedback to parents/teachers, the game will track:
- **Total Missions Completed**
- **Stars Earned** (Actual gameplay data, no hardcoding)
- **First-Attempt Success Rate**: Crucial for measuring listening progress.
- **Accuracy Percentage**: Total correct / total attempts.
- **Level Completion Status**: Which planets are unlocked.

## 7. Integration
- Register in `src/config/app.js`.
- Add route/component link in `src/pages/Games.jsx`.
- Ensure theme consistency with the existing dashboard.
