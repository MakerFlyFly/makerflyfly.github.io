"use client";

import { useEffect, useRef } from "react";

const BACKGROUND_COLORS = ["#f7da3987", "#8fdbe9", "#fffef8"];

type Bubble = {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
  jitter: number;
  blur: number;
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeNoise2D(random = Math.random) {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) {
    p[i] = (random() * 256) | 0;
    p[i + 256] = p[i];
  }

  function grad2(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -2 * v : 2 * v);
  }

  const g2 = (3 - Math.sqrt(3)) / 6;
  const f2 = 0.5 * (Math.sqrt(3) - 1);

  return function noise2D(xin: number, yin: number) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (xin + yin) * f2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * g2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + g2;
    const y1 = y0 - j1 + g2;
    const x2 = x0 - 1 + 2 * g2;
    const y2 = y0 - 1 + 2 * g2;
    const ii = i & 255;
    const jj = j & 255;

    const t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      n0 = t0 * t0 * t0 * t0 * grad2(p[ii + p[jj]], x0, y0);
    }

    const t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      n1 = t1 * t1 * t1 * t1 * grad2(p[ii + i1 + p[jj + j1]], x1, y1);
    }

    const t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      n2 = t2 * t2 * t2 * t2 * grad2(p[ii + 1 + p[jj + 1]], x2, y2);
    }

    return 40 * (n0 + n1 + n2);
  };
}

export function BlurredBubblesBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const noise = useRef(makeNoise2D());
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const canvasElement = canvas;
    const ctx = context;
    let width = canvasElement.clientWidth;
    let height = canvasElement.clientHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bubbles: Bubble[] = [];
    const gridCell = 80;
    const bottomBandStart = 0.8;
    let gridCols = 0;
    let gridRows = 0;
    let grid = new Float32Array(0);
    let lastTime = 0;
    let accumulatedTime = 0;
    const frameInterval = 1000 / 6;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = !reducedMotion && window.innerWidth < 640;
    let animationTimer: number | null = null;

    function allocateGrid() {
      gridCols = Math.max(1, Math.ceil(width / gridCell));
      gridRows = Math.max(1, Math.ceil(height / gridCell));
      grid = new Float32Array(gridCols * gridRows);
    }

    function sizeCanvas() {
      width = canvasElement.clientWidth;
      height = canvasElement.clientHeight;
      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      allocateGrid();
    }

    function stampOccupancy(x: number, y: number, r: number) {
      const c0 = Math.floor((x - r) / gridCell);
      const c1 = Math.floor((x + r) / gridCell);
      const r0 = Math.floor((y - r) / gridCell);
      const r1 = Math.floor((y + r) / gridCell);

      for (let cy = r0; cy <= r1; cy++) {
        for (let cx = c0; cx <= c1; cx++) {
          if (cx < 0 || cy < 0 || cx >= gridCols || cy >= gridRows) continue;
          grid[cy * gridCols + cx] += 0.5;
        }
      }
    }

    function lowestOccupancyTarget() {
      const startRow = Math.floor(gridRows * bottomBandStart);
      let bestIdx = startRow * gridCols;
      let bestVal = Infinity;

      for (let cy = startRow; cy < gridRows; cy++) {
        for (let cx = 0; cx < gridCols; cx++) {
          const idx = cy * gridCols + cx;
          if (grid[idx] < bestVal) {
            bestVal = grid[idx];
            bestIdx = idx;
          }
        }
      }

      return {
        tx: ((bestIdx % gridCols) + 0.5) * gridCell,
        ty: (Math.floor(bestIdx / gridCols) + 0.5) * gridCell,
      };
    }

    function createBubbles() {
      bubbles.length = 0;
      const minRadius = Math.max(180, Math.min(width, height) * 0.24);
      const maxRadius = Math.max(280, Math.min(width, height) * 0.42);
      const minDist = Math.max(minRadius * 0.2, 80);
      let tries = 0;

      while (bubbles.length < 6 && tries < 5000) {
        tries++;
        const r = rand(minRadius, maxRadius);
        const x = rand(-r / 2, width + r / 2);
        const y = rand(height * bottomBandStart, height * 1.2);
        const ok = bubbles.every((bubble) => {
          const distance = Math.hypot(bubble.x - x, bubble.y - y);
          return distance >= (bubble.r + r) * 0.6 && distance >= minDist;
        });

        if (ok) {
          bubbles.push({
            x,
            y,
            r,
            color: BACKGROUND_COLORS[bubbles.length % BACKGROUND_COLORS.length],
            vx: rand(-0.2, 0.2),
            vy: rand(-0.2, 0.2),
            jitter: rand(0.6, 1.2),
            blur: rand(200, 400),
          });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const bubble of bubbles) {
        ctx.save();
        ctx.filter = `blur(${bubble.blur}px)`;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = bubble.color;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function updatePhysics(t: number) {
      const { tx, ty } = lowestOccupancyTarget();

      for (const bubble of bubbles) {
        const n = noise.current(bubble.x * 0.0008, bubble.y * 0.0008 + t * 0.00015);
        const angle = n * Math.PI * 2;
        const dxT = tx - bubble.x;
        const dyT = ty - bubble.y;
        const dT = Math.hypot(dxT, dyT) + 1e-3;
        const bandMin = height * bottomBandStart;
        const bandMax = height * 1.5;

        bubble.vx += Math.cos(angle) * 0.12 * bubble.jitter + (dxT / dT) * 0.05;
        bubble.vy += Math.sin(angle) * 0.12 * bubble.jitter + (dyT / dT) * 0.05;

        if (bubble.y < bandMin) bubble.vy += (bandMin - bubble.y) * 0.01;
        if (bubble.y > bandMax) bubble.vy -= (bubble.y - bandMax) * 0.01;

        bubble.vx *= 0.95;
        bubble.vy *= 0.95;

        const velocity = Math.hypot(bubble.vx, bubble.vy);
        if (velocity > 2) {
          bubble.vx = (bubble.vx / velocity) * 2;
          bubble.vy = (bubble.vy / velocity) * 2;
        }

        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        if (bubble.x < -bubble.r - bubble.blur / 3) bubble.x = width + bubble.r + bubble.blur / 3;
        if (bubble.x > width + bubble.r + bubble.blur / 3) bubble.x = -bubble.r - bubble.blur / 3;

        bubble.y = Math.min(Math.max(bubble.y, bandMin - bubble.r * 0.25), bandMax + bubble.r * 0.25);
        stampOccupancy(bubble.x, bubble.y, bubble.r * 0.6);
      }
    }

    function frame(t: number) {
      if (document.hidden) {
        frameRef.current = requestAnimationFrame(frame);
        return;
      }

      const deltaTime = lastTime ? t - lastTime : 0;
      lastTime = t;
      accumulatedTime += deltaTime;

      if (accumulatedTime >= frameInterval) {
        accumulatedTime = 0;
        updatePhysics(t);
        draw();
      }

      frameRef.current = requestAnimationFrame(frame);
    }

    sizeCanvas();
    createBubbles();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      sizeCanvas();
      createBubbles();
      draw();
    });
    resizeObserver.observe(canvasElement);

    if (shouldAnimate) {
      animationTimer = window.setTimeout(() => {
        frameRef.current = requestAnimationFrame(frame);
      }, 1500);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (animationTimer !== null) {
        window.clearTimeout(animationTimer);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="blurred-bubbles-bg" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
