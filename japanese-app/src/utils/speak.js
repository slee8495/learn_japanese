export function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.85;
  speechSynthesis.speak(utt);
}
