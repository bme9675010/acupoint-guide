// 🤏 畫布雙指縮放 / 滾輪縮放 / 拖曳平移 + 鍵盤無障礙尋穴 (Tab + Enter/Space/方向鍵)
import { state } from './state.js';

const BASE_W = 400;
const BASE_H = 680;

let viewBoxState = { x: 0, y: 0, w: BASE_W, h: BASE_H };
let activePointers = new Map();
let lastPanPoint = null;
let initialPinchDist = null;
let initialPinchBox = null;
let movedDuringPointer = false;

export function setCurrentViewBox(x, y, w, h) {
  viewBoxState = { x, y, w, h };
  const svg = document.getElementById('bodySvg');
  if (svg) {
    svg.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  }
  const resetBtn = document.getElementById('resetZoomFloatingBtn');
  const isZoomed = w < BASE_W - 5;
  state.isZoomedIn = isZoomed;
  if (resetBtn) {
    resetBtn.style.display = isZoomed ? 'inline-block' : 'none';
  }
}

export function resetViewBoxTransform() {
  setCurrentViewBox(0, 0, BASE_W, BASE_H);
}

function clampViewBox(x, y, w, h) {
  const clampedW = Math.max(110, Math.min(BASE_W, w));
  const clampedH = (clampedW / BASE_W) * BASE_H;
  const clampedX = Math.max(0, Math.min(BASE_W - clampedW, x));
  const clampedY = Math.max(0, Math.min(BASE_H - clampedH, y));
  return { x: clampedX, y: clampedY, w: clampedW, h: clampedH };
}

export function initCanvasGestures() {
  const svg = document.getElementById('bodySvg');
  if (!svg) return;

  // 滑鼠滾輪縮放
  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      const zoomFactor = e.deltaY < 0 ? 0.86 : 1.16;
      const nextW = viewBoxState.w * zoomFactor;
      const nextH = viewBoxState.h * zoomFactor;
      const nextX = viewBoxState.x + (viewBoxState.w - nextW) * relX;
      const nextY = viewBoxState.y + (viewBoxState.h - nextH) * relY;

      const next = clampViewBox(nextX, nextY, nextW, nextH);
      setCurrentViewBox(next.x, next.y, next.w, next.h);
    },
    { passive: false }
  );

  // Pointer Events：支援單指/滑鼠拖曳（放大時）與雙指 Pinch 縮放
  svg.addEventListener('pointerdown', (e) => {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedDuringPointer = false;

    if (activePointers.size === 1) {
      lastPanPoint = { x: e.clientX, y: e.clientY };
    } else if (activePointers.size === 2) {
      const pts = [...activePointers.values()];
      initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialPinchBox = { ...viewBoxState };
    }
  });

  svg.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (activePointers.size === 2 && initialPinchDist && initialPinchBox) {
      const pts = [...activePointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (dist > 12) {
        movedDuringPointer = true;
        const scale = initialPinchDist / dist;
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        const relX = (midX - rect.left) / rect.width;
        const relY = (midY - rect.top) / rect.height;

        const nextW = initialPinchBox.w * scale;
        const nextH = initialPinchBox.h * scale;
        const nextX = initialPinchBox.x + (initialPinchBox.w - nextW) * relX;
        const nextY = initialPinchBox.y + (initialPinchBox.h - nextH) * relY;
        const next = clampViewBox(nextX, nextY, nextW, nextH);
        setCurrentViewBox(next.x, next.y, next.w, next.h);
      }
    } else if (activePointers.size === 1 && lastPanPoint && viewBoxState.w < BASE_W - 2) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      if (Math.hypot(dx, dy) > 4) {
        movedDuringPointer = true;
      }
      const svgDx = (dx / rect.width) * viewBoxState.w;
      const svgDy = (dy / rect.height) * viewBoxState.h;
      const next = clampViewBox(
        viewBoxState.x - svgDx,
        viewBoxState.y - svgDy,
        viewBoxState.w,
        viewBoxState.h
      );
      setCurrentViewBox(next.x, next.y, next.w, next.h);
      lastPanPoint = { x: e.clientX, y: e.clientY };
    }
  });

  const clearPointer = (e) => {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) {
      initialPinchDist = null;
      initialPinchBox = null;
    }
    if (activePointers.size === 1) {
      const remaining = [...activePointers.values()][0];
      lastPanPoint = { x: remaining.x, y: remaining.y };
    } else {
      lastPanPoint = null;
    }
  };

  svg.addEventListener('pointerup', clearPointer);
  svg.addEventListener('pointercancel', clearPointer);
  svg.addEventListener('pointerleave', clearPointer);
}

export function wasDraggingCanvas() {
  return movedDuringPointer;
}

// ⌨️ 綁定 SVG 穴位點鍵盤操作（Enter / Space 選取、左右方向鍵切換穴位）
export function bindNodeKeyboardEvents(svg, onSelectPoint) {
  const nodes = [...svg.querySelectorAll('.acupoint-node[tabindex="0"]')];
  nodes.forEach((node, idx) => {
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const pid = node.getAttribute('data-point-id');
        if (pid) onSelectPoint(pid);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = nodes[(idx + 1) % nodes.length];
        next?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = nodes[(idx - 1 + nodes.length) % nodes.length];
        prev?.focus();
      }
    });
  });
}
