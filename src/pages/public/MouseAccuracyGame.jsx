import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMousePointer,
  FaCrosshairs,
  FaClock,
  FaBullseye,
  FaChartLine,
  FaRedo,
  FaPlay,
  FaStop,
  FaTachometerAlt,
  FaMedal,
  FaRocket,
  FaFire,
  FaBolt,
  FaTimes,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

const MouseAccuracyGame = () => {
  // ============================================================
  // GAME STATES
  // ============================================================
  const [gameState, setGameState] = useState('setup');
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);

  const [targets, setTargets] = useState([]);
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [gameHistory, setGameHistory] = useState([]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // ============================================================
  // REFS
  // ============================================================
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const targetIdCounter = useRef(0);

  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  const hitsRef = useRef(hits);
  const missesRef = useRef(misses);
  const comboRef = useRef(combo);
  const maxComboRef = useRef(maxCombo);
  const reactionTimesRef = useRef(reactionTimes);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { hitsRef.current = hits; }, [hits]);
  useEffect(() => { missesRef.current = misses; }, [misses]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
  useEffect(() => { reactionTimesRef.current = reactionTimes; }, [reactionTimes]);

  // ============================================================
  // CLEANUP
  // ============================================================
  const clearGameTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  }, []);

  // ============================================================
  // FEEDBACK
  // ============================================================
  const showFeedback = useCallback((message) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback((current) => (current === message ? '' : current));
    }, 700);
  }, []);

  // ============================================================
  // TARGET SPAWN
  // ============================================================
  const spawnTarget = useCallback(() => {
    if (!gameAreaRef.current || gameStateRef.current !== 'playing') return;

    const area = gameAreaRef.current.getBoundingClientRect();
    if (area.width < 100 || area.height < 100) return;

    const currentScore = scoreRef.current;
    const difficulty = Math.min(Math.floor(currentScore / 500), 5);

    const baseSize = Math.max(40, 68 - difficulty * 5);
    const size = baseSize + Math.floor(Math.random() * 8);
    const padding = size + 12;

    const x = padding + Math.random() * Math.max(1, area.width - padding * 2);
    const y = padding + Math.random() * Math.max(1, area.height - padding * 2);

    const newTarget = {
      id: targetIdCounter.current++,
      x,
      y,
      size,
      createdAt: Date.now(),
      duration: Math.max(1600, 2400 - difficulty * 130)
    };

    setTargets((prev) => [...prev, newTarget]);

    setTimeout(() => {
      if (gameStateRef.current !== 'playing') return;

      setTargets((prev) => {
        const exists = prev.some((t) => t.id === newTarget.id);
        if (exists) {
          setMisses((m) => m + 1);
          setTotalShots((t) => t + 1);
          setCombo(0);
          showFeedback('Miss');
        }
        return prev.filter((t) => t.id !== newTarget.id);
      });
    }, newTarget.duration + 800);
  }, [showFeedback]);

  // ============================================================
  // TARGET CLICK
  // ============================================================
  const handleTargetClick = useCallback((e, targetId) => {
    e.stopPropagation();
    if (gameStateRef.current !== 'playing') return;

    let clickedTarget = null;

    setTargets((prev) => {
      clickedTarget = prev.find((t) => t.id === targetId);
      if (!clickedTarget) return prev;
      return prev.filter((t) => t.id !== targetId);
    });

    if (!clickedTarget) return;

    const reactionTime = Date.now() - clickedTarget.createdAt;
    setReactionTimes((prev) => [...prev, reactionTime]);

    const currentCombo = comboRef.current;
    const basePoints = Math.max(10, 110 - Math.floor(reactionTime / 14));
    const comboBonus = Math.floor(currentCombo / 3) * 8;
    const points = basePoints + comboBonus;

    setScore((prev) => prev + points);
    setHits((prev) => prev + 1);
    setTotalShots((prev) => prev + 1);

    const newCombo = currentCombo + 1;
    setCombo(newCombo);
    setMaxCombo((prev) => Math.max(prev, newCombo));

    if (newCombo >= 15) showFeedback('Unstoppable');
    else if (newCombo >= 10) showFeedback('Amazing Combo');
    else if (newCombo >= 5) showFeedback('Great Streak');
    else showFeedback('Hit');
  }, [showFeedback]);

  // ============================================================
  // EMPTY AREA CLICK
  // ============================================================
  const handleAreaClick = useCallback((e) => {
    if (gameStateRef.current !== 'playing') return;
    if (e.target === gameAreaRef.current) {
      setMisses((prev) => prev + 1);
      setTotalShots((prev) => prev + 1);
      setCombo(0);
      showFeedback('Miss');
    }
  }, [showFeedback]);

  // ============================================================
  // END GAME
  // ============================================================
  const endGame = useCallback(() => {
    clearGameTimers();
    setTargets([]);

    const finalHits = hitsRef.current;
    const finalMisses = missesRef.current;
    const finalScore = scoreRef.current;
    const finalCombo = maxComboRef.current;
    const finalReactions = reactionTimesRef.current;

    const total = finalHits + finalMisses;
    const finalAccuracy = total > 0 ? Math.round((finalHits / total) * 100) : 0;
    const avgReaction = finalReactions.length > 0
      ? Math.round(finalReactions.reduce((a, b) => a + b, 0) / finalReactions.length)
      : 0;

    setAccuracy(finalAccuracy);
    setTotalShots(total);
    setGameState('done');
    setIsFullscreen(false);
    setShowStats(true);

    setGameHistory((prev) => [
      {
        date: new Date().toISOString(),
        score: finalScore,
        accuracy: finalAccuracy,
        hits: finalHits,
        misses: finalMisses,
        maxCombo: finalCombo,
        avgReaction,
        duration: selectedTime
      },
      ...prev
    ]);

    setFeedback('Time Up');
  }, [clearGameTimers, selectedTime]);

  // ============================================================
  // START GAME
  // ============================================================
  const startGame = useCallback(() => {
    clearGameTimers();

    setScore(0);
    setTotalShots(0);
    setAccuracy(0);
    setTimeRemaining(selectedTime);
    setTargets([]);
    setMisses(0);
    setHits(0);
    setCombo(0);
    setMaxCombo(0);
    setReactionTimes([]);
    setFeedback('');
    setShowStats(false);
    setIsFullscreen(true);
    targetIdCounter.current = 0;
    setGameState('playing');

    setTimeout(() => {
      if (gameStateRef.current === 'playing') spawnTarget();
    }, 280);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnTimerRef.current = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;

      const currentScore = scoreRef.current;
      const count = Math.min(1 + Math.floor(currentScore / 750), 3);

      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnTarget(), i * 160);
      }
    }, 820);
  }, [clearGameTimers, selectedTime, spawnTarget, endGame]);

  // ============================================================
  // RESET
  // ============================================================
  const resetGame = useCallback(() => {
    clearGameTimers();
    setGameState('setup');
    setTargets([]);
    setShowStats(false);
    setIsFullscreen(false);
    setFeedback('');
    setTimeRemaining(selectedTime);
  }, [clearGameTimers, selectedTime]);

  const toggleStats = () => setShowStats((prev) => !prev);

  // ============================================================
  // PERFORMANCE LEVEL
  // ============================================================
  const getPerformance = () => {
    if (accuracy >= 95 && score >= 1500) {
      return {
        title: 'Sniper Elite',
        subtitle: 'Outstanding precision and control',
        icon: FaMedal,
        color: 'text-amber-500',
        bg: 'bg-amber-50'
      };
    }
    if (accuracy >= 85 && score >= 900) {
      return {
        title: 'Sharpshooter',
        subtitle: 'Excellent mouse control',
        icon: FaRocket,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      };
    }
    if (accuracy >= 70) {
      return {
        title: 'Marksman',
        subtitle: 'Solid accuracy. Keep training',
        icon: FaBullseye,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      };
    }
    return {
      title: 'Recruit',
      subtitle: 'Focus on consistency and speed',
      icon: FaMousePointer,
      color: 'text-slate-500',
      bg: 'bg-slate-50'
    };
  };

  const performance = getPerformance();
  const PerformanceIcon = performance.icon;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => clearGameTimers();
  }, [clearGameTimers]);

  // ============================================================
  // TARGET RENDER
  // ============================================================
  const renderTarget = (target) => (
    <motion.div
      key={target.id}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: [0.2, 1.05, 0.98, 1], opacity: 1 }}
      exit={{ scale: 0.15, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="absolute cursor-crosshair select-none"
      style={{
        left: target.x - target.size / 2,
        top: target.y - target.size / 2,
        width: target.size,
        height: target.size,
        zIndex: 10
      }}
      onClick={(e) => handleTargetClick(e, target.id)}
    >
      <motion.div
        animate={{
          scale: [1, 1.08, 0.94, 1.04, 0.75],
          opacity: [1, 1, 0.96, 0.88, 0.2]
        }}
        transition={{
          duration: target.duration / 1000,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        className="relative w-full h-full"
      >
        <div className="absolute -inset-2 rounded-full bg-rose-500/25 blur-md" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 via-rose-500 to-rose-700 shadow-xl border-[3px] border-rose-200/60" />
        <div className="absolute inset-[14%] rounded-full border-2 border-white/50" />
        <div className="absolute inset-[28%] rounded-full border border-white/40" />
        <div className="absolute inset-[42%] rounded-full bg-white shadow-sm" />
        <div className="absolute top-[18%] left-[20%] w-[24%] h-[12%] rounded-full bg-white/50 blur-[0.5px] -rotate-12" />
      </motion.div>
    </motion.div>
  );

  // ============================================================
  // SETUP SCREEN
  // ============================================================
  const renderSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[580px]"
    >
      <div className="text-center max-w-lg">
        <div className="inline-flex p-5 rounded-2xl bg-slate-900 mb-6 shadow-lg">
          <FaMousePointer className="text-4xl text-white" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Mouse Accuracy Trainer
        </h2>

        <p className="text-slate-500 leading-relaxed mb-8 text-[15px]">
          Train precision, reaction speed and hand-eye coordination.
          Click the targets before they disappear.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <FaBullseye className="text-slate-500" /> Precision
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <FaBolt className="text-slate-500" /> Speed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <FaFire className="text-slate-500" /> Combo
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100">
                <FaClock className="text-slate-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-800">Session Duration</div>
                <div className="text-xs text-slate-400">Select challenge length</div>
              </div>
            </div>

            <div className="flex gap-2">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${selectedTime === time
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                  `}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startGame}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-base shadow-lg hover:bg-slate-800 transition-colors"
        >
          <FaPlay className="text-sm" />
          Start Training
        </motion.button>
      </div>
    </motion.div>
  );

  // ============================================================
  // HUD
  // ============================================================
  const renderHUD = () => (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">SCORE</div>
        <div className="text-lg font-bold text-slate-900">{score}</div>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">TIME</div>
        <div className={`text-lg font-bold font-mono ${timeRemaining <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">ACCURACY</div>
        <div className="text-lg font-bold text-emerald-600">
          {totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0}%
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">COMBO</div>
        <motion.div key={combo} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-lg font-bold text-orange-500">
          {combo}
        </motion.div>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 text-center">
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide">HITS</div>
        <div className="text-lg font-bold text-emerald-600">{hits}</div>
      </div>

      <button
        onClick={toggleStats}
        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-2 flex flex-col items-center justify-center transition-colors"
      >
        {showStats ? <FaCompress /> : <FaExpand />}
        <span className="text-[9px] font-semibold mt-1">{showStats ? 'GAME' : 'STATS'}</span>
      </button>
    </div>
  );

  // ============================================================
  // GAME AREA
  // ============================================================
  const renderGame = () => (
    <div className="flex flex-col min-h-[680px]">
      {renderHUD()}

      <div className="h-11 flex items-center justify-center bg-slate-50 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm font-semibold text-slate-700"
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        ref={gameAreaRef}
        onClick={handleAreaClick}
        className="relative flex-1 min-h-[520px] md:min-h-[600px] bg-slate-950 m-3 rounded-2xl overflow-hidden cursor-crosshair"
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FaCrosshairs className="text-white/5 text-[160px] md:text-[220px]" />
        </div>

        <AnimatePresence>
          {targets.map(renderTarget)}
        </AnimatePresence>

        {targets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white/40">
              <FaCrosshairs className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Targets incoming…</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 text-white/40 text-xs pointer-events-none">
          Click targets before they fade
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RESULTS
  // ============================================================
  const renderResults = () => {
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-10 bg-white"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-amber-50 mb-4">
            <FaMedal className="text-4xl text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Session Complete</h2>
          <p className="text-slate-500 mt-1.5 text-sm">Performance summary</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: FaBullseye, label: 'SCORE', value: score, color: 'text-slate-900' },
            { icon: FaBullseye, label: 'ACCURACY', value: `${accuracy}%`, color: 'text-emerald-600' },
            { icon: FaFire, label: 'MAX COMBO', value: maxCombo, color: 'text-orange-500' },
            { icon: FaTachometerAlt, label: 'AVG REACTION', value: `${avgReaction}ms`, color: 'text-violet-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <stat.icon className={`mx-auto text-xl mb-1.5 ${stat.color}`} />
              <div className="text-[10px] text-slate-400 font-semibold tracking-wide">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${performance.bg}`}>
                <PerformanceIcon className={`text-2xl ${performance.color}`} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-wide">PERFORMANCE</div>
                <div className={`text-xl font-bold ${performance.color}`}>{performance.title}</div>
                <div className="text-sm text-slate-500">{performance.subtitle}</div>
              </div>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">HITS</div>
                <div className="text-xl font-bold text-emerald-600">{hits}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold">MISSES</div>
                <div className="text-xl font-bold text-rose-500">{misses}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Accuracy</span>
            <span className="text-sm font-bold text-emerald-600">{accuracy}%</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-colors"
          >
            <FaRedo className="text-sm" />
            Train Again
          </button>
        </div>
      </motion.div>
    );
  };

  // ============================================================
  // HISTORY
  // ============================================================
  const renderHistory = () => {
    if (gameHistory.length === 0) return null;

    return (
      <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50/80">
        <details className="group">
          <summary className="cursor-pointer font-semibold text-slate-600 flex items-center gap-2 hover:text-slate-900 text-sm">
            <FaChartLine className="text-slate-500" />
            Training History ({gameHistory.length})
            <span className="ml-auto text-xs text-slate-400">▼</span>
          </summary>

          <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
            {gameHistory.map((result, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center bg-white rounded-xl p-2.5 border border-slate-100 text-sm"
              >
                <span className="text-xs text-slate-400">
                  {new Date(result.date).toLocaleDateString()}
                </span>
                <span className="font-semibold text-slate-800">{result.score} pts</span>
                <span className="font-semibold text-emerald-600">{result.accuracy}%</span>
                <span className="text-orange-500 font-medium">{result.maxCombo} combo</span>
                <span className="text-slate-500">{result.avgReaction}ms</span>
                <span className="text-slate-400">{result.duration}s</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isFullscreen
        ? 'fixed inset-0 z-[9999] bg-slate-950 p-0 overflow-auto'
        : 'bg-slate-100 p-3 md:p-6'}
    `}>
      <div className={`mx-auto ${isFullscreen ? 'w-full min-h-screen' : 'max-w-5xl'}`}>
        <div className={`
          bg-white overflow-hidden shadow-xl
          ${isFullscreen ? 'min-h-screen rounded-none' : 'rounded-2xl border border-slate-200'}
        `}>
          {!isFullscreen && (
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FaMousePointer className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">Aim Trainer</h1>
                  <p className="text-white/50 text-xs">Mouse accuracy & reaction training</p>
                </div>
              </div>

              {gameState === 'playing' && (
                <button
                  onClick={resetGame}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  title="Quit"
                >
                  <FaStop className="text-white text-sm" />
                </button>
              )}
            </div>
          )}

          {isFullscreen && gameState === 'playing' && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-white/10">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <FaMousePointer className="text-slate-400" />
                AIM TRAINER
              </div>
              <button
                onClick={resetGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium"
              >
                <FaTimes /> Exit
              </button>
            </div>
          )}

          <div>
            {gameState === 'setup' && renderSetup()}
            {gameState === 'playing' && renderGame()}
            {gameState === 'done' && renderResults()}
          </div>

          {!isFullscreen && renderHistory()}

          {!isFullscreen && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Click targets · Build combos · Improve reaction time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MouseAccuracyGame;