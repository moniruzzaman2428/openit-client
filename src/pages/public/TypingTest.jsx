// ============================================================
// FILE: TypingTest.jsx
// ============================================================
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FaBolt,
  FaBullseye,
  FaChartLine,
  FaClock,
  FaFire,
  FaKeyboard,
  FaLanguage,
  FaPause,
  FaPlay,
  FaRandom,
  FaRedo,
  FaRocket,
  FaTachometerAlt,
  FaTrash,
  FaTrophy,
} from 'react-icons/fa';
import { englishTexts, bengaliTexts } from '../../components/data/typingData';

// ============================================================
// CONFIG
// ============================================================

const LANGUAGES = {
  english: {
    label: 'English',
    short: 'EN',
    texts: englishTexts,
    font: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  bengali: {
    label: 'বাংলা',
    short: 'বাং',
    texts: bengaliTexts,
    font: '"Noto Sans Bengali", "Hind Siliguri", "Kalpurush", "Nirmala UI", system-ui, sans-serif',
  },
};

const DURATIONS = [
  { value: 30, label: '30s' },
  { value: 60, label: '1m' },
  { value: 120, label: '2m' },
  { value: 180, label: '3m' },
  { value: 300, label: '5m' },
];

const BAG_KEY = 'typing-test:bag:v1';
const STORE_KEY = 'typing-test:store:v1';
const MIN_INITIAL_CHARS = 500; // first passage length
const APPEND_THRESHOLD = 250; // add more text when this close to the end
const MAX_HISTORY = 20;
const LINE_HEIGHT = '2.6rem';
const VIEW_HEIGHT = '7.8rem'; // exactly 3 lines

const FALLBACK_TEXT =
  'The quick brown fox jumps over the lazy dog while the sun sets slowly behind the quiet hills.';

// ============================================================
// STORAGE + RANDOM TEXT (shuffle bag: never repeats until all used)
// ============================================================

const readJSON = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable – ignore */
  }
};

const readStore = () => {
  const s = readJSON(STORE_KEY, null);
  return {
    history: Array.isArray(s?.history) ? s.history : [],
    best: s?.best && typeof s.best === 'object' ? s.best : {},
  };
};

const normalizeText = (text) =>
  String(text).replace(/\s+/g, ' ').trim().normalize('NFC');

const getPool = (language) => {
  const list = LANGUAGES[language]?.texts;
  const pool = Array.isArray(list) ? list.map(normalizeText).filter(Boolean) : [];
  return pool.length ? pool : [FALLBACK_TEXT];
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Picks the next text index from a persisted "bag".
 * Every text is shown once before any repeats, and the first text of a new
 * cycle is never the same as the last one shown – so each visit is different.
 */
const pickText = (language) => {
  const pool = getPool(language);
  const bags = readJSON(BAG_KEY, {});
  const bag = bags[language] || { queue: [], last: -1 };

  let queue = Array.isArray(bag.queue) ? bag.queue.filter((i) => i >= 0 && i < pool.length) : [];

  if (queue.length === 0) {
    queue = shuffle(pool.map((_, i) => i));
    if (pool.length > 1 && queue[0] === bag.last) {
      const swapWith = queue.length - 1;
      [queue[0], queue[swapWith]] = [queue[swapWith], queue[0]];
    }
  }

  const index = queue.shift();
  writeJSON(BAG_KEY, { ...bags, [language]: { queue, last: index } });
  return pool[index];
};

const buildPassage = (language, minChars) => {
  let passage = '';
  for (let i = 0; i < 12 && Array.from(passage).length < minChars; i += 1) {
    const next = pickText(language);
    passage = passage ? `${passage} ${next}` : next;
  }
  return passage;
};

// ============================================================
// HELPERS
// ============================================================

const formatClock = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const getGrade = (wpm, accuracy) => {
  if (wpm >= 60 && accuracy >= 95) {
    return { name: 'Expert', note: 'Outstanding speed with clean accuracy.', icon: FaTrophy, color: 'text-amber-300', ring: 'ring-amber-300/40' };
  }
  if (wpm >= 45 && accuracy >= 90) {
    return { name: 'Advanced', note: 'Excellent, fast and controlled.', icon: FaRocket, color: 'text-cyan-300', ring: 'ring-cyan-300/40' };
  }
  if (wpm >= 30 && accuracy >= 80) {
    return { name: 'Intermediate', note: 'Good progress. Keep your rhythm steady.', icon: FaTachometerAlt, color: 'text-emerald-300', ring: 'ring-emerald-300/40' };
  }
  return { name: 'Beginner', note: 'Focus on accuracy first, speed follows.', icon: FaKeyboard, color: 'text-slate-300', ring: 'ring-slate-300/30' };
};

const initialHud = { wpm: 0, accuracy: 100, errors: 0, streak: 0 };

// ============================================================
// STYLES
// ============================================================

const TT_STYLES = `
@keyframes tt-blink {
  0%, 49% { box-shadow: inset 2px 0 0 #67e8f9; }
  50%, 100% { box-shadow: inset 2px 0 0 transparent; }
}
.tt-caret { box-shadow: inset 2px 0 0 #67e8f9; }
.tt-caret-blink { animation: tt-blink 1.05s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) {
  .tt-caret-blink { animation: none; }
  .tt-scroll { transition: none !important; }
}
`;

// ============================================================
// WORD (memoised – only words whose typed text changed re-render)
// ============================================================

const Word = memo(({ text, typed, caret, blink }) => {
  const letters = Array.from(text);
  const hasSpace = letters[letters.length - 1] === ' ';
  const body = hasSpace ? letters.slice(0, -1) : letters;
  const typedArr = Array.from(typed);

  const classFor = (i, expected) => {
    let cls = 'text-slate-500';
    if (i < typedArr.length) {
      cls =
        typedArr[i] === expected
          ? 'text-slate-100'
          : 'text-rose-400 bg-rose-500/15 rounded-sm';
    }
    if (i === caret) cls += ` tt-caret${blink ? ' tt-caret-blink' : ''}`;
    return cls;
  };

  return (
    <>
      <span style={{ display: 'inline-block' }}>
        {body.map((char, i) => (
          <span key={i} className={classFor(i, char)} data-caret={i === caret ? 'true' : undefined}>
            {char}
          </span>
        ))}
      </span>
      {hasSpace && (
        <span
          style={{ display: 'inline-block' }}
          className={classFor(body.length, ' ')}
          data-caret={caret === body.length ? 'true' : undefined}
        >
          {'\u00A0'}
        </span>
      )}
    </>
  );
});
Word.displayName = 'Word';

// ============================================================
// SMALL UI PIECES
// ============================================================

const Stat = ({ label, value, unit, accent = 'text-white' }) => (
  <div className="flex min-w-0 flex-col rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06]">
    <span className="text-[11px] font-medium text-slate-400">{label}</span>
    <span className={`truncate text-xl font-semibold tabular-nums leading-tight sm:text-2xl ${accent}`}>
      {value}
      {unit ? <span className="ml-1 text-xs font-normal text-slate-500">{unit}</span> : null}
    </span>
  </div>
);

const Segmented = ({ options, value, onChange, disabled, label }) => (
  <div
    role="group"
    aria-label={label}
    className={`inline-flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/10 ${disabled ? 'opacity-50' : ''}`}
  >
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          aria-pressed={active}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed ${
            active ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-white/[0.06]'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

const IconButton = ({ onClick, label, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-sm text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const SpeedChart = ({ samples, duration }) => {
  if (samples.length < 2) {
    return <p className="py-6 text-center text-xs text-slate-500">Run a longer test to see your speed over time.</p>;
  }

  const w = 300;
  const h = 100;
  const maxT = Math.max(samples[samples.length - 1].t, 1);
  const maxV = Math.max(10, ...samples.map((s) => Math.max(s.wpm, s.raw))) * 1.15;
  const x = (t) => (t / maxT) * w;
  const y = (v) => h - (v / maxV) * h;
  const line = (key) => samples.map((s) => `${x(s.t).toFixed(1)},${y(s[key]).toFixed(1)}`).join(' ');
  const area = `0,${h} ${line('wpm')} ${x(samples[samples.length - 1].t).toFixed(1)},${h}`;

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-[10px] tabular-nums text-slate-500">
          <span>{Math.round(maxV)}</span>
          <span>{Math.round(maxV / 2)}</span>
          <span>0</span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-28 w-full" aria-hidden="true">
          {[0, 0.5, 1].map((p) => (
            <line key={p} x1="0" x2={w} y1={h * p} y2={h * p} stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <polygon points={area} fill="rgba(34,211,238,0.12)" />
          <polyline points={line('raw')} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
          <polyline points={line('wpm')} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-between pl-6 text-[10px] text-slate-500">
        <span>0s</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><i className="inline-block h-0.5 w-3 bg-cyan-400" /> Net</span>
          <span className="flex items-center gap-1"><i className="inline-block h-0.5 w-3 bg-slate-500" /> Gross</span>
        </span>
        <span>{Math.min(duration, maxT)}s</span>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const TypingTest = () => {
  // ---------- state ----------
  const [language, setLanguage] = useState('english');
  const [duration, setDuration] = useState(60);
  const [phase, setPhase] = useState('loading'); // loading | idle | running | paused | done
  const [passage, setPassage] = useState('');
  const [typed, setTyped] = useState([]); // array of code points
  const [hud, setHud] = useState(initialHud);
  const [timeLeft, setTimeLeft] = useState(60);
  const [result, setResult] = useState(null);
  const [store, setStore] = useState(() => ({ history: [], best: {} }));
  const [focused, setFocused] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);

  // ---------- refs ----------
  const inputRef = useRef(null);
  const areaRef = useRef(null);
  const innerRef = useRef(null);
  const finishRef = useRef(null);
  const phaseRef = useRef('loading');
  const typedRef = useRef([]);

  const S = useRef({
    startAt: 0,
    pausedAt: 0,
    pausedTotal: 0,
    duration: 60,
    language: 'english',
    keystrokes: 0,
    errorKeys: 0,
    streak: 0,
    bestStreak: 0,
    samples: [],
    lastSample: 0,
    base: '',
    appending: false,
  }).current;

  phaseRef.current = phase;
  S.duration = duration;
  S.language = language;

  const chars = useMemo(() => Array.from(passage), [passage]);
  const charsRef = useRef(chars);
  charsRef.current = chars;

  const words = useMemo(() => {
    const out = [];
    let start = 0;
    let buf = '';
    let count = 0;
    chars.forEach((c, i) => {
      buf += c;
      count += 1;
      if (c === ' ') {
        out.push({ start, text: buf, len: count });
        start = i + 1;
        buf = '';
        count = 0;
      }
    });
    if (buf) out.push({ start, text: buf, len: count });
    return out;
  }, [chars]);

  // ============================================================
  // RESET / NEW TEXT
  // ============================================================

  const resetWith = useCallback(
    (text) => {
      S.base = text;
      S.keystrokes = 0;
      S.errorKeys = 0;
      S.streak = 0;
      S.bestStreak = 0;
      S.samples = [];
      S.lastSample = 0;
      S.pausedTotal = 0;
      S.appending = false;

      typedRef.current = [];
      setTyped([]);
      setPassage(text);
      setHud(initialHud);
      setTimeLeft(S.duration);
      setResult(null);
      phaseRef.current = 'idle';
      setPhase('idle');

      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [S]
  );

  const newTest = useCallback(
    (lang) => {
      resetWith(buildPassage(lang, MIN_INITIAL_CHARS));
    },
    [resetWith]
  );

  const retrySame = useCallback(() => resetWith(S.base), [resetWith, S]);

  // First load: pick a fresh text every time the page opens
  useEffect(() => {
    setStore(readStore());
    newTest('english');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    S.appending = false;
  }, [passage, S]);

  const handleLanguage = (lang) => {
    if (phase === 'running' || phase === 'paused') return;
    setLanguage(lang);
    S.language = lang;
    newTest(lang);
  };

  const handleDuration = (value) => {
    if (phase === 'running' || phase === 'paused') return;
    setDuration(value);
    S.duration = value;
    setTimeLeft(value);
  };

  // ============================================================
  // STATS
  // ============================================================

  const computeStats = useCallback(
    (elapsedSeconds) => {
      const text = charsRef.current;
      const input = typedRef.current;

      let correct = 0;
      for (let i = 0; i < input.length; i += 1) {
        if (input[i] === text[i]) correct += 1;
      }

      const minutes = Math.max(elapsedSeconds, 1) / 60;
      const net = Math.max(0, Math.round(correct / 5 / minutes));
      const gross = Math.round(input.length / 5 / minutes);
      const accuracy =
        S.keystrokes > 0
          ? Math.round(((S.keystrokes - S.errorKeys) / S.keystrokes) * 100)
          : 100;

      return { correct, net, gross, accuracy, uncorrected: input.length - correct };
    },
    [S]
  );

  // ============================================================
  // FINISH
  // ============================================================

  finishRef.current = () => {
    if (phaseRef.current === 'done') return;
    phaseRef.current = 'done';

    const elapsed = Math.min(
      S.duration,
      (performance.now() - S.startAt - S.pausedTotal) / 1000
    );
    const st = computeStats(elapsed);

    const key = `${S.language}-${S.duration}`;
    const saved = readStore();
    const previousBest = saved.best[key] || 0;
    const isBest = st.net > 0 && st.net > previousBest;

    const entry = {
      date: new Date().toISOString(),
      language: S.language,
      duration: S.duration,
      wpm: st.net,
      grossWpm: st.gross,
      accuracy: st.accuracy,
      errors: S.errorKeys,
      chars: typedRef.current.length,
    };

    const next = {
      history: [entry, ...saved.history].slice(0, MAX_HISTORY),
      best: isBest ? { ...saved.best, [key]: st.net } : saved.best,
    };
    writeJSON(STORE_KEY, next);
    setStore(next);

    setResult({
      ...entry,
      correct: st.correct,
      uncorrected: st.uncorrected,
      keystrokes: S.keystrokes,
      bestStreak: S.bestStreak,
      samples: S.samples.slice(),
      isBest,
      previousBest,
      elapsed: Math.round(elapsed),
    });
    setHud({ wpm: st.net, accuracy: st.accuracy, errors: st.uncorrected, streak: S.streak });
    setTimeLeft(0);
    setPhase('done');
    inputRef.current?.blur();
  };

  // ============================================================
  // TIMER (performance.now based – no drift, pause-safe)
  // ============================================================

  useEffect(() => {
    if (phase !== 'running') return undefined;

    const tick = () => {
      const elapsed = (performance.now() - S.startAt - S.pausedTotal) / 1000;
      const remaining = Math.max(0, S.duration - elapsed);
      const st = computeStats(elapsed);

      setTimeLeft(Math.ceil(remaining));
      setHud({ wpm: st.net, accuracy: st.accuracy, errors: st.uncorrected, streak: S.streak });

      const sec = Math.floor(elapsed);
      if (sec > S.lastSample && sec >= 1 && sec <= S.duration) {
        S.lastSample = sec;
        S.samples.push({ t: sec, wpm: st.net, raw: st.gross });
      }

      if (remaining <= 0) finishRef.current?.();
    };

    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [phase, S, computeStats]);

  // ============================================================
  // INPUT
  // ============================================================

  const handleChange = (event) => {
    const current = phaseRef.current;
    if (current === 'paused' || current === 'done' || current === 'loading') return;

    const text = charsRef.current;
    let next = Array.from(event.target.value.normalize('NFC'));
    if (next.length > text.length) next = next.slice(0, text.length);

    if (current === 'idle' && next.length > 0) {
      S.startAt = performance.now();
      S.pausedTotal = 0;
      S.lastSample = 0;
      phaseRef.current = 'running';
      setPhase('running');
    }

    const prev = typedRef.current;
    for (let i = prev.length; i < next.length; i += 1) {
      S.keystrokes += 1;
      if (next[i] === text[i]) {
        S.streak += 1;
        S.bestStreak = Math.max(S.bestStreak, S.streak);
      } else {
        S.errorKeys += 1;
        S.streak = 0;
      }
    }

    typedRef.current = next;
    setTyped(next);

    // Keep the passage endless: add more text before the user reaches the end
    if (!S.appending && text.length - next.length < APPEND_THRESHOLD) {
      S.appending = true;
      const extra = pickText(S.language);
      setPassage((p) => `${p} ${extra}`);
    }
  };

  const handleKeyDown = (event) => {
    const blocked = ['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
    if (blocked.includes(event.key)) event.preventDefault();
  };

  const keepCaretAtEnd = (event) => {
    const el = event.target;
    const len = el.value.length;
    if (el.selectionStart !== len || el.selectionEnd !== len) {
      el.setSelectionRange(len, len);
    }
  };

  const blockEvent = (event) => event.preventDefault();

  // ============================================================
  // PAUSE / RESUME
  // ============================================================

  const pause = useCallback(() => {
    if (phaseRef.current !== 'running') return;
    S.pausedAt = performance.now();
    phaseRef.current = 'paused';
    setPhase('paused');
  }, [S]);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    S.pausedTotal += performance.now() - S.pausedAt;
    phaseRef.current = 'running';
    setPhase('running');
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [S]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      const current = phaseRef.current;
      if (current === 'running') {
        event.preventDefault();
        pause();
      } else if (current === 'paused') {
        event.preventDefault();
        resume();
      } else if (current === 'idle' || current === 'done') {
        event.preventDefault();
        newTest(S.language);
      }
    };

    const onVisibility = () => {
      if (document.hidden) pause();
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pause, resume, newTest, S]);

  // ============================================================
  // SCROLL: keep the caret on the 2nd visible line (smooth, responsive)
  // ============================================================

  useEffect(() => {
    const el = areaRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => setLayoutTick((t) => t + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const caret = inner.querySelector('[data-caret="true"]');
    if (!caret) return;

    const lineH = parseFloat(window.getComputedStyle(inner).lineHeight) || 40;
    const offset = Math.max(0, caret.offsetTop - lineH);
    inner.style.transform = `translateY(${-offset}px)`;
  }, [typed, passage, layoutTick, phase]);

  // ============================================================
  // DERIVED
  // ============================================================

  const typedLen = typed.length;
  const showArea = phase === 'idle' || phase === 'running' || phase === 'paused' || phase === 'loading';
  const locked = phase === 'running' || phase === 'paused';
  const timeProgress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const bestForSelection = store.best[`${language}-${duration}`] || 0;
  const langConfig = LANGUAGES[language];

  // ============================================================
  // RENDER: TYPING AREA
  // ============================================================

  const renderArea = () => (
    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div
        className="relative rounded-2xl bg-[#071827] ring-1 ring-white/10"
        onClick={() => phase !== 'paused' && inputRef.current?.focus()}
      >
        <div
          ref={areaRef}
          className="relative overflow-hidden px-5 py-5 sm:px-8 sm:py-6"
          style={{ cursor: 'text' }}
        >
          <div style={{ height: VIEW_HEIGHT, overflow: 'hidden' }}>
            <div
              ref={innerRef}
              className="tt-scroll relative select-none"
              style={{
                fontFamily: langConfig.font,
                fontSize: 'clamp(1.05rem, 0.95rem + 0.9vw, 1.5rem)',
                lineHeight: LINE_HEIGHT,
                transition: 'transform 160ms ease-out',
                willChange: 'transform',
                wordBreak: 'keep-all',
              }}
            >
              {words.map((w) => {
                const inWord = typedLen >= w.start && typedLen < w.start + w.len;
                return (
                  <Word
                    key={w.start}
                    text={w.text}
                    typed={typed.slice(w.start, w.start + w.len).join('')}
                    caret={inWord ? typedLen - w.start : -1}
                    blink={phase !== 'running'}
                  />
                );
              })}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-[#071827] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#071827] to-transparent" />
        </div>

        {/* Invisible input captures all typing (works with mobile keyboards) */}
        <textarea
          ref={inputRef}
          value={typed.join('')}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={keepCaretAtEnd}
          onPaste={blockEvent}
          onCut={blockEvent}
          onDrop={blockEvent}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (phaseRef.current === 'running') pause();
          }}
          disabled={phase === 'loading'}
          aria-label="Typing input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="absolute inset-0 z-10 h-full w-full resize-none rounded-2xl opacity-0"
          style={{ caretColor: 'transparent', cursor: 'text' }}
        />

        {/* Focus hint */}
        {!focused && phase !== 'paused' && phase !== 'loading' && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-slate-950/55 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 ring-1 ring-white/15">
              <FaKeyboard className="text-cyan-300" />
              Click here and start typing
            </div>
          </div>
        )}

        {/* Paused */}
        {phase === 'paused' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-950/80 backdrop-blur-sm">
            <div className="text-xl font-semibold text-white">Paused</div>
            <p className="text-sm text-slate-400">Your timer is stopped.</p>
            <button
              type="button"
              onClick={resume}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FaPlay className="text-xs" /> Resume
            </button>
          </div>
        )}

        {/* Loading */}
        {phase === 'loading' && (
          <div className="absolute inset-0 z-20 animate-pulse rounded-2xl bg-white/[0.03]" />
        )}
      </div>

      <p className="mt-2 px-1 text-xs text-slate-500">
        {phase === 'idle'
          ? 'The timer starts when you type the first character.'
          : 'Esc pauses. Mistakes can be fixed with Backspace.'}
      </p>
    </div>
  );

  // ============================================================
  // RENDER: RESULTS
  // ============================================================

  const renderResults = () => {
    if (!result) return null;
    const grade = getGrade(result.wpm, result.accuracy);
    const GradeIcon = grade.icon;

    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] ring-2 ${grade.ring}`}>
            <GradeIcon className={`text-3xl ${grade.color}`} />
          </div>
          <h2 className={`mt-4 text-3xl font-semibold ${grade.color}`}>{grade.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{grade.note}</p>

          {result.isBest && (
            <div className="mt-3 rounded-full bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-300/30">
              New personal best
              {result.previousBest ? ` – previous ${result.previousBest} WPM` : ''}
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Net speed" value={result.wpm} unit="WPM" accent="text-cyan-200" />
          <Stat label="Gross speed" value={result.grossWpm} unit="WPM" accent="text-amber-300" />
          <Stat label="Accuracy" value={`${result.accuracy}%`} accent="text-emerald-300" />
          <Stat label="Time" value={formatClock(result.elapsed)} accent="text-violet-300" />
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/[0.06]">
            <div className="mb-3 text-sm font-medium text-slate-300">Speed over time</div>
            <SpeedChart samples={result.samples} duration={result.duration} />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06]">
              <span className="text-sm text-slate-400">Correct chars</span>
              <span className="font-semibold tabular-nums text-emerald-300">{result.correct}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06]">
              <span className="text-sm text-slate-400">Mistakes made</span>
              <span className="font-semibold tabular-nums text-rose-300">{result.errors}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06]">
              <span className="flex items-center gap-1.5 text-sm text-slate-400">
                <FaFire className="text-xs text-orange-400" /> Best streak
              </span>
              <span className="font-semibold tabular-nums text-orange-300">{result.bestStreak}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => newTest(language)}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaRandom className="text-xs" /> New text
          </button>
          <button
            type="button"
            onClick={retrySame}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <FaRedo className="text-xs" /> Retry same text
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: HISTORY
  // ============================================================

  const renderHistory = () => {
    if (!store.history.length || locked) return null;

    return (
      <div className="border-t border-white/[0.06] bg-slate-950/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FaChartLine className="text-cyan-300/80" />
              Recent tests
            </div>
            <button
              type="button"
              onClick={() => {
                const cleared = { history: [], best: {} };
                writeJSON(STORE_KEY, cleared);
                setStore(cleared);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-white/5 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <FaTrash className="text-[10px]" /> Clear
            </button>
          </div>

          <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {store.history.slice(0, 8).map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm ring-1 ring-white/[0.05] sm:grid-cols-[1.4fr_1fr_1fr_1fr]"
              >
                <span className="truncate text-xs text-slate-500">
                  {new Date(item.date).toLocaleDateString()} · {LANGUAGES[item.language]?.short || 'EN'} · {Math.round(item.duration / 60 * 10) / 10 >= 1 ? `${item.duration / 60}m` : `${item.duration}s`}
                </span>
                <span className="font-semibold tabular-nums text-cyan-200">{item.wpm} WPM</span>
                <span className="tabular-nums text-emerald-300">{item.accuracy}%</span>
                <span className="hidden tabular-nums text-slate-400 sm:block">{item.errors} mistakes</span>
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
      <style>{TT_STYLES}</style>

      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden bg-[#050f1b] text-slate-200 shadow-2xl ring-1 ring-black/20 sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-r from-[#061a2f] to-[#0b3157] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-cyan-200 ring-1 ring-white/10">
              <FaKeyboard />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Typing Test</div>
              <div className="text-xs text-slate-400">Speed and accuracy practice</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {locked && (
              <IconButton onClick={phase === 'running' ? pause : resume} label={phase === 'running' ? 'Pause' : 'Resume'}>
                {phase === 'running' ? <FaPause /> : <FaPlay />}
              </IconButton>
            )}
            <IconButton onClick={() => newTest(language)} label="New text" disabled={phase === 'loading'}>
              <FaRandom />
            </IconButton>
            <IconButton onClick={retrySame} label="Restart this text" disabled={phase === 'loading' || phase === 'idle'}>
              <FaRedo />
            </IconButton>
          </div>
        </div>

        {/* Settings */}
        {phase !== 'done' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FaLanguage className="text-slate-500" />
                <Segmented
                  label="Language"
                  value={language}
                  disabled={locked}
                  onChange={handleLanguage}
                  options={Object.entries(LANGUAGES).map(([value, cfg]) => ({ value, label: cfg.label }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-slate-500" />
                <Segmented
                  label="Duration"
                  value={duration}
                  disabled={locked}
                  onChange={handleDuration}
                  options={DURATIONS}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FaTrophy className="text-amber-300/80" />
              Best
              <span className="font-semibold tabular-nums text-white">
                {bestForSelection ? `${bestForSelection} WPM` : '–'}
              </span>
            </div>
          </div>
        )}

        {/* Live stats */}
        {showArea && (
          <div className="px-3 pt-3 sm:px-4 sm:pt-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Speed" value={hud.wpm} unit="WPM" accent="text-cyan-200" />
              <Stat label="Accuracy" value={`${hud.accuracy}%`} accent="text-emerald-300" />
              <Stat label="Streak" value={hud.streak} accent={hud.streak >= 10 ? 'text-amber-300' : 'text-white'} />
              <Stat
                label="Time left"
                value={formatClock(timeLeft)}
                accent={phase === 'running' && timeLeft <= 10 ? 'text-rose-300' : 'text-white'}
              />
            </div>

            <div className="my-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${phase === 'idle' || phase === 'loading' ? 100 : timeProgress}%`, transition: 'width 0.4s linear' }}
              />
            </div>
          </div>
        )}

        {showArea && renderArea()}
        {phase === 'done' && renderResults()}

        {renderHistory()}

        <div className="border-t border-white/[0.06] bg-slate-950/40 px-4 py-3 text-center text-xs text-slate-500">
          Accuracy first, speed second. Regular daily practice improves your WPM.
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
