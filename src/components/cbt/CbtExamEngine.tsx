import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Question, ExamBody, ExamAttempt } from '../../types';
import { StorageService } from '../../services/storageService';
import { CbtCalculator } from './CbtCalculator';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator as CalcIcon,
  Grid,
  Send,
  X,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  questions: Question[];
  examBody: ExamBody;
  subjectName: string;
  subjectId: string;
  year?: number;
  topic?: string;
  mode: 'subject_practice' | 'topic_practice' | 'full_cbt' | 'mock_exam';
  durationMinutes: number;
  userId: string;
  onFinish: (attempt: ExamAttempt) => void;
  onCancel: () => void;
}

export const CbtExamEngine: React.FC<Props> = ({
  questions,
  examBody,
  subjectName,
  subjectId,
  year,
  topic,
  mode,
  durationMinutes,
  userId,
  onFinish,
  onCancel,
}) => {
  const [, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [startTime] = useState<string>(new Date().toISOString());

  // Restore existing session if interrupted
  useEffect(() => {
    const saved = StorageService.getActiveExam();
    if (saved && saved.examBody === examBody && saved.subjectId === subjectId) {
      if (saved.answers) setAnswers(saved.answers);
      if (saved.flagged) setFlagged(saved.flagged);
      if (saved.currentIndex !== undefined) setCurrentIndex(saved.currentIndex);
      if (saved.timeLeft) setTimeLeft(saved.timeLeft);
    }
  }, [examBody, subjectId]);

  // Persist ongoing state
  useEffect(() => {
    StorageService.saveActiveExam({
      examBody,
      subjectId,
      answers,
      flagged,
      currentIndex,
      timeLeft,
    });
  }, [examBody, subjectId, answers, flagged, currentIndex, timeLeft]);

  // Submit Handler
  const handleSubmitExam = useCallback(() => {
    const totalQuestions = questions.length;
    let score = 0;
    const subjectStats: Record<string, { total: number; score: number; percentage: number }> = {};

    questions.forEach((q) => {
      const chosen = answers[q.id];
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) score++;

      if (!subjectStats[q.subjectId]) {
        subjectStats[q.subjectId] = { total: 0, score: 0, percentage: 0 };
      }
      subjectStats[q.subjectId].total++;
      if (isCorrect) subjectStats[q.subjectId].score++;
    });

    Object.keys(subjectStats).forEach((subKey) => {
      const item = subjectStats[subKey];
      item.percentage = Math.round((item.score / item.total) * 100);
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const timeSpentSeconds = durationMinutes * 60 - timeLeft;

    // JAMB UTME practice scaled score out of 400
    const utmeScaledScore = Math.round((percentage / 100) * 400);

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      userId,
      examBody,
      subjectId,
      subjectName,
      year,
      topic,
      mode,
      totalQuestions,
      answeredCount: Object.keys(answers).length,
      score,
      percentage,
      utmeScaledScore,
      timeAllowedSeconds: durationMinutes * 60,
      timeSpentSeconds: Math.max(timeSpentSeconds, 1),
      startedAt: startTime,
      completedAt: new Date().toISOString(),
      answers,
      flaggedQuestionIds: flagged,
      subjectBreakdown: subjectStats,
    };

    StorageService.saveAttempt(attempt);
    onFinish(attempt);
  }, [answers, durationMinutes, examBody, flagged, mode, onFinish, questions, startTime, subjectId, subjectName, timeLeft, userId, year, topic]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmitExam]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal or calculator is active
      if (showSubmitModal) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key);
      } else if (key === 'N' || e.key === 'ArrowRight') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (key === 'P' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (key === 'F') {
        toggleFlagCurrent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, showSubmitModal]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionLetter: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionLetter,
    }));
  };

  const toggleFlagCurrent = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      if (prev.includes(currentQuestion.id)) {
        return prev.filter((id) => id !== currentQuestion.id);
      } else {
        return [...prev, currentQuestion.id];
      }
    });
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flagged.length;
  const isTimeCritical = timeLeft < 300; // less than 5 mins

  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto p-8 text-center text-slate-700">
        <p>No questions loaded for this selection.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-16 sm:pb-8">
      {/* CBT Fixed Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left Info */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs tracking-wider">
              {examBody}
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {subjectName}
              </h2>
              <div className="text-[11px] text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>
          </div>

          {/* Center Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold transition shadow-inner ${
              isTimeCritical
                ? 'bg-rose-950/80 text-rose-300 border border-rose-600 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowCalculator((prev) => !prev)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Toggle CBT Calculator"
            >
              <CalcIcon className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => setShowPalette((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Grid className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Palette</span>
            </button>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Examination Question Area */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
          {/* Question Sub-header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200">
                Q{currentIndex + 1}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {currentQuestion.syllabusTopic}
              </span>
            </div>

            <button
              onClick={toggleFlagCurrent}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                flagged.includes(currentQuestion.id)
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flag
                className={`w-3.5 h-3.5 ${
                  flagged.includes(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
              <span>{flagged.includes(currentQuestion.id) ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed select-none">
            {currentQuestion.question}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {Object.entries(currentQuestion.options).map(([letter, text]) => {
              const isSelected = answers[currentQuestion.id] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelectOption(letter)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all select-none active:scale-[0.99] ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-2 ring-blue-500 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base">{text}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous (P)</span>
          </button>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            {answeredCount} Answered • {unansweredCount} Left
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <span>Next (N)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <span>Submit Paper</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* On-Screen Calculator Component */}
      {showCalculator && <CbtCalculator onClose={() => setShowCalculator(false)} />}

      {/* Question Palette Modal / Drawer */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-600" />
                Question Palette
              </h3>
              <button
                onClick={() => setShowPalette(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-medium py-3 text-slate-600 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-400" />
                <span>Flagged ({flaggedCount})</span>
              </div>
            </div>

            {/* Questions Number Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto py-4 flex-1">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = flagged.includes(q.id);
                const isCurrent = idx === currentIndex;

                let colorStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isFlagged) {
                  colorStyle = 'bg-amber-400 text-amber-950 font-bold';
                } else if (isAnswered) {
                  colorStyle = 'bg-emerald-600 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      startTransition(() => {
                        setCurrentIndex(idx);
                        setShowPalette(false);
                      });
                    }}
                    className={`h-10 rounded-xl flex items-center justify-center text-xs font-bold transition ${colorStyle} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPalette(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Submit Examination Paper?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Are you sure you want to finalize and grade your {examBody} CBT attempt?
            </p>

            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Questions Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600">Unanswered Questions:</span>
                <span className="font-bold text-rose-600">{unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Flagged for Review:</span>
                <span className="font-bold text-amber-700">{flaggedCount}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-700 font-medium mb-4 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                You still have {unansweredCount} unanswered questions!
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitExam();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
