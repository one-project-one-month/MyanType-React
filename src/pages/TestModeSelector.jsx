import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const timeModeData = {
  id: "16",
  userID: "-4226-8640-ffe6af726732",
  wpm: 50,
  raw: 60,
  accuracy: 90.3,
  charactersTyped: 100,
  correct: 90,
  incorrect: 10,
  extra: 1,
  miss: 2,
  consistency: 80,
  timeTaken: 90,
  language: "mm",
  mode: "time",
  timeLimit: 20,
};

const wordsModeData = {
  id: "16",
  userID: "910ffb6d-360c-4226-8640-ffe6af726732",
  mode: "WORDS",
  language: "mm",
  timeLimit: 20,
  wordLimit: null,
  wpm: 100,
  raw: 60,
  accuracy: 90.3,
  charactersTyped: 100,
  correct: 90,
  incorrect: 10,
  extra: 1,
  miss: 2,
  consistency: 80,
  timeTaken: 90,
  createdAt: "2025-05-25707:12:48.519Z",
};

const TestModeSelector = () => {
  const navigate = useNavigate();

  const handleTimeMode = () => {
    navigate('/results', { state: { results: timeModeData } });
  };

  const handleWordsMode = () => {
    navigate('/results', { state: { results: wordsModeData } });
  };

  return (
    <div className="bg-[#0E0F15] min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#F4F4F5]">
          Select Test Mode
        </h1>
        <Button
          onClick={handleTimeMode}
          className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90] hover:text-[#F4F4F5] px-6 py-3"
        >
          Time Mode
        </Button>
        <Button
          onClick={handleWordsMode}
          className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90] hover:text-[#F4F4F5] px-6 py-3"
        >
          Words Mode
        </Button>
      </div>
    </div>
  );
};

export default TestModeSelector;