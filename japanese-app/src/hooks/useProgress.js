import { useState, useEffect } from "react";

const STORAGE_KEY = "jp_progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function recordResult(char, correct) {
    setProgress((prev) => {
      const entry = prev[char] || { correct: 0, wrong: 0 };
      return {
        ...prev,
        [char]: {
          correct: entry.correct + (correct ? 1 : 0),
          wrong: entry.wrong + (correct ? 0 : 1),
        },
      };
    });
  }

  function resetProgress() {
    setProgress({});
  }

  return { progress, recordResult, resetProgress };
}
