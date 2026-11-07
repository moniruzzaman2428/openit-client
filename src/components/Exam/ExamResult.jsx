// ============================================================
// FILE: src/components/exam/ExamResult.jsx
// Result screen: score, pass/fail, time, full answer review,
// retake, "practise my mistakes" and print.
// ============================================================
import { useMemo, useState } from 'react';
import {
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaHome,
  FaPrint,
  FaRedo,
  FaTimes,
  FaTimesCircle,
  FaBookOpen,
  FaMinusCircle,
} from 'react-icons/fa';

import { PASS_PERCENT, bn } from './examEngine';

const OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];

const STATUS = {
  correct: {
    label: 'সঠিক',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    icon: FaCheckCircle,
    bar: 'bg-emerald-500',
  },
  wrong: {
    label: 'ভুল',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200',
    icon: FaTimesCircle,
    bar: 'bg-rose-500',
  },
  skipped: {
    label: 'উত্তর দেননি',
    chip: 'bg-slate-100 text-slate-600 ring-slate-200',
    icon: FaMinusCircle,
    bar: 'bg-slate-300',
  },
};

const formatDuration = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${bn(s)} সেকেন্ড`;
  return `${bn(m)} মিনিট ${bn(s)} সেকেন্ড`;
};

const PRINT_STYLES = `
.print-only { display: none; }
@media print {
  @page { margin: 12mm; }
  body { background: #fff !important; }
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  .print-card { box-shadow: none !important; break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

// ------------------------------------------------------------
// Score ring
// ------------------------------------------------------------

const ScoreRing = ({ percent, passed }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const color = passed ? '#10b981' : '#f43f5e';

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900">{bn(percent)}%</span>
        <span className="text-xs text-slate-500">স্কোর</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Result
// ------------------------------------------------------------

const ExamResult = ({ attempt, summary, title, onRetake, onPracticeWeak, onHome }) => {
  const [filter, setFilter] = useState('all');

  const weakCount = summary?.wrong + summary?.skipped;

  const filters = useMemo(
    () => [
      { value: 'all', label: 'সব', count: summary?.total },
      { value: 'correct', label: 'সঠিক', count: summary?.correct },
      { value: 'wrong', label: 'ভুল', count: summary?.wrong },
      { value: 'skipped', label: 'উত্তর দেননি', count: summary?.skipped },
      { value: 'flagged', label: 'মার্ক করা', count: summary?.rows.filter((r) => r.flagged).length },
    ],
    [summary]
  );

  const rows = useMemo(() => {
    if (filter === 'all') return summary?.rows;
    if (filter === 'flagged') return summary?.rows.filter((row) => row?.flagged);
    return summary?.rows.filter((row) => row?.status === filter);
  }, [summary?.rows, filter]);

  const finishedDate = new Date(attempt?.finishedAt || Date.now()).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stat = (label, value, tone) => (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
      <p className={`text-2xl font-bold tabular-nums ${tone}`}>{bn(value)}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{PRINT_STYLES}</style>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Print header */}
        <div className="print-only mb-6 border-b-2 border-slate-800 pb-4 text-center">
          <p className="text-2xl font-extrabold">ওপেন আইটি ইনস্টিটিউট</p>
          <p className="text-sm">অনলাইন এক্সাম – ফলাফল</p>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        <section className="print-card overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className={`h-1.5 ${summary?.passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <ScoreRing percent={summary?.percent} passed={summary?.passed} />

              <div className="min-w-0 flex-1">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${
                    summary?.passed
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-rose-50 text-rose-700 ring-rose-200'
                  }`}
                >
                  {summary?.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                  {summary?.passed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                </span>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {attempt?.name ? `${attempt?.name}, ` : ''}
                  {summary?.passed ? 'অভিনন্দন!' : 'আরও একটু চেষ্টা করুন'}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {title} · {attempt?.mode === 'exam' ? 'পরীক্ষা মোড' : 'অনুশীলন মোড'} · {finishedDate}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {bn(summary?.total)}টি প্রশ্নের মধ্যে আপনি <strong>{bn(summary?.correct)}টি</strong> সঠিক
                  উত্তর দিয়েছেন। উত্তীর্ণ হতে প্রয়োজন {bn(PASS_PERCENT)}%।
                </p>

                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                  <FaClock className="text-xs" />
                  সময় লেগেছে: {formatDuration(summary?.elapsedSec)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {stat('সঠিক', summary?.correct, 'text-emerald-600')}
              {stat('ভুল', summary?.wrong, 'text-rose-600')}
              {stat('উত্তর দেননি', summary?.skipped, 'text-slate-500')}
            </div>

            {/* Actions */}
            <div className="no-print mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={onRetake}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3b64] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
              >
                <FaRedo className="text-xs" />
                আবার পরীক্ষা দিন
              </button>

              {weakCount > 0 && (
                <button
                  type="button"
                  onClick={onPracticeWeak}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FaBookOpen className="text-xs" />
                  ভুলগুলো অনুশীলন ({bn(weakCount)})
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaPrint className="text-xs" />
                প্রিন্ট
              </button>

              <button
                type="button"
                onClick={onHome}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
              >
                <FaHome className="text-xs" />
                সব পরীক্ষা
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- REVIEW ---------------- */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">উত্তর পর্যালোচনা</h2>

            <div className="no-print flex flex-wrap gap-2" role="group" aria-label="ফিল্টার">
              {filters.map((item) => {
                const active = filter === item?.value;
                return (
                  <button
                    key={item?.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(item?.value)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
                      active
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item?.label}
                    <span className={`text-xs tabular-nums ${active ? 'text-white/80' : 'text-slate-400'}`}>
                      {bn(item?.count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {rows?.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
                এই ফিল্টারে কোনো প্রশ্ন নেই।
              </div>
            )}

            {rows?.map((row) => {
              const status = STATUS[row?.status];
              const StatusIcon = status.icon;

              return (
                <article
                  key={row?.question.id}
                  className="print-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className={`h-1 ${status.bar}`} />

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-500">
                        প্রশ্ন {bn(row?.index + 1)}
                      </span>
                      <div className="flex items-center gap-2">
                        {row?.flagged && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                            <FaFlag className="text-[10px]" /> মার্ক
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.chip}`}
                        >
                          <StatusIcon className="text-[11px]" />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-3 whitespace-pre-line break-words text-base font-semibold leading-7 text-slate-900">
                      {row.question.text}
                    </h3>

                    <ul className="mt-4 space-y-2">
                      {row.question.options.map((option, index) => {
                        const isCorrect = option.id === row.correctId;
                        const isChosen = option.id === row.chosenId;

                        let cls = 'border-slate-200 bg-white text-slate-600';
                        if (isCorrect) cls = 'border-emerald-300 bg-emerald-50 text-emerald-900';
                        else if (isChosen) cls = 'border-rose-300 bg-rose-50 text-rose-900';

                        return (
                          <li
                            key={option?.id}
                            className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm leading-6 ${cls}`}
                          >
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : isChosen
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isCorrect ? (
                                <FaCheck className="text-[10px]" />
                              ) : isChosen ? (
                                <FaTimes className="text-[10px]" />
                              ) : (
                                OPTION_LABELS[index]
                              )}
                            </span>
                            <span className="min-w-0 flex-1 whitespace-pre-line break-words">
                              {option?.text}
                              {isChosen && !isCorrect && (
                                <span className="ml-2 text-xs font-semibold text-rose-600">(আপনার উত্তর)</span>
                              )}
                              {isCorrect && (
                                <span className="ml-2 text-xs font-semibold text-emerald-700">(সঠিক উত্তর)</span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamResult;
