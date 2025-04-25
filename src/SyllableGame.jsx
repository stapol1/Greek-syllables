
import React, { useState, useEffect } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import useSound from "use-sound";

const syllables = [
  { word: "ΒΑ", letters: ["Β", "Α"] },
  { word: "ΒΕ", letters: ["Β", "Ε"] },
  { word: "ΒΙ", letters: ["Β", "Ι"] },
  { word: "ΒΟ", letters: ["Β", "Ο"] },
  { word: "ΓΑ", letters: ["Γ", "Α"] },
  { word: "ΓΕ", letters: ["Γ", "Ε"] },
  { word: "ΓΙ", letters: ["Γ", "Ι"] },
  { word: "ΓΟ", letters: ["Γ", "Ο"] },
];

const SyllableGame = () => {
  const [step, setStep] = useState(0);
  const [current, setCurrent] = useState(0);
  const [clicked, setClicked] = useState([]);
  const { letters, word } = syllables[current];
  const [playLetterSounds, setLetterSounds] = useState({});
  const [playSyllableSound, setPlaySyllableSound] = useState(null);

  useEffect(() => {
    const loadSounds = async () => {
      const letterPlayers = {};
      for (let letter of letters) {
        const [play] = useSound(`/sounds/${letter}.mp3`, { interrupt: true });
        letterPlayers[letter] = play;
      }
      const [playSyllable] = useSound(`/sounds/${word}.mp3`, { interrupt: true });
      setLetterSounds(letterPlayers);
      setPlaySyllableSound(() => playSyllable);
    };

    loadSounds();
    setClicked([]);
    setStep(0);
  }, [current]);

  const handleClick = (letter, index) => {
    if (step === index && letter === letters[step]) {
      playLetterSounds[letter]?.();
      setClicked([...clicked, index]);
      setStep(step + 1);
    }
  };

  const goToNext = () => {
    if (step === letters.length) {
      if (current < syllables.length - 1) {
        setCurrent(current + 1);
      } else {
        setCurrent("end");
      }
    }
  };

  useEffect(() => {
    if (step === letters.length) {
      playSyllableSound?.();
    }
  }, [step]);

  if (current === "end") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Trophy size={100} className="text-yellow-400 mb-6" />
        <button onClick={() => setCurrent(0)} className="text-xl mt-4">Play Again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-12">
      <div className="flex space-x-4 text-6xl">
        {letters.map((letter, index) => (
          <span
            key={index}
            onClick={() => handleClick(letter, index)}
            className={\`cursor-pointer transition-colors duration-300 \${clicked.includes(index) ? "text-green-600" : "text-black"}\`}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className={\`text-5xl \${step === letters.length ? "text-green-600" : "text-black"}\`}>
        {word}
      </div>
      {step === letters.length && (
        <button onClick={goToNext} className="fixed bottom-6 right-6 text-2xl">
          <ArrowRight />
        </button>
      )}
    </div>
  );
};

export default SyllableGame;
