import { speak } from "./speak";

let currentAudio = null;

// 챗봇 답변 전체 읽어주기 전용(자연스러운 신경망 음성). 실패 시 기존 브라우저 TTS로 대체.
export function speakNatural(text) {
  if (!text) return;
  speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  let usedFallback = false;
  function toFallback() {
    if (usedFallback) return;
    usedFallback = true;
    speak(text);
  }

  const audio = new Audio(`/api/speak?text=${encodeURIComponent(text)}`);
  currentAudio = audio;
  audio.addEventListener("error", toFallback);
  audio.play().catch(toFallback);
}
