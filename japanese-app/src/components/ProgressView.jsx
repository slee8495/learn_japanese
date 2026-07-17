import { hiragana, katakana } from "../data/kana";

export default function ProgressView({ progress, onReset }) {
  const all = [...hiragana, ...katakana];
  const attempted = all.filter((k) => progress[k.char]);
  const totalCorrect = attempted.reduce((s, k) => s + (progress[k.char]?.correct || 0), 0);
  const totalWrong = attempted.reduce((s, k) => s + (progress[k.char]?.wrong || 0), 0);
  const total = totalCorrect + totalWrong;
  const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

  const mastered = attempted.filter((k) => {
    const e = progress[k.char];
    return e && e.correct >= 3 && e.correct / (e.correct + e.wrong) >= 0.8;
  });

  return (
    <div className="flex flex-col gap-6 py-8 px-4 max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow border border-sumi-100 p-4 text-center">
          <p className="text-3xl font-bold text-ai-600">{accuracy}%</p>
          <p className="text-sm text-sumi-500 mt-1">전체 정확도</p>
        </div>
        <div className="bg-white rounded-2xl shadow border border-sumi-100 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{mastered.length}</p>
          <p className="text-sm text-sumi-500 mt-1">마스터한 글자</p>
        </div>
        <div className="bg-white rounded-2xl shadow border border-sumi-100 p-4 text-center">
          <p className="text-3xl font-bold text-sumi-700">{total}</p>
          <p className="text-sm text-sumi-500 mt-1">총 풀은 문제</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-sumi-100 p-4">
        <h3 className="text-sumi-700 font-medium mb-3">글자별 성적</h3>
        <div className="flex flex-wrap gap-2">
          {all.map((k) => {
            const e = progress[k.char];
            if (!e) return (
              <span key={k.char} className="w-10 h-10 flex items-center justify-center rounded-xl bg-sumi-100 text-sumi-400 text-lg">
                {k.char}
              </span>
            );
            const acc = e.correct / (e.correct + e.wrong);
            const color = acc >= 0.8 ? "bg-green-100 text-green-700" : acc >= 0.5 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
            return (
              <span key={k.char} className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${color}`} title={`${k.romaji}: ${e.correct}정/${e.wrong}오`}>
                {k.char}
              </span>
            );
          })}
        </div>
        <p className="text-xs text-sumi-400 mt-3">초록 = 잘 알고 있음 / 노랑 = 보통 / 빨강 = 연습 필요 / 회색 = 아직 안 풀어봄</p>
      </div>

      <button
        className="py-3 px-6 bg-red-50 border border-red-200 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
        onClick={() => { if (confirm("진도를 초기화할까요?")) onReset(); }}
      >
        진도 초기화
      </button>
    </div>
  );
}
