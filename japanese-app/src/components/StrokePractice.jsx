import { useEffect, useRef, useState } from "react";
import { hiragana, katakana } from "../data/kana";
import { getDayLesson } from "../data/curriculum";
import strokeData from "../data/stroke-data.json";

const BOX = 260; // 트레이싱 영역 한 변 크기(px)

function isKanji(ch) {
  const c = ch.codePointAt(0);
  return c >= 0x4e00 && c <= 0x9fff;
}

function getTodayChars(dayNum) {
  if (!dayNum) return [];
  const lesson = getDayLesson(dayNum);
  const kanaChars = (lesson.kana || []).map((k) => k.char).filter((ch) => strokeData[ch]);
  const kanjiChars = [];
  for (const w of lesson.words || []) {
    for (const ch of w.japanese || "") {
      if (isKanji(ch) && strokeData[ch] && !kanjiChars.includes(ch)) kanjiChars.push(ch);
    }
  }
  return [...kanaChars, ...kanjiChars];
}

function getPos(e, el) {
  const rect = el.getBoundingClientRect();
  const touch = e.touches?.[0];
  const clientX = touch ? touch.clientX : e.clientX;
  const clientY = touch ? touch.clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

// 글자 하나를 놓고, 위에는 필순 가이드(SVG), 아래는 따라 쓰는 캔버스를 겹쳐서 보여준다.
function StrokeCanvas({ char, showGuide, replayToken, clearToken }) {
  const data = strokeData[char];
  const pathRefs = useRef([]);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const strokesRef = useRef([]);

  // 글자가 바뀌거나 "필순 보기"를 누르면, 획을 순서대로 그려 보여준다.
  useEffect(() => {
    if (!data) return;
    const paths = pathRefs.current.filter(Boolean);
    if (paths.length === 0) return;

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.transition = "none";
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    // reflow 강제 후 transition 적용 (아니면 최초 상태로 애니메이션이 안 먹음)
    void paths[0].getBoundingClientRect();
    paths.forEach((p, i) => {
      p.style.transition = `stroke-dashoffset 0.45s ease ${i * 0.5}s`;
      p.style.strokeDashoffset = "0";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, replayToken, data]);

  // 글자가 바뀌거나 "지우기"를 누르면 트레이싱 캔버스를 비운다.
  useEffect(() => {
    strokesRef.current = [];
    clearCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, clearToken]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#4338ca";
    ctx.lineWidth = 5;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = BOX * ratio;
    canvas.height = BOX * ratio;
    canvas.style.width = `${BOX}px`;
    canvas.style.height = `${BOX}px`;
    clearCanvas();
  }, []);

  function start(e) {
    e.preventDefault();
    drawing.current = true;
    const pos = getPos(e, canvasRef.current);
    strokesRef.current.push([pos]);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const pos = getPos(e, canvasRef.current);
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    const last = stroke[stroke.length - 1];
    stroke.push(pos);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
  function end() {
    drawing.current = false;
  }

  if (!data) {
    return (
      <div
        className="flex items-center justify-center bg-sumi-50 rounded-2xl text-sm text-sumi-400 mx-auto"
        style={{ width: BOX, height: BOX }}
      >
        이 글자는 아직 필순 데이터가 없어요
      </div>
    );
  }

  return (
    <div className="relative mx-auto rounded-2xl overflow-hidden bg-white border border-sumi-200" style={{ width: BOX, height: BOX }}>
      {showGuide && (
        <svg viewBox="0 0 109 109" className="absolute inset-0 w-full h-full pointer-events-none">
          {data.strokes.map((d, i) => (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el)}
              d={d}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {data.numPos.map((pos, i) =>
            pos ? (
              <text key={i} x={pos[0]} y={pos[1] + 3} fontSize="7" fill="#a5b4fc" fontWeight="600">
                {i + 1}
              </text>
            ) : null
          )}
        </svg>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        onTouchCancel={end}
      />
    </div>
  );
}

function CharChip({ ch, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg font-medium transition-colors ${
        active ? "bg-ai-600 text-white" : "bg-sumi-100 text-sumi-700"
      }`}
    >
      {ch}
    </button>
  );
}

export default function StrokePractice({ dayNum }) {
  const [tab, setTab] = useState("today");
  const [selected, setSelected] = useState(null);
  const [showGuide, setShowGuide] = useState(true);
  const [replayToken, setReplayToken] = useState(0);
  const [clearToken, setClearToken] = useState(0);
  const [search, setSearch] = useState("");

  const todayChars = getTodayChars(dayNum);
  const hiraChars = hiragana.map((k) => k.char);
  const kataChars = katakana.map((k) => k.char);
  const searchChars = [...new Set([...search].filter((ch) => strokeData[ch]))];

  useEffect(() => {
    if (selected) return;
    const first = todayChars[0] || hiraChars[0];
    setSelected(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(ch) {
    setSelected(ch);
    setShowGuide(true);
    setReplayToken((t) => t + 1);
  }

  const list = tab === "today" ? todayChars : tab === "hira" ? hiraChars : tab === "kata" ? kataChars : searchChars;

  return (
    <div className="flex flex-col gap-3 px-3 py-3 max-w-lg mx-auto w-full">
      <div className="flex gap-1.5 bg-sumi-100 rounded-2xl p-1">
        {[
          { id: "today", label: "오늘의 글자" },
          { id: "hira", label: "히라가나" },
          { id: "kata", label: "카타카나" },
          { id: "search", label: "검색" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              tab === t.id ? "bg-white text-ai-600 shadow-sm" : "text-sumi-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="글자나 단어를 입력해보세요 (예: 元気)"
          className="w-full px-3 py-2 rounded-xl border border-sumi-200 text-sm focus:outline-none focus:ring-2 focus:ring-ai-300"
        />
      )}

      {list.length === 0 ? (
        <p className="text-center text-xs text-sumi-400 py-2">
          {tab === "today" ? "오늘의 글자 정보를 불러올 수 없어요" : "찾는 글자가 없어요"}
        </p>
      ) : (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {list.map((ch, i) => (
            <CharChip key={`${ch}-${i}`} ch={ch} active={ch === selected} onClick={() => pick(ch)} />
          ))}
        </div>
      )}

      {selected && (
        <>
          <StrokeCanvas char={selected} showGuide={showGuide} replayToken={replayToken} clearToken={clearToken} />
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setReplayToken((t) => t + 1)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-ai-50 text-ai-600"
            >
              ▶ 필순 보기
            </button>
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-sumi-100 text-sumi-600"
            >
              가이드 {showGuide ? "숨기기" : "보기"}
            </button>
            <button
              onClick={() => setClearToken((t) => t + 1)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-red-50 text-red-500"
            >
              지우기
            </button>
          </div>
        </>
      )}

      <p className="text-center text-[10px] text-sumi-300 pt-1">필순 데이터: KanjiVG (CC BY-SA 3.0)</p>
    </div>
  );
}
