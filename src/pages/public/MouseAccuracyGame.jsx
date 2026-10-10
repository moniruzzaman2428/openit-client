import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaBolt,
  FaBullseye,
  FaClock,
  FaCompress,
  FaCrosshairs,
  FaExpand,
  FaFire,
  FaPause,
  FaPlay,
  FaRedo,
  FaSignOutAlt,
  FaTrash,
  FaTrophy,
} from 'react-icons/fa';

// ============================================================
// CONFIG
// ============================================================

const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    hint: 'Big targets, relaxed pace',
    size: 78,
    life: 2600,
    interval: 980,
    maxTargets: 3,
  },
  medium: {
    label: 'Medium',
    hint: 'Balanced speed and size',
    size: 64,
    life: 2000,
    interval: 800,
    maxTargets: 4,
  },
  hard: {
    label: 'Hard',
    hint: 'Small, fast, unforgiving',
    size: 50,
    life: 1500,
    interval: 640,
    maxTargets: 5,
  },
};

const DURATIONS = [15, 30, 45, 60];
const STORAGE_KEY = 'aim-trainer:v2';
const MAX_HISTORY = 20;

// ============================================================
// HELPERS
// ============================================================

const emptyStore = () => ({ history: [], best: {} });

const loadStore = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return {
      history: Array.isArray(parsed.history) ? parsed.history : [],
      best: parsed.best && typeof parsed.best === 'object' ? parsed.best : {},
    };
  } catch {
    return emptyStore();
  }
};

const saveStore = (store) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable – ignore */
  }
};

const formatClock = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const getGrade = (accuracy, hitRate) => {
  const composite = accuracy * 0.5 + hitRate * 0.5;
  if (composite >= 92) {
    return { name: 'Elite', note: 'Razor-sharp precision and speed.', color: 'text-amber-300', ring: 'ring-amber-300/40' };
  }
  if (composite >= 82) {
    return { name: 'Pro', note: 'Excellent control. Very few wasted clicks.', color: 'text-cyan-300', ring: 'ring-cyan-300/40' };
  }
  if (composite >= 68) {
    return { name: 'Skilled', note: 'Solid aim. Work on consistency.', color: 'text-emerald-300', ring: 'ring-emerald-300/40' };
  }
  return { name: 'Rookie', note: 'Slow down, aim first, then speed up.', color: 'text-slate-300', ring: 'ring-slate-300/30' };
};

const initialHud = (duration = 30) => ({
  score: 0,
  hits: 0,
  misses: 0,
  escaped: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: duration,
});

// ============================================================
// STYLES (keyframes are GPU-friendly: transform + opacity only)
// ============================================================

const AIM_STYLES = `
@keyframes aim-ring {
  0%   { transform: scale(2.6); opacity: 0; }
  12%  { opacity: 0.95; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes aim-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes aim-ripple {
  0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0.85; }
  100% { transform: translate(-50%, -50%) scale(2.1); opacity: 0; }
}
@keyframes aim-float {
  0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
  15%  { transform: translate(-50%, -80%) scale(1.05); opacity: 1; }
  100% { transform: translate(-50%, -230%) scale(1); opacity: 0; }
}
@keyframes aim-miss {
  0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9; }
  100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
}
@keyframes aim-count {
  0%   { transform: scale(1.6); opacity: 0; }
  30%  { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.92); opacity: 0.85; }
}
@media (prefers-reduced-motion: reduce) {
  .aim-anim { animation-duration: 0.01ms !important; }
}
`;

// ============================================================
// SMALL UI PIECES
// ============================================================

const Stat = ({ label, value, accent = 'text-white', sub }) => (
  <div className="flex min-w-0 flex-col rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06]">
    <span className="text-[11px] font-medium text-slate-400">{label}</span>
    <span className={`truncate text-xl font-semibold tabular-nums leading-tight sm:text-2xl ${accent}`}>
      {value}
    </span>
    {sub ? <span className="text-[10px] text-slate-500">{sub}</span> : null}
  </div>
);

const IconButton = ({ onClick, label, children, tone = 'default' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
      tone === 'danger'
        ? 'bg-rose-500/10 text-rose-300 ring-rose-400/20 hover:bg-rose-500/20'
        : 'bg-white/[0.05] text-slate-200 ring-white/10 hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

const ReactionSpark = ({ values }) => {
  if (values.length < 2) return null;

  const data = values.slice(-40);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const w = 240;
  const h = 56;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - 6 - ((v - min) / range) * (h - 12);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const MouseAccuracyGame = () => {
  // ---------- UI state ----------
  const [phase, setPhase] = useState('setup'); // setup | countdown | playing | paused | done
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(30);
  const [countdown, setCountdown] = useState(3);

  const [hud, setHud] = useState(initialHud(30));
  const [targets, setTargets] = useState([]);
  const [effects, setEffects] = useState([]);
  const [result, setResult] = useState(null);
  const [store, setStore] = useState(emptyStore);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ---------- refs ----------
  const containerRef = useRef(null);
  const arenaRef = useRef(null);
  const finishRef = useRef(null);

  // Mutable game state – lives outside React so the loop never re-renders per frame
  const G = useRef({
    phase: 'setup',
    clock: 0, // game time in ms (only advances while playing)
    duration: 30,
    cfgKey: 'medium',
    cfg: DIFFICULTIES.medium,
    targets: [],
    id: 0,
    nextSpawn: 0,
    lastSec: 30,
    area: { w: 0, h: 0 },
    score: 0,
    hits: 0,
    misses: 0,
    escaped: 0,
    combo: 0,
    maxCombo: 0,
    reactions: [],
    fxId: 0,
  }).current;

  // ---------- helpers ----------
  const syncHud = useCallback(() => {
    setHud({
      score: G.score,
      hits: G.hits,
      misses: G.misses,
      escaped: G.escaped,
      combo: G.combo,
      maxCombo: G.maxCombo,
      timeLeft: Math.max(0, Math.ceil((G.duration * 1000 - G.clock) / 1000)),
    });
  }, [G]);

  const pushEffect = useCallback(
    (effect) => {
      G.fxId += 1;
      const item = { ...effect, id: G.fxId };
      setEffects((prev) => (prev.length > 24 ? [...prev.slice(-16), item] : [...prev, item]));
    },
    [G]
  );

  const removeEffect = useCallback((id) => {
    setEffects((prev) => prev.filter((fx) => fx.id !== id));
  }, []);

  useEffect(() => {
    G.phase = phase;
  }, [phase, G]);

  // Load saved scores once
  useEffect(() => {
    setStore(loadStore());
  }, []);

  // ============================================================
  // ARENA SIZE
  // ============================================================

  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return undefined;

    const update = () => {
      const rect = el.getBoundingClientRect();
      G.area = { w: rect.width, h: rect.height };
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, G]);

  // ============================================================
  // START / COUNTDOWN
  // ============================================================

  const startSession = useCallback(() => {
    const cfg = DIFFICULTIES[difficulty];

    G.clock = 0;
    G.duration = duration;
    G.cfgKey = `${difficulty}-${duration}`;
    G.cfg = cfg;
    G.targets = [];
    G.id = 0;
    G.nextSpawn = 250;
    G.lastSec = duration;
    G.score = 0;
    G.hits = 0;
    G.misses = 0;
    G.escaped = 0;
    G.combo = 0;
    G.maxCombo = 0;
    G.reactions = [];

    setTargets([]);
    setEffects([]);
    setResult(null);
    setHud(initialHud(duration));
    setCountdown(3);
    setPhase('countdown');
  }, [difficulty, duration, G]);

  useEffect(() => {
    if (phase !== 'countdown') return undefined;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [phase]);

  // ============================================================
  // FINISH
  // ============================================================

  finishRef.current = () => {
    const shots = G.hits + G.misses;
    const accuracy = shots > 0 ? Math.round((G.hits / shots) * 100) : 0;
    const targetsTotal = G.hits + G.escaped;
    const hitRate = targetsTotal > 0 ? Math.round((G.hits / targetsTotal) * 100) : 0;

    const reactions = G.reactions.slice();
    const avgReaction = reactions.length
      ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length)
      : 0;
    const bestReaction = reactions.length ? Math.round(Math.min(...reactions)) : 0;

    const saved = loadStore();
    const previousBest = saved.best[G.cfgKey] || 0;
    const isNewBest = G.score > 0 && G.score > previousBest;

    const entry = {
      date: new Date().toISOString(),
      score: G.score,
      accuracy,
      hitRate,
      hits: G.hits,
      misses: G.misses,
      escaped: G.escaped,
      maxCombo: G.maxCombo,
      avgReaction,
      bestReaction,
      duration: G.duration,
      difficulty: G.cfgKey.split('-')[0],
    };

    const nextStore = {
      history: [entry, ...saved.history].slice(0, MAX_HISTORY),
      best: isNewBest ? { ...saved.best, [G.cfgKey]: G.score } : saved.best,
    };

    saveStore(nextStore);
    setStore(nextStore);

    G.targets = [];
    setTargets([]);
    setEffects([]);
    setResult({ ...entry, reactions, isNewBest, previousBest });
    setPhase('done');
  };

  // ============================================================
  // GAME LOOP (single requestAnimationFrame – smooth & cheap)
  // ============================================================

  useEffect(() => {
    if (phase !== 'playing') return undefined;

    let raf = 0;
    let last = performance.now();

    const spawn = () => {
      const { w, h } = G.area;
      if (!w || !h) return;

      const cfg = G.cfg;
      const ramp = Math.min(G.clock / (G.duration * 1000), 1);
      const size = Math.round(cfg.size * (1 - 0.22 * ramp) * (0.92 + Math.random() * 0.16));
      const margin = size / 2 + 10;

      let x = 0;
      let y = 0;
      let placed = false;

      for (let i = 0; i < 16 && !placed; i += 1) {
        x = margin + Math.random() * Math.max(1, w - margin * 2);
        y = margin + Math.random() * Math.max(1, h - margin * 2);
        placed = G.targets.every(
          (t) => Math.hypot(t.x * w - x, t.y * h - y) > (t.size + size) / 2 + 16
        );
      }

      if (!placed) return;

      G.id += 1;
      G.targets = [
        ...G.targets,
        {
          id: G.id,
          x: x / w,
          y: y / h,
          size,
          born: G.clock,
          life: Math.round(cfg.life * (1 - 0.2 * ramp)),
        },
      ];
      setTargets(G.targets);
    };

    const frame = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      G.clock += dt;

      // ---- expire old targets ----
      let expired = false;
      const alive = [];
      for (const t of G.targets) {
        if (G.clock - t.born >= t.life) {
          expired = true;
          G.escaped += 1;
          G.combo = 0;
          pushEffect({ kind: 'miss', x: t.x, y: t.y });
        } else {
          alive.push(t);
        }
      }
      if (expired) {
        G.targets = alive;
        setTargets(alive);
        syncHud();
      }

      // ---- spawn ----
      if (G.clock >= G.nextSpawn && G.targets.length < G.cfg.maxTargets) {
        spawn();
        const ramp = Math.min(G.clock / (G.duration * 1000), 1);
        G.nextSpawn =
          G.clock + G.cfg.interval * (1 - 0.25 * ramp) * (0.85 + Math.random() * 0.3);
      }

      // ---- timer ----
      const timeLeft = Math.max(0, Math.ceil((G.duration * 1000 - G.clock) / 1000));
      if (timeLeft !== G.lastSec) {
        G.lastSec = timeLeft;
        syncHud();
      }

      if (G.clock >= G.duration * 1000) {
        finishRef.current?.();
        return;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, G, pushEffect, syncHud]);

  // ============================================================
  // INPUT
  // ============================================================

  const handleHit = (event, id) => {
    event.stopPropagation();
    if (G.phase !== 'playing') return;

    const target = G.targets.find((t) => t.id === id);
    if (!target) return;

    G.targets = G.targets.filter((t) => t.id !== id);
    setTargets(G.targets);

    const reaction = G.clock - target.born;
    G.reactions.push(reaction);

    const speedFactor = Math.max(0, 1 - reaction / target.life);
    const multiplier = 1 + Math.min(Math.floor(G.combo / 5), 6) * 0.25;
    const points = Math.round((50 + 100 * speedFactor) * multiplier);

    G.score += points;
    G.hits += 1;
    G.combo += 1;
    G.maxCombo = Math.max(G.maxCombo, G.combo);

    pushEffect({ kind: 'hit', x: target.x, y: target.y, size: target.size, text: `+${points}` });
    syncHud();
  };

  const handleArenaPointerDown = (event) => {
    if (G.phase !== 'playing') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    G.misses += 1;
    G.combo = 0;
    pushEffect({ kind: 'miss', x, y });
    syncHud();
  };

  // ============================================================
  // PAUSE / QUIT
  // ============================================================

  const pauseGame = useCallback(() => {
    if (G.phase === 'playing') setPhase('paused');
  }, [G]);

  const resumeGame = useCallback(() => {
    if (G.phase === 'paused') setPhase('playing');
  }, [G]);

  const quitToSetup = useCallback(() => {
    G.targets = [];
    setTargets([]);
    setEffects([]);
    setPhase('setup');
  }, [G]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 'p') {
        if (G.phase === 'playing') {
          event.preventDefault();
          setPhase('paused');
        } else if (G.phase === 'paused' && event.key.toLowerCase() === 'p') {
          event.preventDefault();
          setPhase('playing');
        }
      }
    };

    const onBlur = () => {
      if (G.phase === 'playing') setPhase('paused');
    };

    const onVisibility = () => {
      if (document.hidden && G.phase === 'playing') setPhase('paused');
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [G]);

  // ============================================================
  // FULLSCREEN
  // ============================================================

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current?.requestFullscreen?.();
      }
    } catch {
      /* not supported – ignore */
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const clearHistory = () => {
    const cleared = emptyStore();
    saveStore(cleared);
    setStore(cleared);
  };

  // ============================================================
  // DERIVED
  // ============================================================

  const shots = hud.hits + hud.misses;
  const liveAccuracy = shots > 0 ? Math.round((hud.hits / shots) * 100) : null;
  const multiplier = 1 + Math.min(Math.floor(hud.combo / 5), 6) * 0.25;
  const timeProgress = duration > 0 ? (hud.timeLeft / duration) * 100 : 0;
  const bestForSelection = store.best[`${difficulty}-${duration}`] || 0;
  const running = phase === 'playing';
  const showArena = phase === 'countdown' || phase === 'playing' || phase === 'paused';

  // ============================================================
  // RENDER: SETUP
  // ============================================================

  const renderSetup = () => (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-300 ring-1 ring-cyan-300/25">
          <FaCrosshairs />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Aim Trainer
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Click each target before its ring closes. Fast, clean hits score more.
          </p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <div className="mb-2 text-sm font-medium text-slate-300">Difficulty</div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DIFFICULTIES).map(([key, cfg]) => {
            const active = difficulty === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDifficulty(key)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-3 text-left ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  active
                    ? 'bg-cyan-400/10 ring-cyan-300/50'
                    : 'bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <div className={`text-sm font-semibold ${active ? 'text-cyan-200' : 'text-slate-200'}`}>
                  {cfg.label}
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-slate-400">{cfg.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <FaClock className="text-xs text-slate-500" />
          Session length
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map((value) => {
            const active = duration === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setDuration(value)}
                aria-pressed={active}
                className={`rounded-xl py-2.5 text-sm font-semibold tabular-nums ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  active
                    ? 'bg-cyan-400/10 text-cyan-200 ring-cyan-300/50'
                    : 'bg-white/[0.03] text-slate-300 ring-white/10 hover:bg-white/[0.06]'
                }`}
              >
                {value}s
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FaTrophy className="text-amber-300/80" />
          Your best on this setting
        </div>
        <div className="text-lg font-semibold tabular-nums text-white">
          {bestForSelection ? bestForSelection.toLocaleString() : '–'}
        </div>
      </div>

      <button
        type="button"
        onClick={startSession}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <FaPlay className="text-sm" />
        Start training
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        Press Esc or P to pause. The game also pauses when you switch tabs.
      </p>
    </div>
  );

  // ============================================================
  // RENDER: ARENA
  // ============================================================

  const renderTarget = (t) => (
    <div
      key={t.id}
      className="absolute"
      style={{
        left: `${t.x * 100}%`,
        top: `${t.y * 100}%`,
        width: t.size,
        height: t.size,
        marginLeft: -t.size / 2,
        marginTop: -t.size / 2,
        zIndex: 10,
      }}
    >
      {/* closing ring = remaining time */}
      <div
        className="aim-anim pointer-events-none absolute inset-0 rounded-full border-2 border-cyan-300/80"
        style={{
          animation: `aim-ring ${t.life}ms linear forwards`,
          animationPlayState: running ? 'running' : 'paused',
          willChange: 'transform, opacity',
        }}
      />

      {/* clickable body */}
      <div
        role="button"
        tabIndex={-1}
        aria-label="Target"
        onPointerDown={(e) => handleHit(e, t.id)}
        className="aim-anim absolute inset-0 cursor-crosshair touch-none rounded-full"
        style={{
          animation: 'aim-pop 160ms ease-out both',
          background:
            'radial-gradient(circle at 35% 30%, #fb7185 0%, #e11d48 55%, #9f1239 100%)',
          boxShadow: '0 0 0 3px rgba(255,255,255,0.18), 0 8px 24px rgba(225,29,72,0.35)',
          willChange: 'transform',
        }}
      >
        <div className="pointer-events-none absolute inset-[18%] rounded-full border-2 border-white/60" />
        <div className="pointer-events-none absolute inset-[40%] rounded-full bg-white" />
      </div>
    </div>
  );

  const renderEffect = (fx) => {
    if (fx.kind === 'hit') {
      return (
        <div key={fx.id} className="pointer-events-none absolute z-20" style={{ left: `${fx.x * 100}%`, top: `${fx.y * 100}%` }}>
          <div
            className="aim-anim absolute rounded-full border-2 border-cyan-300"
            style={{
              width: fx.size,
              height: fx.size,
              left: 0,
              top: 0,
              animation: 'aim-ripple 450ms ease-out forwards',
            }}
          />
          <div
            onAnimationEnd={() => removeEffect(fx.id)}
            className="aim-anim absolute whitespace-nowrap text-sm font-bold tabular-nums text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            style={{ left: 0, top: 0, animation: 'aim-float 700ms ease-out forwards' }}
          >
            {fx.text}
          </div>
        </div>
      );
    }

    return (
      <div
        key={fx.id}
        onAnimationEnd={() => removeEffect(fx.id)}
        className="aim-anim pointer-events-none absolute z-20 flex h-6 w-6 items-center justify-center text-lg font-bold leading-none text-rose-400"
        style={{
          left: `${fx.x * 100}%`,
          top: `${fx.y * 100}%`,
          animation: 'aim-miss 420ms ease-out forwards',
        }}
      >
        ×
      </div>
    );
  };

  const renderGame = () => (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* HUD */}
      <div className="border-b border-white/[0.06] bg-slate-950/60 px-3 py-3 sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Score" value={hud.score.toLocaleString()} accent="text-cyan-200" />
          <Stat
            label="Accuracy"
            value={liveAccuracy === null ? '–' : `${liveAccuracy}%`}
            accent="text-emerald-300"
          />
          <Stat
            label="Combo"
            value={hud.combo}
            accent={hud.combo >= 5 ? 'text-amber-300' : 'text-white'}
            sub={multiplier > 1 ? `×${multiplier.toFixed(2)} bonus` : undefined}
          />
          <Stat
            label="Time left"
            value={formatClock(hud.timeLeft)}
            accent={hud.timeLeft <= 5 ? 'text-rose-300' : 'text-white'}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-400"
              style={{
                width: `${timeProgress}%`,
                transition: 'width 1s linear',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={running ? pauseGame : resumeGame}
              label={running ? 'Pause' : 'Resume'}
            >
              {running ? <FaPause /> : <FaPlay />}
            </IconButton>
            <IconButton
              onClick={toggleFullscreen}
              label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </IconButton>
            <IconButton onClick={quitToSetup} label="Quit session" tone="danger">
              <FaSignOutAlt />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Arena */}
      <div className="relative min-h-[380px] flex-1 p-3 sm:p-4">
        <div
          ref={arenaRef}
          onPointerDown={handleArenaPointerDown}
          className="relative h-full min-h-[360px] w-full touch-none select-none overflow-hidden rounded-2xl bg-[#071827] ring-1 ring-white/10"
          style={{ cursor: 'crosshair' }}
        >
          {/* grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, rgba(0,0,0,0.35) 100%)',
            }}
          />

          {targets.map(renderTarget)}
          {effects.map(renderEffect)}

          {/* Countdown */}
          {phase === 'countdown' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/55 backdrop-blur-[2px]">
              <div
                key={countdown}
                className="aim-anim text-7xl font-bold tabular-nums text-white sm:text-8xl"
                style={{ animation: 'aim-count 800ms ease-out both' }}
              >
                {countdown > 0 ? countdown : 'Go'}
              </div>
              <p className="mt-3 text-sm text-slate-300">Get your hand ready</p>
            </div>
          )}

          {/* Paused */}
          {phase === 'paused' && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-slate-950/75 backdrop-blur-sm"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">Paused</div>
                <p className="mt-1 text-sm text-slate-400">Your timer and targets are frozen.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resumeGame}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <FaPlay className="text-xs" /> Resume
                </button>
                <button
                  type="button"
                  onClick={startSession}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <FaRedo className="text-xs" /> Restart
                </button>
                <button
                  type="button"
                  onClick={quitToSetup}
                  className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 ring-1 ring-rose-400/25 transition hover:bg-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <FaSignOutAlt className="text-xs" /> Quit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER: RESULTS
  // ============================================================

  const renderResults = () => {
    if (!result) return null;
    const grade = getGrade(result.accuracy, result.hitRate);

    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] ring-2 ${grade.ring}`}
          >
            <FaTrophy className={`text-3xl ${grade.color}`} />
          </div>
          <h2 className={`mt-4 text-3xl font-semibold ${grade.color}`}>{grade.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{grade.note}</p>

          {result.isNewBest && (
            <div className="mt-3 rounded-full bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-300/30">
              New personal best
              {result.previousBest ? ` – previous ${result.previousBest.toLocaleString()}` : ''}
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Score" value={result.score.toLocaleString()} accent="text-cyan-200" />
          <Stat label="Accuracy" value={`${result.accuracy}%`} accent="text-emerald-300" sub={`${result.hits} hits, ${result.misses} stray clicks`} />
          <Stat label="Best combo" value={result.maxCombo} accent="text-amber-300" />
          <Stat label="Avg reaction" value={`${result.avgReaction}ms`} accent="text-violet-300" sub={result.bestReaction ? `fastest ${result.bestReaction}ms` : undefined} />
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.06]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">Targets hit</span>
              <span className="font-semibold tabular-nums text-white">
                {result.hits} / {result.hits + result.escaped}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${result.hitRate}%`, transition: 'width 900ms ease-out' }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {result.escaped} {result.escaped === 1 ? 'target' : 'targets'} escaped
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.06]">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-300">Reaction time trend</span>
              <span className="text-xs text-slate-500">lower is better</span>
            </div>
            <ReactionSpark values={result.reactions} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={startSession}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaRedo className="text-xs" />
            Play again
          </button>
          <button
            type="button"
            onClick={quitToSetup}
            className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Change settings
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: HISTORY
  // ============================================================

  const renderHistory = () => {
    if (!store.history.length || showArena) return null;

    return (
      <div className="border-t border-white/[0.06] bg-slate-950/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FaBullseye className="text-cyan-300/80" />
              Recent sessions
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-white/5 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <FaTrash className="text-[10px]" /> Clear
            </button>
          </div>

          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {store.history.slice(0, 8).map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm ring-1 ring-white/[0.05] sm:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr]"
              >
                <span className="truncate text-xs text-slate-500">
                  {new Date(item.date).toLocaleDateString()} · {DIFFICULTIES[item.difficulty]?.label || 'Medium'} · {item.duration}s
                </span>
                <span className="font-semibold tabular-nums text-white sm:text-left">
                  {item.score.toLocaleString()}
                </span>
                <span className="tabular-nums text-emerald-300">{item.accuracy}%</span>
                <span className="hidden items-center gap-1 tabular-nums text-amber-300 sm:flex">
                  <FaFire className="text-[10px]" /> {item.maxCombo}
                </span>
                <span className="hidden items-center gap-1 tabular-nums text-slate-400 sm:flex">
                  <FaBolt className="text-[10px]" /> {item.avgReaction}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="w-full bg-gradient-to-b from-slate-100 to-slate-200 p-3 sm:p-6">
      <style>{AIM_STYLES}</style>

      <div
        ref={containerRef}
        className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden bg-[#050f1b] text-slate-200 shadow-2xl ring-1 ring-black/20 sm:rounded-3xl"
        style={{
          minHeight: isFullscreen ? '100vh' : 640,
          height: isFullscreen ? '100vh' : undefined,
          borderRadius: isFullscreen ? 0 : undefined,
        }}
      >
        {/* Top bar (setup & results only – HUD takes over while playing) */}
        {!showArena && (
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-r from-[#061a2f] to-[#0b3157] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-cyan-200 ring-1 ring-white/10">
                <FaCrosshairs />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Aim Trainer</div>
                <div className="text-xs text-slate-400">Accuracy and reaction practice</div>
              </div>
            </div>
            <IconButton
              onClick={toggleFullscreen}
              label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </IconButton>
          </div>
        )}

        {phase === 'setup' && renderSetup()}
        {showArena && renderGame()}
        {phase === 'done' && renderResults()}

        {renderHistory()}
      </div>
    </div>
  );
};

export default MouseAccuracyGame;
