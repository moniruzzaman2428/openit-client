// ============================================================
// FILE: src/components/exam/ExamRunner.jsx
// The question screen: timer, navigator, flagging, keyboard
// shortcuts, practice-mode feedback and submit confirmation.
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaCheck,
  FaClock,
  FaFlag,
  FaPaperPlane,
  FaRegFlag,
  FaTimes,
} from 'react-icons/fa';

import { bn, countProgress, formatClock } from './examEngine';

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];

// ------------------------------------------------------------
// Small modal (Esc closes, page scroll locked)
// ------------------------------------------------------------

const Modal = ({ title, children, onClose, actions }) => {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey, true);
    ref.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey, true);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl outline-none"
      >
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Question navigator
// ------------------------------------------------------------

const Navigator = ({ attempt, onJump }) => {
  const practice = attempt.mode === 'practice';

  const cellClass = (question, index) => {
    const chosen = attempt.answers[question.id];
    const isCurrent = index === attempt.current;

    if (isCurrent) return 'border-[#0F4C81] bg-[#0F4C81] text-white';

    if (practice && chosen) {
      const isRight = question.options.find((o) => o.id === chosen)?.correct;
      return isRight
        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
        : 'border-rose-300 bg-rose-50 text-rose-700';
    }

    if (chosen) return 'border-blue-200 bg-blue-50 text-[#0F4C81]';
    return 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
  };

  return (
    <div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {attempt.questions.map((question, index) => (
          <button
            key={question.id}
            type="button"
            onClick={() => onJump(index)}
            aria-label={`প্রশ্ন ${bn(index + 1)}`}
            aria-current={index === attempt.current ? 'true' : undefined}
            className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${cellClass(
              question,
              index
            )}`}
          >
            {bn(index + 1)}
            {attempt.flags[question.id] && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
            )}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-500">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-blue-200 bg-blue-50" /> উত্তর দেওয়া
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-slate-200 bg-white" /> বাকি
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-[#0F4C81]" /> বর্তমান
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400" /> মার্ক করা
        </li>
      </ul>
    </div>
  );
};

// ------------------------------------------------------------
// Runner
// ------------------------------------------------------------

const ExamRunner = ({
  attempt,
  title,
  remaining,
  onAnswer,
  onToggleFlag,
  onJump,
  onSubmit,
  onExit,
}) => {
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const total = attempt.questions.length;
  const question = attempt.questions[attempt.current];
  const chosen = attempt.answers[question.id] || null;
  const practice = attempt.mode === 'practice';
  const revealed = practice && Boolean(chosen);
  const isLast = attempt.current === total - 1;
  const progress = countProgress(attempt);
  const flagged = Boolean(attempt.flags[question.id]);

  const modalOpen = confirmSubmit || confirmExit;

  const choose = useCallback(
    (optionId) => {
      if (revealed) return; // practice mode: the answer is locked once shown
      onAnswer(question.id, optionId);
    },
    [revealed, onAnswer, question.id]
  );

  const go = useCallback(
    (index) => {
      if (index < 0 || index >= total) return;
      onJump(index);
      setDrawerOpen(false);
    },
    [onJump, total]
  );

  // Keyboard: ← → navigate, 1-4 choose, F flag
  useEffect(() => {
    if (modalOpen) return undefined;

    const onKey = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();

      if (key === 'arrowright' || key === 'n') go(attempt.current + 1);
      else if (key === 'arrowleft' || key === 'p') go(attempt.current - 1);
      else if (key === 'f') onToggleFlag(question.id);
      else if (/^[1-6]$/.test(key)) {
        const option = question.options[Number(key) - 1];
        if (option) choose(option.id);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, attempt.current, go, onToggleFlag, choose, question]);

  // Timer styling
  const lowTime = remaining !== null && remaining <= 300;
  const critical = remaining !== null && remaining <= 60;

  const warning =
    remaining === 300 ? 'আর ৫ মিনিট বাকি' : remaining === 60 ? 'আর ১ মিনিট বাকি' : '';

  const optionClass = (option) => {
    const isChosen = chosen === option.id;

    if (revealed) {
      if (option.correct) return 'border-emerald-400 bg-emerald-50 text-emerald-900';
      if (isChosen) return 'border-rose-400 bg-rose-50 text-rose-900';
      return 'border-slate-200 bg-white text-slate-500 opacity-70';
    }

    return isChosen
      ? 'border-[#0F4C81] bg-[#0F4C81]/5 text-slate-900 ring-2 ring-[#0F4C81]/20'
      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
  };

  const badgeClass = (option) => {
    const isChosen = chosen === option.id;
    if (revealed && option.correct) return 'bg-emerald-500 text-white';
    if (revealed && isChosen) return 'bg-rose-500 text-white';
    return isChosen ? 'bg-[#0F4C81] text-white' : 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 md:pt-[7.5rem]">
      <div className="sr-only" aria-live="polite">
        {warning}
      </div>

      {/* ---------------- TOP BAR ---------------- */}
      {/* Offset below main site navbar: mobile h-16, desktop h-16 + h-14 = 7.5rem */}
      <header className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur md:top-[7.5rem]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">
              প্রশ্ন {bn(attempt.current + 1)} / {bn(total)}
              <span className="mx-1.5 text-slate-300">·</span>
              উত্তর দেওয়া {bn(progress.answered)}
            </p>
          </div>

          {remaining !== null ? (
            <div
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-base font-bold tabular-nums ring-1 ${
                critical
                  ? 'animate-pulse bg-rose-50 text-rose-600 ring-rose-200'
                  : lowTime
                  ? 'bg-amber-50 text-amber-700 ring-amber-200'
                  : 'bg-slate-100 text-slate-800 ring-slate-200'
              }`}
              role="timer"
              aria-label="অবশিষ্ট সময়"
            >
              <FaClock className="text-xs" />
              {formatClock(remaining)}
            </div>
          ) : (
            <span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              অনুশীলন মোড
            </span>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] lg:hidden"
            aria-label="প্রশ্নের তালিকা"
          >
            <FaBars />
          </button>

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="hidden items-center gap-2 rounded-xl bg-[#0F4C81] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 sm:inline-flex"
          >
            <FaPaperPlane className="text-xs" />
            জমা দিন
          </button>
        </div>

        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-[#0F4C81] transition-[width] duration-300"
            style={{ width: `${total ? (progress.answered / total) * 100 : 0}%` }}
          />
        </div>
      </header>

      {/* ---------------- BODY ---------------- */}
      <main className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Question */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-[#0F4C81]/10 px-3 py-1 text-xs font-semibold text-[#0F4C81]">
              প্রশ্ন {bn(attempt.current + 1)}
            </span>

            <button
              type="button"
              onClick={() => onToggleFlag(question.id)}
              aria-pressed={flagged}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                flagged
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {flagged ? <FaFlag /> : <FaRegFlag />}
              {flagged ? 'মার্ক করা আছে' : 'পরে দেখব'}
            </button>
          </div>

          <h2 className="mt-4 whitespace-pre-line break-words text-lg font-semibold leading-8 text-slate-900 sm:text-xl sm:leading-9">
            {question.text}
          </h2>

          <div role="radiogroup" aria-label="উত্তরের বিকল্প" className="mt-6 space-y-3">
            {question.options.map((option, index) => {
              const isChosen = chosen === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isChosen}
                  disabled={revealed}
                  onClick={() => choose(option.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1 disabled:cursor-default ${optionClass(
                    option
                  )}`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${badgeClass(
                      option
                    )}`}
                  >
                    {revealed && option.correct ? (
                      <FaCheck className="text-xs" />
                    ) : revealed && isChosen ? (
                      <FaTimes className="text-xs" />
                    ) : (
                      OPTION_LABELS[index]
                    )}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-pre-line break-words text-[15px] leading-7">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <p
              role="status"
              className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
                question.options.find((o) => o.id === chosen)?.correct
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
            >
              {question.options.find((o) => o.id === chosen)?.correct
                ? 'সঠিক উত্তর!'
                : 'ভুল উত্তর। সঠিক উত্তরটি সবুজ রঙে দেখানো হয়েছে।'}
            </p>
          )}

          {/* Prev / Next */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => go(attempt.current - 1)}
              disabled={attempt.current === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowLeft className="text-xs" />
              আগের
            </button>

            <p className="hidden text-xs text-slate-400 md:block">
              কীবোর্ড: ← → চলাচল · ১–৪ উত্তর · F মার্ক
            </p>

            {isLast ? (
              <button
                type="button"
                onClick={() => setConfirmSubmit(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
              >
                <FaPaperPlane className="text-xs" />
                জমা দিন
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go(attempt.current + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
              >
                পরের
                <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>
        </section>

        {/* Navigator (desktop) */}
        <aside className="hidden space-y-4 lg:sticky lg:top-[12.5rem] lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">প্রশ্নের তালিকা</h3>
            <Navigator attempt={attempt} onJump={go} />
          </div>

          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C81] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3b64]"
          >
            <FaPaperPlane className="text-xs" />
            পরীক্ষা জমা দিন
          </button>

          <button
            type="button"
            onClick={() => setConfirmExit(true)}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-rose-600"
          >
            পরীক্ষা বাতিল করুন
          </button>
        </aside>
      </main>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="প্রশ্নের তালিকা"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">প্রশ্নের তালিকা</h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="বন্ধ করুন"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <FaTimes />
              </button>
            </div>

            <Navigator attempt={attempt} onJump={go} />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setConfirmExit(true);
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setConfirmSubmit(true);
                }}
                className="rounded-xl bg-[#0F4C81] px-4 py-3 text-sm font-semibold text-white"
              >
                জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUBMIT CONFIRM ---------------- */}
      {confirmSubmit && (
        <Modal
          title="পরীক্ষা জমা দেবেন?"
          onClose={() => setConfirmSubmit(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b3b64]"
              >
                হ্যাঁ, জমা দিন
              </button>
            </>
          }
        >
          <ul className="space-y-1">
            <li>
              উত্তর দিয়েছেন: <strong className="text-slate-900">{bn(progress.answered)}টি</strong>
            </li>
            <li>
              বাকি আছে:{' '}
              <strong className={progress.unanswered ? 'text-rose-600' : 'text-slate-900'}>
                {bn(progress.unanswered)}টি
              </strong>
            </li>
            {progress.flagged > 0 && (
              <li>
                মার্ক করা: <strong className="text-amber-600">{bn(progress.flagged)}টি</strong>
              </li>
            )}
          </ul>
          <p className="mt-3 text-slate-500">জমা দেওয়ার পর উত্তর আর বদলানো যাবে না।</p>
        </Modal>
      )}

      {/* ---------------- EXIT CONFIRM ---------------- */}
      {confirmExit && (
        <Modal
          title="পরীক্ষা বাতিল করবেন?"
          onClose={() => setConfirmExit(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                পরীক্ষা চালিয়ে যান
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                বাতিল করুন
              </button>
            </>
          }
        >
          আপনার এ পর্যন্ত দেওয়া উত্তরগুলো মুছে যাবে এবং কোনো ফলাফল সংরক্ষণ হবে না।
        </Modal>
      )}
    </div>
  );
};

export default ExamRunner;