// ============================================================
// FILE: src/components/exam/examEngine.js
// Pure exam logic (no React): data cleaning, shuffling, grading,
// timer maths and localStorage helpers.
//
// The question files are expected at  public/exam/pariksha_01.json ...
// Each file is an array of:
//   { id, question, options: [{ id, text, correct }] }
// ============================================================

// ------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------

export const SET_COUNT = 10;
export const EXAM_BASE_URL = '/result'; // folder inside /public

export const PASS_PERCENT = 50;
export const SECONDS_PER_QUESTION = 45;
export const MIXED_MAX = 50;
export const MAX_HISTORY = 20;

export const COUNT_OPTIONS = [10, 20, 30, 'all'];

export const SETS = Array.from({ length: SET_COUNT }, (_, index) => {
  const number = index + 1;
  return {
    id: String(number),
    number,
    file: `pariksha_${String(number).padStart(2, '0')}.json`,
  };
});

export const MIXED_SET = { id: 'mixed', number: 0, file: null };

// ------------------------------------------------------------
// TEXT HELPERS
// ------------------------------------------------------------

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

/** 12 -> "১২" */
export const bn = (value) =>
  String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);

export const cleanText = (text) =>
  String(text ?? '')
    .replace(/^\s*\*+\s*/, '') // "*** where do you ..." -> "where do you ..."
    .replace(/\s+/g, ' ')
    .trim();

const questionKey = (text) => cleanText(text).toLowerCase();

export const formatClock = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const setTitle = (set) => (set.id === 'mixed' ? 'মিক্সড কুইজ' : `পরীক্ষা ${bn(set.number)}`);

// ------------------------------------------------------------
// DATA CLEANING
//
// Only real multiple-choice questions are kept:
//   * at least 2 options
//   * exactly 1 correct option
//   * no empty text, no duplicate question
// Written questions (a single option that is the model answer) and
// questions with a wrong answer key are skipped, so a student can
// never be marked wrong by a data error.
// ------------------------------------------------------------

export const normalizeQuestions = (raw, setId = 'x') => {
  const skipped = { notMcq: 0, badKey: 0, empty: 0, duplicate: 0 };
  const seen = new Set();
  const valid = [];

  (Array.isArray(raw) ? raw : []).forEach((item, index) => {
    const text = cleanText(item?.question);
    const options = (Array.isArray(item?.options) ? item.options : []).map((option, i) => ({
      id: String(option?.id ?? `${index}-${i}`),
      text: cleanText(option?.text),
      correct: option?.correct === true,
    }));

    if (!text || options.some((option) => !option.text)) {
      skipped.empty += 1;
      return;
    }
    if (options.length < 2) {
      skipped.notMcq += 1;
      return;
    }
    if (options.filter((option) => option.correct).length !== 1) {
      skipped.badKey += 1;
      return;
    }

    const key = questionKey(text);
    if (seen.has(key)) {
      skipped.duplicate += 1;
      return;
    }
    seen.add(key);

    valid.push({
      id: `${setId}-${item?.id ?? index}`,
      text,
      options,
      setId,
    });
  });

  return { valid, skipped };
};

// ------------------------------------------------------------
// LOADING (cached)
// ------------------------------------------------------------

const cache = new Map();

export const loadSet = (set) => {
  if (!cache.has(set.id)) {
    const promise = fetch(`${EXAM_BASE_URL}/${set.file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${set.file}`);
        return response.json();
      })
      .then((raw) => ({ set, ...normalizeQuestions(raw, set.id) }))
      .catch((error) => {
        cache.delete(set.id); // allow retry
        throw error;
      });
    cache.set(set.id, promise);
  }
  return cache.get(set.id);
};

/**
 * Loads every set. A set that fails to load is returned with an
 * empty question list instead of breaking the whole page.
 */
export const loadAllSets = async () => {
  const results = await Promise.all(
    SETS.map((set) =>
      loadSet(set).catch(() => ({ set, valid: [], skipped: {}, failed: true }))
    )
  );
  return results;
};

/** All unique questions across sets (for the mixed quiz). */
export const buildMixedPool = (loaded) => {
  const seen = new Set();
  const pool = [];

  loaded.forEach(({ valid }) => {
    valid.forEach((question) => {
      const key = questionKey(question.text);
      if (!seen.has(key)) {
        seen.add(key);
        pool.push(question);
      }
    });
  });

  return pool;
};

// ------------------------------------------------------------
// SHUFFLE
// ------------------------------------------------------------

export const shuffle = (items, random = Math.random) => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Options such as "উপরের সবগুলো" / "None of these" must keep their position
const POSITIONAL = /(উপরের|সবগুলো|সবকয়টি|সবকটি|কোনটিই নয়|কোনোটিই নয়|none of|all of the|both|above)/i;

const keepsOrder = (options) => options.some((option) => POSITIONAL.test(option.text));

// ------------------------------------------------------------
// ATTEMPT
// ------------------------------------------------------------

export const resolveCount = (setId, available, countSetting) => {
  const cap = setId === 'mixed' ? Math.min(available, MIXED_MAX) : available;
  if (countSetting === 'all') return cap;
  return Math.min(Number(countSetting) || cap, cap);
};

export const examDurationSeconds = (questionCount) =>
  Math.max(5 * 60, Math.ceil(questionCount * SECONDS_PER_QUESTION));

export const buildAttempt = ({ set, questions, count, mode, name }) => {
  const picked = shuffle(questions).slice(0, count);

  const prepared = picked.map((question) => ({
    ...question,
    options: keepsOrder(question.options) ? question.options : shuffle(question.options),
  }));

  const startedAt = Date.now();
  const durationSec = mode === 'exam' ? examDurationSeconds(prepared.length) : null;

  return {
    id: `${startedAt}-${Math.random().toString(36).slice(2, 7)}`,
    setId: set.id,
    mode,
    name: name || '',
    questions: prepared,
    answers: {}, // { [questionId]: optionId }
    flags: {}, // { [questionId]: true }
    current: 0,
    startedAt,
    durationSec,
    endsAt: durationSec ? startedAt + durationSec * 1000 : null,
    finishedAt: null,
  };
};

export const remainingSeconds = (attempt, now = Date.now()) => {
  if (!attempt?.endsAt) return null;
  return Math.max(0, Math.ceil((attempt.endsAt - now) / 1000));
};

// ------------------------------------------------------------
// GRADING
// ------------------------------------------------------------

export const scoreAttempt = (attempt) => {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  const rows = attempt.questions.map((question, index) => {
    const chosenId = attempt.answers[question.id] ?? null;
    const correctOption = question.options.find((option) => option.correct);

    let status = 'skipped';
    if (chosenId) status = chosenId === correctOption?.id ? 'correct' : 'wrong';

    if (status === 'correct') correct += 1;
    else if (status === 'wrong') wrong += 1;
    else skipped += 1;

    return {
      index,
      question,
      chosenId,
      correctId: correctOption?.id ?? null,
      status,
      flagged: Boolean(attempt.flags[question.id]),
    };
  });

  const total = attempt.questions.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const finishedAt = attempt.finishedAt || Date.now();
  const elapsedSec = Math.max(0, Math.round((finishedAt - attempt.startedAt) / 1000));

  return {
    total,
    correct,
    wrong,
    skipped,
    percent,
    passed: percent >= PASS_PERCENT,
    elapsedSec,
    rows,
  };
};

export const countProgress = (attempt) => {
  const total = attempt.questions.length;
  const answered = attempt.questions.filter((q) => attempt.answers[q.id]).length;
  const flagged = attempt.questions.filter((q) => attempt.flags[q.id]).length;
  return { total, answered, unanswered: total - answered, flagged };
};

// ------------------------------------------------------------
// STORAGE (everything is optional – failures are ignored)
// ------------------------------------------------------------

const KEYS = {
  active: 'oit-exam:active',
  last: 'oit-exam:last',
  history: 'oit-exam:history',
  name: 'oit-exam:name',
};

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
};

const remove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

export const loadActive = () => {
  const attempt = read(KEYS.active, null);
  return attempt && Array.isArray(attempt.questions) && attempt.questions.length ? attempt : null;
};
export const saveActive = (attempt) => write(KEYS.active, attempt);
export const clearActive = () => remove(KEYS.active);

export const loadLast = () => read(KEYS.last, null);
export const saveLast = (attempt) => write(KEYS.last, attempt);

export const loadName = () => read(KEYS.name, '');
export const saveName = (name) => write(KEYS.name, name);

export const loadHistory = () => {
  const items = read(KEYS.history, []);
  return Array.isArray(items) ? items : [];
};

export const addHistory = (attempt, summary) => {
  const entry = {
    id: attempt.id,
    date: new Date(attempt.finishedAt || Date.now()).toISOString(),
    setId: attempt.setId,
    mode: attempt.mode,
    name: attempt.name,
    total: summary.total,
    correct: summary.correct,
    percent: summary.percent,
    passed: summary.passed,
    elapsedSec: summary.elapsedSec,
  };

  const next = [entry, ...loadHistory().filter((item) => item.id !== entry.id)].slice(0, MAX_HISTORY);
  write(KEYS.history, next);
  return next;
};

export const clearHistory = () => remove(KEYS.history);
