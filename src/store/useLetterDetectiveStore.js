import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Letter Detective Store
 * Handles game state, progress, and AI-driven mistake tracking.
 */

const LETTER_PAIRS = [
  { target: 'b', distractor: 'd', example: 'Ball' },
  { target: 'd', distractor: 'b', example: 'Dog' },
  { target: 'm', distractor: 'n', example: 'Moon' },
  { target: 'n', distractor: 'm', example: 'Nose' },
  { target: 'q', distractor: 'p', example: 'Queen' },
  { target: 'p', distractor: 'q', example: 'Pig' },
  { target: 'u', distractor: 'v', example: 'Umbrella' },
  { target: 'v', distractor: 'u', example: 'Van' },
  { target: 't', distractor: 'f', example: 'Tiger' },
  { target: 'f', distractor: 't', example: 'Fish' },
  { target: 'i', distractor: 'j', example: 'Igloo' },
  { target: 'j', distractor: 'i', example: 'Jam' },
  { target: 'u', distractor: 'n', example: 'Up' },
  { target: 'n', distractor: 'u', example: 'Night' },
  { target: 'a', distractor: 'o', example: 'Apple' },
  { target: 'o', distractor: 'a', example: 'Orange' },
  { target: 'c', distractor: 'e', example: 'Cat' },
  { target: 'e', distractor: 'c', example: 'Egg' },
];

export const useLetterDetectiveStore = create(
  persist(
    (set, get) => ({
      // ─── Game State ────────────────────────────────────────
      level: 1, // 1: Easy, 2: Medium, 3: Hard, 4: Expert
      currentPair: null,
      score: 0,
      targetFoundCount: 0,
      totalTargetsInRound: 0,
      isGameComplete: false,
      playedLetterIds: [],
      
      // ─── AI / Performance Tracking ────────────────────────
      // Tracks mistakes per pair, e.g., { 'b-d': 5, 'm-n': 2 }
      mistakeHistory: {},
      
      // ─── Actions ──────────────────────────────────────────
      
      /** Initialize a new round */
      startNewRound: () => {
        const { mistakeHistory, level, playedLetterIds } = get();
        
        // Filter out letters played in the current cycle
        let availablePairs = LETTER_PAIRS.filter(p => !playedLetterIds.includes(p.target));
        
        // If all letters played, reset the cycle
        if (availablePairs.length === 0) {
          availablePairs = [...LETTER_PAIRS];
          set({ playedLetterIds: [] });
        }

        // AI Logic: Sort available pairs by mistakes
        const sortedPairs = availablePairs.sort((a, b) => {
          const scoreA = mistakeHistory[`${a.target}-${a.distractor}`] || 0;
          const scoreB = mistakeHistory[`${b.target}-${b.distractor}`] || 0;
          return (scoreB + Math.random() * 20) - (scoreA + Math.random() * 20);
        });
        
        // Pick from top candidates
        const selectedPair = sortedPairs[Math.floor(Math.random() * Math.min(3, sortedPairs.length))];
        
        // Mark as played
        set(state => ({
          playedLetterIds: [...state.playedLetterIds, selectedPair.target]
        }));

        // Difficulty settings
        let targetCount = 3;
        if (level === 2) targetCount = 5;
        if (level === 3) targetCount = 8;
        if (level >= 4) targetCount = 10;

        set({
          currentPair: selectedPair,
          targetFoundCount: 0,
          totalTargetsInRound: targetCount,
          isGameComplete: false,
          score: 0
        });
      },

      /** Log a correct find */
      incrementFoundCount: () => {
        const { targetFoundCount, totalTargetsInRound, score } = get();
        const newCount = targetFoundCount + 1;
        
        if (newCount >= totalTargetsInRound) {
          set({ 
            targetFoundCount: newCount, 
            isGameComplete: true,
            score: score + 10 
          });
        } else {
          set({ 
            targetFoundCount: newCount,
            score: score + 10
          });
        }
      },

      /** Log a mistake */
      logMistake: (target, mistakenFor) => {
        const { mistakeHistory } = get();
        const pairKey = `${target}-${mistakenFor}`;
        
        set({
          mistakeHistory: {
            ...mistakeHistory,
            [pairKey]: (mistakeHistory[pairKey] || 0) + 1
          }
        });
      },

      /** Set difficulty level */
      setLevel: (level) => set({ level }),

      /** Reset the entire game progress */
      resetGame: () => set({
        level: 1,
        score: 0,
        mistakeHistory: {},
        isGameComplete: false
      })
    }),
    {
      name: 'letter-detective-store',
      partialize: (state) => ({
        level: state.level,
        mistakeHistory: state.mistakeHistory,
      }),
    }
  )
);

export default useLetterDetectiveStore;
