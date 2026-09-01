// ============================================================
// FILE: TypingTest.jsx
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaKeyboard,
  FaClock,
  FaChartLine,
  FaRedo,
  FaLanguage,
  FaGlobe,
  FaTachometerAlt,
  FaRocket,
  FaFire,
  FaBullseye,
  FaTrophy,
  FaBolt,
  FaPlay,
  FaPause,
} from 'react-icons/fa';
import { englishTexts, bengaliTexts } from '../../components/data/typingData';

const TypingTest = () => {
  // ============================================================
  // STATES
  // ============================================================
  const [language, setLanguage] = useState('english');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selectedTime, setSelectedTime] = useState(1); // Default: 1 minute
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [testStarted, setTestStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [grossWpm, setGrossWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const LINES_PER_VIEW = 2;
  const [textLines, setTextLines] = useState([]);
  const [visibleStartLine, setVisibleStartLine] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const currentTextRef = useRef('');
  const userInputRef = useRef('');
  const comboRef = useRef(0);

  // ============================================================
  // NORMALIZE TEXT
  // ============================================================
  const normalizeText = useCallback((text) => text.replace(/\s+/g, ' ').trim(), []);

  // ============================================================
  // SPLIT TEXT INTO LINES
  // ============================================================
  const splitTextIntoLines = useCallback((text, charsPerLine = 60) => {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      if (currentLine.length === 0 || currentLine.length + word.length + 1 <= charsPerLine) {
        currentLine += currentLine.length > 0 ? ` ${word}` : word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }, []);

  // ============================================================
  // GET RANDOM TEXT
  // ============================================================
  const getRandomText = useCallback(() => {
    const array = language === 'english' ? englishTexts : bengaliTexts;
    const raw = array[Math.floor(Math.random() * array.length)];
    return normalizeText(raw);
  }, [language, normalizeText]);

  // ============================================================
  // RESET TEST
  // ============================================================
  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const newText = getRandomText();
    currentTextRef.current = newText;
    setCurrentText(newText);
    setTextLines(splitTextIntoLines(newText));
    setVisibleStartLine(0);
    setUserInput('');
    userInputRef.current = '';
    setTimeRemaining(selectedTime * 60);
    setTimeElapsed(0);
    setTestStarted(false);
    setCompleted(false);
    setShowStats(false);
    setWpm(0);
    setGrossWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);
    setCharCount(0);
    setCombo(0);
    comboRef.current = 0;
    setBestCombo(0);
    setFeedback('');
    setIsPaused(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [getRandomText, selectedTime, splitTextIntoLines]);

  // ============================================================
  // INITIALIZE
  // ============================================================
  useEffect(() => {
    resetTest();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [language, resetTest]);

  // ============================================================
  // CALCULATE STATS
  // ============================================================
  const calculateStats = useCallback((value, elapsedSecondsOverride) => {
    const text = currentTextRef.current;
    let errorCount = 0;
    let correctCount = 0;

    for (let i = 0; i < value.length; i++) {
      if (i < text.length && value[i] === text[i]) {
        correctCount++;
      } else {
        errorCount++;
      }
    }

    const elapsedSeconds = Math.max(elapsedSecondsOverride ?? timeElapsed, 1);
    const minutes = elapsedSeconds / 60;
    const gross = Math.round((value.length / 5) / minutes);
    const net = Math.max(0, Math.round((correctCount / 5) / minutes));
    const acc = value.length > 0 ? Math.round((correctCount / value.length) * 100) : 100;

    setErrors(errorCount);
    setCorrectChars(correctCount);
    setGrossWpm(gross);
    setWpm(net);
    setAccuracy(acc);

    return { errorCount, correctCount, gross, net, acc };
  }, [timeElapsed]);

  // ============================================================
  // START TEST
  // ============================================================
  const startTest = useCallback(() => {
    if (testStarted || completed) return;
    setTestStarted(true);
    setShowStats(false);

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setCompleted(true);
          setTestStarted(false);
          setShowStats(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [testStarted, completed]);

  // ============================================================
  // COMPLETE TEST
  // ============================================================
  const completeTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCompleted(true);
    setTestStarted(false);
    setShowStats(true);

    const value = userInputRef.current;
    const elapsedSeconds = Math.max(timeElapsed, 1);
    const { errorCount } = calculateStats(value, elapsedSeconds);

    setHistory(prev => [
      ...prev,
      {
        date: new Date().toISOString(),
        language,
        wpm: Math.max(0, Math.round((value.length - errorCount) / 5 / (elapsedSeconds / 60))),
        grossWpm: Math.round((value.length / 5) / (elapsedSeconds / 60)),
        accuracy: value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 0,
        errors: errorCount,
        chars: value.length,
        time: elapsedSeconds,
        duration: selectedTime
      }
    ]);
  }, [language, selectedTime, timeElapsed, calculateStats]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================
  const handleChange = (e) => {
    if (completed || isPaused) return;

    const value = e.target.value;

    if (!testStarted && value.length > 0) {
      startTest();
    }

    userInputRef.current = value;
    setUserInput(value);
    setCharCount(value.length);

    calculateStats(value);

    const text = currentTextRef.current;

    // COMBO SYSTEM
    const lastIndex = value.length - 1;
    if (lastIndex >= 0 && lastIndex < text.length) {
      if (value[lastIndex] === text[lastIndex]) {
        comboRef.current += 1;
        setCombo(comboRef.current);
        setBestCombo(prev => Math.max(prev, comboRef.current));

        if (comboRef.current === 10) {
          setFeedback('🔥 Great! 10 Combo!');
        } else if (comboRef.current === 25) {
          setFeedback('⚡ Amazing! 25 Combo!');
        } else if (comboRef.current === 50) {
          setFeedback('🏆 Incredible! 50 Combo!');
        } else if (comboRef.current > 0 && comboRef.current % 10 === 0) {
          setFeedback('🔥 Keep going!');
        }
      } else {
        comboRef.current = 0;
        setCombo(0);
        setFeedback('💪 Accuracy first!');
      }
    }

    // SHOW NEXT TWO LINES
    let currentCharIndex = value.length;
    let accumulated = 0;
    let activeLine = 0;

    for (let i = 0; i < textLines.length; i++) {
      const lineLength = textLines[i].length;
      const lineEnd = accumulated + lineLength;
      if (currentCharIndex <= lineEnd) {
        activeLine = i;
        break;
      }
      accumulated += lineLength + 1;
      activeLine = i;
    }

    const targetBlock = Math.floor(activeLine / LINES_PER_VIEW) * LINES_PER_VIEW;
    if (targetBlock !== visibleStartLine && targetBlock < textLines.length) {
      setVisibleStartLine(targetBlock);
    }

    if (value.length >= text.length) {
      completeTest();
    }
  };

  // ============================================================
  // TOGGLE PAUSE
  // ============================================================
  const togglePause = () => {
    if (!testStarted || completed) return;
    setIsPaused(!isPaused);
    if (!isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setCompleted(true);
            setTestStarted(false);
            setShowStats(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      inputRef.current?.focus();
    }
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ============================================================
  // PERFORMANCE LEVEL
  // ============================================================
  const getPerformance = () => {
    if (wpm >= 60 && accuracy >= 95) {
      return { title: 'Expert', subtitle: 'Outstanding Performance', icon: FaTrophy, color: 'text-yellow-500', bg: 'bg-yellow-50' };
    }
    if (wpm >= 45 && accuracy >= 90) {
      return { title: 'Advanced', subtitle: 'Excellent Performance', icon: FaRocket, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
    if (wpm >= 30 && accuracy >= 80) {
      return { title: 'Intermediate', subtitle: 'Good Progress', icon: FaTachometerAlt, color: 'text-green-500', bg: 'bg-green-50' };
    }
    return { title: 'Beginner', subtitle: 'Keep Practicing', icon: FaKeyboard, color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  // ============================================================
  // PROGRESS
  // ============================================================
  const progress = currentText.length > 0 ? Math.min((userInput.length / currentText.length) * 100, 100) : 0;
  const performance = getPerformance();
  const PerformanceIcon = performance.icon;

  // ============================================================
  // RENDER TYPING TEXT
  // ============================================================
  const visibleLines = textLines.slice(visibleStartLine, visibleStartLine + LINES_PER_VIEW);

  const renderTypingText = () => {
    if (!currentText) return null;

    let globalStart = 0;
    for (let i = 0; i < visibleStartLine; i++) {
      globalStart += textLines[i].length + 1;
    }

    return visibleLines.map((line, lineIndex) => {
      const lineStart = globalStart + visibleLines
        .slice(0, lineIndex)
        .reduce((acc, l) => acc + l.length + 1, 0);
      return (
        <div key={`${visibleStartLine}-${lineIndex}`} className="min-h-[42px] md:min-h-[48px]">
          {line.split('').map((char, index) => {
            const globalIndex = lineStart + index;
            let className = "transition-all duration-150";

            if (globalIndex < userInput.length) {
              if (userInput[globalIndex] === char) {
                className += " text-green-400";
              } else {
                className += " text-red-500 bg-red-500/20 rounded px-[1px]";
              }
            } else if (globalIndex === userInput.length && testStarted && !completed) {
              className += " text-blue-400 bg-blue-500/20 border-b-2 border-blue-400 animate-pulse";
            } else {
              className += " text-gray-500";
            }

            return (
              <span key={globalIndex} className={className}>
                {char}
              </span>
            );
          })}
        </div>
      );
    });
  };

  // ============================================================
  // JSX
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* HEADER */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                  <FaKeyboard className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    TypeFlow
                  </h1>
                  <p className="text-white/70 text-sm">
                    Master your typing skills
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <div className="text-xs text-white/50 font-medium">TIME</div>
                  <div className={`text-2xl font-mono font-bold text-white ${timeRemaining <= 10 ? 'animate-pulse text-red-300' : ''}`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>

                <button
                  onClick={togglePause}
                  disabled={!testStarted || completed}
                  className={`p-3 rounded-2xl backdrop-blur transition ${
                    isPaused ? 'bg-yellow-500/30 hover:bg-yellow-500/40' : 'bg-white/10 hover:bg-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? <FaPlay className="text-white" /> : <FaPause className="text-white" />}
                </button>

                <button
                  onClick={resetTest}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur transition"
                  title="New Test"
                >
                  <FaRedo className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* CONTROL BAR */}
          <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <FaLanguage className="text-indigo-500" />
                <span className="text-sm font-semibold text-gray-600">Language:</span>
                <button
                  disabled={testStarted}
                  onClick={() => setLanguage('english')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    language === 'english'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  <FaGlobe className="inline mr-1" /> English
                </button>
                <button
                  disabled={testStarted}
                  onClick={() => setLanguage('bengali')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    language === 'bengali'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  বাংলা
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <FaClock className="text-indigo-500" />
                <span className="text-sm font-semibold text-gray-600">Duration:</span>
                {[1, 2, 3, 4, 5].map(minute => (
                  <button
                    key={minute}
                    disabled={testStarted}
                    onClick={() => setSelectedTime(minute)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTime === minute
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    {minute}m
                  </button>
                ))}
              </div>

              {!testStarted && !completed && (
                <button
                  onClick={startTest}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-200"
                >
                  <FaPlay /> Start Test
                </button>
              )}
            </div>
          </div>

          {/* LIVE DASHBOARD */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50/30">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs text-gray-400 font-medium">SPEED</div>
              <div className="text-2xl font-bold text-indigo-600">
                {wpm} <span className="text-xs font-normal text-gray-400">WPM</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs text-gray-400 font-medium">ACCURACY</div>
              <div className="text-2xl font-bold text-emerald-500">{accuracy}%</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs text-gray-400 font-medium">ERRORS</div>
              <div className="text-2xl font-bold text-rose-500">{errors}</div>
            </div>
            <motion.div
              animate={combo > 0 ? { scale: [1, 1.04, 1] } : {}}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <FaFire className="text-orange-500" /> COMBO
              </div>
              <div className="text-2xl font-bold text-orange-500">{combo}</div>
            </motion.div>
          </div>

          {/* PROGRESS */}
          <div className="px-4 pt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* FEEDBACK */}
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm font-bold text-indigo-600"
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TWO-LINE TYPING DISPLAY */}
          <div className="px-4 md:px-6">
            <div className="relative bg-gray-900 rounded-3xl p-5 md:p-8 shadow-inner overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">Typing Area</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {visibleStartLine + 1}–{Math.min(visibleStartLine + 2, textLines.length)} / {textLines.length} lines
                </div>
              </div>

              <div
                className={`font-mono text-base md:text-xl leading-[2.6rem] tracking-wide ${
                  language === 'bengali' ? 'font-bengali' : ''
                }`}
                style={{ minHeight: '5.2rem', maxHeight: '5.2rem', overflow: 'hidden' }}
              >
                {renderTypingText()}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <FaBullseye className="text-indigo-400" />
                  Type the highlighted character
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {charCount} chars
                </div>
              </div>
            </div>
          </div>

          {/* INPUT */}
          <div className="p-4 md:p-6">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleChange}
              disabled={completed}
              rows={2}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={completed ? "Test completed!" : "Start typing here..."}
              className={`w-full resize-none px-5 py-4 rounded-2xl border-2 outline-none transition-all font-mono text-base md:text-lg ${
                completed
                  ? 'bg-emerald-50 border-emerald-200 text-gray-700'
                  : 'bg-white border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300'
              } ${isPaused ? 'opacity-75' : ''}`}
            />

            {!testStarted && !completed && (
              <div className="text-center mt-4">
                <button
                  onClick={startTest}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-200"
                >
                  <FaPlay /> Start Typing
                </button>
              </div>
            )}
          </div>

          {/* COMPLETION RESULT */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 md:p-6 border-t bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="inline-flex p-5 rounded-full bg-yellow-50 shadow-inner mb-3"
                  >
                    <FaTrophy className="text-4xl text-yellow-500" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Test Completed!</h2>
                  <p className="text-sm text-gray-500">Here's your performance report</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                    <FaRocket className="mx-auto text-indigo-500 text-xl mb-2" />
                    <div className="text-xs text-gray-400 font-medium">NET SPEED</div>
                    <div className="text-3xl font-bold text-indigo-600">{wpm}</div>
                    <div className="text-xs text-gray-400">WPM</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                    <FaBolt className="mx-auto text-yellow-500 text-xl mb-2" />
                    <div className="text-xs text-gray-400 font-medium">GROSS SPEED</div>
                    <div className="text-3xl font-bold text-yellow-500">{grossWpm}</div>
                    <div className="text-xs text-gray-400">WPM</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                    <FaBullseye className="mx-auto text-emerald-500 text-xl mb-2" />
                    <div className="text-xs text-gray-400 font-medium">ACCURACY</div>
                    <div className="text-3xl font-bold text-emerald-500">{accuracy}%</div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                    <FaClock className="mx-auto text-orange-500 text-xl mb-2" />
                    <div className="text-xs text-gray-400 font-medium">TIME</div>
                    <div className="text-3xl font-bold text-orange-500">{formatTime(timeElapsed)}</div>
                  </div>
                </div>

                <div className="mt-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${performance.bg}`}>
                        <PerformanceIcon className={`text-2xl ${performance.color}`} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium">PERFORMANCE LEVEL</div>
                        <div className={`text-2xl font-bold ${performance.color}`}>{performance.title}</div>
                        <div className="text-sm text-gray-500">{performance.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className="text-xs text-gray-400 font-medium">CORRECT</div>
                        <div className="text-xl font-bold text-emerald-500">{correctChars}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium">ERRORS</div>
                        <div className="text-xl font-bold text-rose-500">{errors}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium">BEST COMBO</div>
                        <div className="text-xl font-bold text-orange-500">🔥 {bestCombo}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={resetTest}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-200"
                  >
                    <FaRedo /> Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/30">
              <details className="group">
                <summary className="cursor-pointer font-bold text-gray-600 flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  <FaChartLine className="text-indigo-500" />
                  Test History ({history.length})
                  <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                  {history.slice().reverse().map((result, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-3 text-sm shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors"
                    >
                      <span className="text-gray-400 font-mono text-xs">
                        {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </span>
                      <span className="font-bold text-gray-600">
                        {result.language === 'english' ? '🇬🇧 EN' : '🇧🇩 BN'}
                      </span>
                      <span className="font-bold text-indigo-600">{result.wpm} WPM</span>
                      <span className="font-bold text-emerald-500">{result.accuracy}%</span>
                      <span className="text-rose-500 text-sm">{result.errors} errors</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* FOOTER */}
          <div className="p-4 bg-gray-50/80 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              💡 Accuracy first, speed second. Keep practicing daily and your WPM will improve naturally.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TypingTest;