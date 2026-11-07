// ============================================================
// FILE: src/components/Exam/Exam.jsx
// Main exam page: set selection, start/resume, runner, result.
// Uses examEngine + ExamRunner + ExamResult.
// ============================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaLayerGroup,
  FaPlay,
  FaTrash,
  FaUser,
} from 'react-icons/fa';

import {
  SETS,
  MIXED_SET,
  COUNT_OPTIONS,
  PASS_PERCENT,
  MIXED_MAX,
  bn,
  setTitle,
  loadAllSets,
  buildMixedPool,
  resolveCount,
  buildAttempt,
  remainingSeconds,
  scoreAttempt,
  loadActive,
  saveActive,
  clearActive,
  saveLast,
  loadName,
  saveName,
  loadHistory,
  addHistory,
  clearHistory,
} from './examEngine';

import ExamRunner from './ExamRunner';
import ExamResult from './ExamResult';

// ------------------------------------------------------------
// Home / Setup screen
// ------------------------------------------------------------

const ExamHome = ({
  loaded,
  mixedPool,
  name,
  setName,
  history,
  active,
  onStart,
  onResume,
  onClearHistory,
  loading,
  error,
}) => {
  const [selected, setSelected] = useState(SETS[0]?.id || '1');
  const [count, setCount] = useState(20);
  const [mode, setMode] = useState('exam'); // 'exam' | 'practice'

  const selectedSet = selected === 'mixed' ? MIXED_SET : SETS.find((s) => s.id === selected);

  const available = useMemo(() => {
    if (selected === 'mixed') return mixedPool.length;
    const entry = loaded.find((l) => l.set.id === selected);
    return entry?.valid?.length ?? 0;
  }, [selected, loaded, mixedPool]);

  const resolvedCount = resolveCount(selected, available, count);

  const canStart = available > 0 && resolvedCount > 0 && !loading;

  const handleStart = () => {
    if (!canStart) return;
    const questions =
      selected === 'mixed'
        ? mixedPool
        : loaded.find((l) => l.set.id === selected)?.valid || [];
    onStart({
      set: selectedSet,
      questions,
      count: resolvedCount,
      mode,
      name: name.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#0F4C81]">
            ওপেন আইটি ইনস্টিটিউট
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            কম্পিউটার অফিস অ্যাপ্লিকেশন
          </h1>
          <p className="mt-2 text-slate-500">অনলাইন পরীক্ষা ও অনুশীলন</p>
        </header>

        {/* Resume banner */}
        {active && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-amber-900">অসম্পূর্ণ পরীক্ষা আছে</p>
              <p className="text-sm text-amber-800">
                {setTitle(SETS.find((s) => s.id === active.setId) || MIXED_SET)} · প্রশ্ন{' '}
                {bn(active.current + 1)}/{bn(active.questions.length)}
              </p>
            </div>
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <FaPlay className="text-xs" />
              চালিয়ে যান
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Name */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FaUser className="text-slate-400" />
            আপনার নাম (ঐচ্ছিক)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => saveName(name.trim())}
            placeholder="নাম লিখুন..."
            maxLength={40}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20"
          />
        </section>

        {/* Set selection */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FaLayerGroup className="text-[#0F4C81]" />
            পরীক্ষা সেট নির্বাচন
          </h2>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">প্রশ্ন লোড হচ্ছে...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {SETS.map((set) => {
                const entry = loaded.find((l) => l.set.id === set.id);
                const countQ = entry?.valid?.length ?? 0;
                const failed = entry?.failed;
                const isActive = selected === set.id;
                return (
                  <button
                    key={set.id}
                    type="button"
                    disabled={countQ === 0 && !failed}
                    onClick={() => setSelected(set.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
                      isActive
                        ? 'border-[#0F4C81] bg-[#0F4C81]/5 ring-2 ring-[#0F4C81]/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    } ${countQ === 0 ? 'opacity-50' : ''}`}
                  >
                    <span className="block text-sm font-bold text-slate-900">
                      পরীক্ষা {bn(set.number)}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {failed ? 'লোড ব্যর্থ' : `${bn(countQ)}টি প্রশ্ন`}
                    </span>
                  </button>
                );
              })}

              {/* Mixed */}
              <button
                type="button"
                disabled={mixedPool.length === 0}
                onClick={() => setSelected('mixed')}
                className={`rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] col-span-2 sm:col-span-1 ${
                  selected === 'mixed'
                    ? 'border-[#0F4C81] bg-[#0F4C81]/5 ring-2 ring-[#0F4C81]/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                } ${mixedPool.length === 0 ? 'opacity-50' : ''}`}
              >
                <span className="block text-sm font-bold text-slate-900">মিক্সড কুইজ</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {bn(mixedPool.length)}টি · সর্বোচ্চ {bn(MIXED_MAX)}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Count & Mode */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">প্রশ্নের সংখ্যা</h2>
            <div className="flex flex-wrap gap-2">
              {COUNT_OPTIONS.map((opt) => {
                const label = opt === 'all' ? 'সব' : bn(opt);
                const isActive = count === opt;
                return (
                  <button
                    key={String(opt)}
                    type="button"
                    onClick={() => setCount(opt)}
                    className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              এখন চলবে: <strong className="text-slate-700">{bn(resolvedCount)}টি</strong> প্রশ্ন
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">মোড</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('exam')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'exam'
                    ? 'bg-[#0F4C81] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FaClock className="mb-1 inline text-xs" /> পরীক্ষা
                <span className="mt-1 block text-xs font-normal opacity-80">
                  সময়সীমা সহ
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'practice'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FaBookOpen className="mb-1 inline text-xs" /> অনুশীলন
                <span className="mt-1 block text-xs font-normal opacity-80">
                  তাৎক্ষণিক ফলাফল
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Start */}
        <button
          type="button"
          disabled={!canStart}
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F4C81] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#0b3b64] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
        >
          <FaPlay className="text-sm" />
          {mode === 'exam' ? 'পরীক্ষা শুরু করুন' : 'অনুশীলন শুরু করুন'}
        </button>

        {/* History */}
        {history.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FaHistory className="text-slate-400" />
                সাম্প্রতিক ফলাফল
              </h2>
              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-rose-600"
              >
                <FaTrash className="text-[10px]" />
                মুছুন
              </button>
            </div>
            <ul className="space-y-2">
              {history.slice(0, 8).map((item) => {
                const setLabel =
                  item.setId === 'mixed'
                    ? 'মিক্সড'
                    : `পরীক্ষা ${bn(Number(item.setId) || item.setId)}`;
                const date = new Date(item.date).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'short',
                });
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {item.name ? `${item.name} · ` : ''}
                        {setLabel}
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          {item.mode === 'exam' ? 'পরীক্ষা' : 'অনুশীলন'}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">{date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.passed
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.passed ? <FaCheckCircle className="text-[10px]" /> : null}
                        {bn(item.percent)}%
                      </span>
                      <span className="text-xs tabular-nums text-slate-400">
                        {bn(item.correct)}/{bn(item.total)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <p className="mt-10 text-center text-xs text-slate-400">
          পাস মার্ক {bn(PASS_PERCENT)}% · প্রতি প্রশ্নে ~৪৫ সেকেন্ড (পরীক্ষা মোড)
        </p>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Main Exam controller
// ------------------------------------------------------------

const Exam = () => {
  const [view, setView] = useState('home'); // 'home' | 'runner' | 'result'
  const [loaded, setLoaded] = useState([]);
  const [mixedPool, setMixedPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [history, setHistory] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [summary, setSummary] = useState(null);
  const [remaining, setRemaining] = useState(null);

  // Load data + resume
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await loadAllSets();
        if (cancelled) return;
        setLoaded(results);
        setMixedPool(buildMixedPool(results));

        const savedName = loadName();
        if (savedName) setName(savedName);

        setHistory(loadHistory());

        const active = loadActive();
        if (active) {
          setAttempt(active);
          setView('runner');
        }
      } catch (err) {
        if (!cancelled) {
          setError('প্রশ্ন লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const finishAttempt = useCallback((att) => {
    if (!att || att.finishedAt) return;
    const finished = {
      ...att,
      finishedAt: Date.now(),
    };
    const scored = scoreAttempt(finished);
    saveLast(finished);
    clearActive();
    const nextHistory = addHistory(finished, scored);
    setHistory(nextHistory);
    setAttempt(finished);
    setSummary(scored);
    setView('result');
  }, []);

  // Timer tick (auto-submit when time runs out)
  useEffect(() => {
    if (view !== 'runner' || !attempt?.endsAt || attempt.finishedAt) {
      setRemaining(null);
      return undefined;
    }

    const tick = () => {
      const left = remainingSeconds(attempt);
      setRemaining(left);
      if (left !== null && left <= 0) {
        finishAttempt(attempt);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [view, attempt, finishAttempt]);

  // Persist attempt while running (skip finished ones)
  useEffect(() => {
    if (view === 'runner' && attempt && !attempt.finishedAt) {
      saveActive(attempt);
    }
  }, [view, attempt]);

  const handleStart = useCallback(({ set, questions, count, mode, name: nm }) => {
    const att = buildAttempt({ set, questions, count, mode, name: nm });
    setAttempt(att);
    setSummary(null);
    saveName(nm);
    setName(nm);
    setView('runner');
  }, []);

  const handleResume = useCallback(() => {
    const active = loadActive();
    if (active) {
      setAttempt(active);
      setView('runner');
    }
  }, []);

  const handleAnswer = useCallback((questionId, optionId) => {
    setAttempt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: optionId },
      };
    });
  }, []);

  const handleToggleFlag = useCallback((questionId) => {
    setAttempt((prev) => {
      if (!prev) return prev;
      const nextFlags = { ...prev.flags };
      if (nextFlags[questionId]) delete nextFlags[questionId];
      else nextFlags[questionId] = true;
      return { ...prev, flags: nextFlags };
    });
  }, []);

  const handleJump = useCallback((index) => {
    setAttempt((prev) => (prev ? { ...prev, current: index } : prev));
  }, []);

  const handleSubmit = useCallback(() => {
    if (attempt) finishAttempt(attempt);
  }, [attempt, finishAttempt]);

  const handleExit = useCallback(() => {
    clearActive();
    setAttempt(null);
    setSummary(null);
    setView('home');
  }, []);

  const handleRetake = useCallback(() => {
    if (!attempt) return;
    const set =
      attempt.setId === 'mixed'
        ? MIXED_SET
        : SETS.find((s) => s.id === attempt.setId) || MIXED_SET;
    const questions =
      attempt.setId === 'mixed'
        ? mixedPool
        : loaded.find((l) => l.set.id === attempt.setId)?.valid || attempt.questions;
    const att = buildAttempt({
      set,
      questions,
      count: attempt.questions.length,
      mode: attempt.mode,
      name: attempt.name || name,
    });
    setAttempt(att);
    setSummary(null);
    setView('runner');
  }, [attempt, mixedPool, loaded, name]);

  const handlePracticeWeak = useCallback(() => {
    if (!summary || !attempt) return;
    const weak = summary.rows
      .filter((r) => r.status === 'wrong' || r.status === 'skipped')
      .map((r) => r.question);
    if (weak.length === 0) return;

    const att = buildAttempt({
      set: { id: 'mixed', number: 0, file: null },
      questions: weak,
      count: weak.length,
      mode: 'practice',
      name: attempt.name || name,
    });
    setAttempt(att);
    setSummary(null);
    setView('runner');
  }, [summary, attempt, name]);

  const handleHome = useCallback(() => {
    setAttempt(null);
    setSummary(null);
    setView('home');
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  // Title for runner / result
  const title = useMemo(() => {
    if (!attempt) return '';
    if (attempt.setId === 'mixed') return 'মিক্সড কুইজ';
    const set = SETS.find((s) => s.id === attempt.setId);
    return set ? setTitle(set) : 'পরীক্ষা';
  }, [attempt]);

  // ---------- Render ----------

  if (view === 'runner' && attempt) {
    return (
      <ExamRunner
        attempt={attempt}
        title={title}
        remaining={remaining}
        onAnswer={handleAnswer}
        onToggleFlag={handleToggleFlag}
        onJump={handleJump}
        onSubmit={handleSubmit}
        onExit={handleExit}
      />
    );
  }

  if (view === 'result' && attempt && summary) {
    return (
      <ExamResult
        attempt={attempt}
        summary={summary}
        title={title}
        onRetake={handleRetake}
        onPracticeWeak={handlePracticeWeak}
        onHome={handleHome}
      />
    );
  }

  return (
    <ExamHome
      loaded={loaded}
      mixedPool={mixedPool}
      name={name}
      setName={setName}
      history={history}
      active={loadActive()}
      onStart={handleStart}
      onResume={handleResume}
      onClearHistory={handleClearHistory}
      loading={loading}
      error={error}
    />
  );
};

export default Exam;
