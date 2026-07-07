import { useEffect, useRef, useState } from "react";

const PEN_WIDTH = 2.5;
const ERASE_RADIUS = 16;
const PAPER_INITIAL_HEIGHT = 1600;
const PAPER_GROW_STEP = 900;
const GROW_THRESHOLD = 300; // 바닥에서 이만큼 남으면 종이를 늘림
const SCROLL_MARGIN = 140;

function getPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches?.[0];
  const clientX = touch ? touch.clientX : e.clientX;
  const clientY = touch ? touch.clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function strokeHitsPoint(stroke, pos, radius) {
  return stroke.points.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) <= radius);
}

function averageTouchY(touches) {
  let sum = 0;
  for (let i = 0; i < touches.length; i++) sum += touches[i].clientY;
  return sum / touches.length;
}

export default function ScratchPad() {
  const [open, setOpen] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [paperHeight, setPaperHeight] = useState(PAPER_INITIAL_HEIGHT);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const currentStroke = useRef(null);
  const scrolling = useRef(false);
  const lastTouchY = useRef(0);

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = PEN_WIDTH;
    const all = currentStroke.current ? [...strokes, currentStroke.current] : strokes;
    for (const s of all) {
      if (s.points.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
      ctx.stroke();
    }
  }

  // 종이 크기(=캔버스 크기) 반영 + 다시 그리기. canvas.width/height를 건드리면
  // 캔버스 내용이 초기화되므로 그때마다 strokes로부터 다시 그려준다.
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    function resize() {
      const width = container.clientWidth;
      const ratio = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${paperHeight}px`;
      canvas.width = width * ratio;
      canvas.height = paperHeight * ratio;
      redraw();
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paperHeight]);

  // 지우개로 획을 지웠을 때(=strokes가 바뀌었을 때)만 전체를 다시 그린다.
  // 펜으로 쓰는 동안에는 아래 draw()에서 선분만 이어 그려서 매번 전체를 다시 그리지 않는다.
  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]);

  function growIfNeeded(y) {
    if (y > paperHeight - GROW_THRESHOLD) {
      setPaperHeight((h) => h + PAPER_GROW_STEP);
    }
  }

  function autoScroll(y) {
    const container = containerRef.current;
    if (!container) return;
    const visibleBottom = container.scrollTop + container.clientHeight;
    if (y > visibleBottom - SCROLL_MARGIN) {
      container.scrollTop = y - container.clientHeight + SCROLL_MARGIN;
    }
  }

  function eraseAt(pos) {
    setStrokes((prev) => {
      const next = prev.filter((s) => !strokeHitsPoint(s, pos, ERASE_RADIUS));
      return next.length === prev.length ? prev : next;
    });
  }

  // 손가락 1개 = 그리기/지우개, 손가락 2개 이상 = 스크롤 (마우스는 항상 그리기)
  function startDraw(e) {
    const touches = e.touches;
    if (touches && touches.length >= 2) {
      e.preventDefault();
      scrolling.current = true;
      drawing.current = false;
      currentStroke.current = null;
      lastTouchY.current = averageTouchY(touches);
      return;
    }

    e.preventDefault();
    scrolling.current = false;
    const pos = getPos(e, canvasRef.current);
    drawing.current = true;

    if (isEraser) {
      eraseAt(pos);
    } else {
      currentStroke.current = { points: [pos] };
    }
  }

  function draw(e) {
    const touches = e.touches;
    if (touches && touches.length >= 2) {
      e.preventDefault();
      const y = averageTouchY(touches);
      if (scrolling.current && containerRef.current) {
        containerRef.current.scrollTop += lastTouchY.current - y;
      }
      scrolling.current = true;
      lastTouchY.current = y;
      return;
    }

    if (scrolling.current || !drawing.current) return;
    e.preventDefault();
    const pos = getPos(e, canvasRef.current);

    if (isEraser) {
      eraseAt(pos);
      return;
    }

    const stroke = currentStroke.current;
    const last = stroke.points[stroke.points.length - 1];
    stroke.points.push(pos);

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    growIfNeeded(pos.y);
    autoScroll(pos.y);
  }

  function endDraw(e) {
    const touches = e?.touches;
    // 두 손가락 중 하나를 뗀 경우 등 손가락이 남아있으면 다음 터치 판정까지 대기
    if (touches && touches.length > 0) {
      if (touches.length === 1) scrolling.current = true;
      return;
    }
    scrolling.current = false;
    if (!drawing.current) return;
    drawing.current = false;
    if (!isEraser && currentStroke.current) {
      const finished = currentStroke.current;
      currentStroke.current = null;
      if (finished.points.length > 1) {
        setStrokes((prev) => [...prev, finished]);
      }
    }
  }

  function clearAll() {
    setStrokes([]);
    setPaperHeight(PAPER_INITIAL_HEIGHT);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="낙서장 열기"
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-2xl shadow-lg flex items-center justify-center active:scale-95"
      >
        ✏️
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 gap-2">
        <p className="font-bold text-gray-800 shrink-0">✏️ 낙서장</p>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <button
            onClick={() => setIsEraser(false)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${!isEraser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            펜
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium ${isEraser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            지우개
          </button>
          <button onClick={clearAll} className="px-3 py-1.5 rounded-xl text-sm font-medium bg-red-50 text-red-500">
            전체 지우기
          </button>
          <button onClick={() => setOpen(false)} className="text-gray-400 text-2xl leading-none px-2">
            ×
          </button>
        </div>
      </div>
      {isEraser && (
        <p className="text-center text-xs text-gray-400 py-1 bg-gray-50 border-b border-gray-100">
          획을 톡 누르거나 쓸어서 지워요
        </p>
      )}
      <div ref={containerRef} className="flex-1 overflow-y-auto overscroll-contain">
        <canvas
          ref={canvasRef}
          className="touch-none block"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          onTouchCancel={endDraw}
        />
      </div>
    </div>
  );
}
