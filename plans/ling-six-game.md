# Implementation Plan: Ling Six Test Game

## Overview
The Ling Six Sound Test is a standard audiological procedure to check if a person can hear the full range of speech frequencies. This game will automate the test in a fun, interactive way.

## 1. Requirements & Assets

### Audio Files
Place the following 6 audio files in `public/assets/games/ling-six/`:
- `m.m4a`
- `ah.m4a`
- `oo.m4a`
- `ee.m4a`
- `sh.m4a`
- `s.m4a`

*Note: We will use these specific labels for the buttons. .m4a format is fully supported.*

### Visuals
- 6 Large, colorful buttons labeled with the sounds.
- Confetti effect on correct answer.
- Encouraging feedback on incorrect answer.

## 2. Technical Architecture

### Component: `LingSixGame.jsx`
- **Location**: `src/components/features/games/LingSixGame.jsx`
- **State Management**:
  - `currentSound`: The sound currently being played (randomly selected).
  - `gameState`: `idle`, `playing`, `correct`, `wrong`.
  - `history`: Track which sounds have been tested in the current session.
  - `score`: Total score for the session.
  - `attempts`: Number of attempts for the current sound.
- **Logic**:
  - `playSound()`: Plays the `currentSound` audio file.
  - `handleGuess(guess)`: Compares user selection with `currentSound`.
    - First try correct: +10 marks.
    - Second try correct: +5 marks.
    - Subsequent tries: 0 marks (but still allows progress).
  - `nextRound()`: Selects a new sound from the remaining untested sounds and resets `attempts`.

### Dependencies
- `canvas-confetti`: For the celebration effect (check if available or use CSS animation).
- `Button` component from `@/components/ui`.

## 3. User Flow
1. **Start Screen**: User clicks "Start Test".
2. **Audio Playback**: The app plays a random Ling sound.
3. **Selection**: User sees 6 buttons and clicks the one they heard.
4. **Validation**:
   - **Correct**: Confetti animation + "Great Job!" message. Auto-advance after 1.5s.
   - **Incorrect**: "Try again, you can do it!" message. Allow another attempt.
5. **Completion**: After all 6 sounds are correctly identified, show a "Summary/Result" screen with the option to restart.

## 4. Integration
- Add the game to `src/pages/Games.jsx`.
- Update `app.config.json` if needed for game registration.

## 5. Directory Structure
```
public/assets/games/ling-six/
├── m.mp3
├── ah.mp3
├── oo.mp3
├── ee.mp3
├── sh.mp3
└── s.mp3
```
