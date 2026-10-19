import React, { useMemo } from 'react';
import LetterItem from './LetterItem';

const LetterGrid = ({ 
  targetLetter, 
  distractorLetter, 
  totalTargets, 
  difficulty,
  onCorrect,
  onWrong,
  isComplete,
  hintTimestamp
}) => {
  const [revealedIds, setRevealedIds] = React.useState(new Set());
  const [hintId, setHintId] = React.useState(null);
  const lastHintRef = React.useRef(0);

  // Generate letters based on difficulty
  const gridLetters = useMemo(() => {
    setRevealedIds(new Set()); // Reset on new round
    lastHintRef.current = 0; // Reset hint ref
    let distractorCount = 3;
    if (difficulty === 2) distractorCount = 6;
    if (difficulty === 3) distractorCount = 10;
    if (difficulty >= 4) distractorCount = 15;

    const letters = [
      ...Array(totalTargets).fill({ char: targetLetter, isTarget: true }),
      ...Array(distractorCount).fill({ char: distractorLetter, isTarget: false })
    ];

    // Shuffle letters and assign stable IDs
    return letters
      .map((l, i) => ({ ...l, id: `letter-${i}-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
  }, [targetLetter, distractorLetter, totalTargets, difficulty]);

  // Handle Hint logic
  React.useEffect(() => {
    if (hintTimestamp > 0 && hintTimestamp !== lastHintRef.current) {
      lastHintRef.current = hintTimestamp;
      const unrevealedTargets = gridLetters.filter(l => l.isTarget && !revealedIds.has(l.id));
      if (unrevealedTargets.length > 0) {
        const randomTarget = unrevealedTargets[Math.floor(Math.random() * unrevealedTargets.length)];
        setHintId(randomTarget.id);
        // Clear hint after some time
        const timer = setTimeout(() => setHintId(null), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hintTimestamp, gridLetters, revealedIds]);

  const handleItemCorrect = (id, letter) => {
    setRevealedIds(prev => new Set(prev).add(id));
    if (id === hintId) setHintId(null);
    onCorrect(letter);
  };

  return (
    <div className="w-full h-full bg-blue-50/50 dark:bg-blue-900/10 rounded-[40px] border-4 border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm p-8 flex flex-wrap justify-center items-center gap-4 relative overflow-hidden transition-colors">
      {gridLetters.map((item) => (
        <LetterItem
          key={item.id}
          letter={item.char}
          isTarget={item.isTarget}
          onCorrect={() => handleItemCorrect(item.id, item.char)}
          onWrong={onWrong}
          difficulty={difficulty}
          disabled={isComplete}
          isHinted={item.id === hintId}
        />
      ))}
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="text-9xl font-black text-blue-900 dark:text-white absolute -top-10 -left-10 rotate-12">{targetLetter}</div>
        <div className="text-9xl font-black text-blue-900 dark:text-white absolute -bottom-10 -right-10 -rotate-12">{distractorLetter}</div>
      </div>
    </div>
  );
};

export default LetterGrid;
