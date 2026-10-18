# Game Design Document: Letter Detective

## 1. Overview
**Tagline:** "Become a detective and catch the correct letter!"
**Objective:** Help children (specifically those with dyslexia) improve letter discrimination and orientation recognition through a fun, detective-themed visual challenge.

## 2. Visual Design (Based on Provided Layout)
The game features a vibrant, nature-themed background with a friendly detective mascot.

### 2.1 UI Layout
- **Top Header:**
    - Game Title: "Letter Detective"
    - Score Tracker: Progress bar (e.g., 3/10 stars)
    - Control: Pause button
- **Left Sidebar:**
    - Mascot: Detective girl with a magnifying glass.
    - Speech Bubble: "Find all the letter **b**. B says /b/. B for Ball!"
    - Audio Icon: Replay instructions.
- **Main Play Area:**
    - Floating letters within a soft-edged container.
    - Letters include the target (e.g., 'b') and distractors (e.g., 'd', 'p', 'q').
    - Instruction Banner (Center Top): "Find all the **b** letters!"
- **Right Sidebar:**
    - Hint Button: Highlights a correct letter.
    - Repeat Button: Repeats the target letter sound.
- **Footer:**
    - Encouragement: "You can do it!"
    - Instructions Sign: "Tap the correct letters!"

## 3. Game Mechanics

### Step 1: Detective Mission
The detective mascot introduces the target letter. 
- Audio: "This is B. B says /b/. B for Ball."
- Target letter is displayed prominently in a high-contrast box.

### Step 2: Search Challenge
The screen fills with floating letters. The child must identify and tap all target letters.
- **Difficulty Scaling:**
    - **Easy:** 4 letters, static.
    - **Medium:** 8 letters, floating/drifting.
    - **Hard:** 15 letters, moving faster.
    - **Expert:** Letters may rotate or fade.

### Step 3: Immediate Feedback
- **Correct Tap:**
    - Letter glows/pulses.
    - Star animation.
    - Audio: "Great! That's B!"
- **Incorrect Tap:**
    - Gentle shake animation.
    - Soft "oops" sound.
    - Audio: "That's D. Let's find B." (Identifies the tapped letter to help differentiation).

### Step 4: Word Connection
Once all target letters are found:
- An image of the example word appears (e.g., Ball).
- Audio says the word.

### Step 5: Reading Practice
- Simple words appear (e.g., "Ball", "Bat", "Big").
- The target letter is highlighted within the word.
- The child taps the letter within the context of the word.

## 4. Technical Architecture

### 4.1 State Management (Zustand)
`useLetterDetectiveStore`:
- `targetLetter`: Current letter to find.
- `distractors`: List of similar-looking letters.
- `score`: Number of correct taps.
- `difficulty`: Current level.
- `mistakeLog`: Object tracking specific letter-pair errors (e.g., `{ 'b-d': 5 }`).

### 4.2 Component Breakdown
- `LetterDetective.jsx`: Main container.
- `DetectiveMascot.jsx`: Animated mascot with speech bubbles.
- `LetterGrid.jsx`: Handles positioning and animation of floating letters.
- `LetterItem.jsx`: Individual interactive letter with animations (Framer Motion).
- `GameControls.jsx`: Header and sidebar buttons.

### 4.3 Smart Practice AI
- **Core Letter Pairs:** The game specifically targets frequently confused pairs:
    1.  `b` and `d`
    2.  `m` and `n`
    3.  `q` and `p`
    4.  `u` and `v`
    5.  `t` and `f`
    6.  `i` and `j`
    7.  `u` and `n`
    8.  `a` and `o`
    9.  `c` and `e`
- **Random Selection:** Each session randomly selects one of these pairs as the primary focus.
- **Mistake Tracking:** Every time an incorrect letter is tapped, the app logs the pair: `Target: b, Tapped: d`.
- **Adaptive Generation:** In the next round, the `distractors` list will prioritize the letters most frequently confused by the user based on history.

### 4.4 Accessibility Features
- **Font:** Support for `OpenDyslexic` font.
- **Contrast:** High-contrast color palettes for letters.
- **Audio:** Adjustable playback speed and clear enunciation.
- **Interaction:** Large hit areas for buttons and letters.

## 5. Implementation Plan

1.  **Asset Preparation:** 
    - Source detective mascot and background.
    - Prepare audio clips for alphabet sounds and feedback.
2.  **Core Engine:**
    - Implement random letter distribution logic.
    - Create the "floating" animation using Framer Motion or CSS keyframes.
3.  **Feedback System:**
    - Add sound effects and visual animations (glow/shake).
4.  **AI Logic:**
    - Implement local storage tracking for mistakes.
    - Create the adaptive generator that uses mistake history.
5.  **Integration:**
    - Add to the main dashboard and game selection menu.
