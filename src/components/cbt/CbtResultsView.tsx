import React, { useEffect, useState } from 'react';
import { ExamAttempt, Question } from '../../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Home,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AiTutorModal } from '../ai/AiTutorModal';

interface Props {
  attempt: ExamAttempt;
  questions: Question[];
  onRetake: () => void;
  onGoHome: () => void;
}

export const CbtResultsView: React.FC<Props> = ({
  attempt,
  questions,
  onRetake,
  onGoHome,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered' | 'flagged'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedQuestionForAi, setSelectedQuestionForAi] = useState<Question | null>(null);

  useEffect(() => {
    setBookmarkedIds(StorageService.getBookmarks());
    // Trigger celebratory confetti if score is credit or distinction (>= 50%)
    if (attempt.percentage >= 50) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ffffff'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [attempt]);

  const toggleBookmark = (qId: string) => {
    const isNowBookmarked = StorageService.toggleBookmark(qId);
    if (isNowBookmarked) {
      setBookmarkedIds([...bookmarkedIds, qId]);
    } else {
      setBookmarkedIds(bookmarkedIds.filter((id) => id !== qId));
    }
  };

  const unansweredCount = questions.filter((q) => !attempt.answers[q.id]).length;
  const incorrectCount = attempt.totalQuestions - attempt.score - unansweredCount;

  const filteredQuestions = questions.filter((q) => {
    const chosen = attempt.answers[q.id];
    const isCorrect = chosen === q.correctAnswer;
    const isUnanswered = !chosen;
    const isFlagged = attempt.flaggedQuestionIds.includes(q.id);

    if (filter === 'correct') return isCorrect;
    if (filter === 'wrong') return !isCorrect && !isUnanswered;
    if (filter === 'unanswered') return isUnanswered;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  const getGradeRemark = (percent: number) => {
    if (percent >= 75) return { grade: 'Distinction (A1)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300', text: 'Outstanding Performance! You are fully prepared for this paper.' };
    if (percent >= 60) return { grade: 'Credit (B2 - C4)', color: 'text-blue-700 bg-blue-50 border-blue-300', text: 'Great Job! Solid grasp of core syllabus topics.' };
    if (percent >= 50) return { grade: 'Credit (C5 - C6)', color: 'text-cyan-700 bg-cyan-50 border-cyan-300', text: 'Good Effort! Passed, but focus on weak topics below.' };
    if (percent >= 40) return { grade: 'Pass (D7 - E8)', color: 'text-amber-700 bg-amber-50 border-amber-300', text: 'Needs Improvement. Review step-by-step solutions to build speed.' };
    return { grade: 'Fail (F9)', color: 'text-rose-700 bg-rose-50 border-rose-300', text: 'Intensive Revision Required. Study the syllabus topics systematically.' };
  };

  const remark = getGradeRemark(attempt.percentage);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          {attempt.examBody} CBT Official Practice Result
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {attempt.subjectName} Examination Result
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Completed on {new Date(attempt.completedAt).toLocaleDateString()} at {new Date(attempt.completedAt).toLocaleTimeString()}
        </p>

        {/* Big Score Dial / Badge */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shadow-inner bg-gradient-to-b from-slate-50 to-white">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {attempt.percentage}%
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-0.5">
                {attempt.score} / {attempt.totalQuestions} Marks
              </span>
            </div>
            {attempt.percentage >= 60 && (
              <div className="absolute -top-1 -right-1 p-2 rounded-full bg-amber-400 text-white shadow-lg">
                <Trophy className="w-6 h-6 fill-current" />
              </div>
            )}
          </div>

          {/* JAMB UTME Scaled score card if JAMB */}
          {attempt.examBody === 'JAMB' && (
            <div className="mt-4 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">JAMB UTME Scaled Practice Score: </span>
              <span className="text-lg font-black text-emerald-800">
                {attempt.utmeScaledScore || Math.round((attempt.percentage / 100) * 400)} / 400
              </span>
              <span className="block text-[11px] text-emerald-700/80 mt-0.5">
                *Estimated benchmark based on official 400-mark UTME ranking.
              </span>
            </div>
          )}

          {/* Grade remark badge */}
          <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-bold ${remark.color}`}>
            <span>{remark.grade}</span>
            <span className="font-normal">— {remark.text}</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">{attempt.score}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
              <XCircle className="w-4 h-4 text-rose-600" /> Incorrect
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">{incorrectCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Unanswered
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">{unansweredCount}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <Clock className="w-4 h-4 text-blue-600" /> Time Used
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {formatTime(attempt.timeSpentSeconds)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Retake Test
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition"
          >
            <Home className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Review Mode Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Detailed Questions Review & Explanations
            </h2>
            <p className="text-xs text-slate-500">
              Review every answer with verified examiner working and AI tutor assistance.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'correct' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Correct ({attempt.score})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'wrong' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'unanswered' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Unanswered ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const chosen = attempt.answers[q.id];
            const isCorrect = chosen === q.correctAnswer;
            const isUnanswered = !chosen;
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : isUnanswered
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-rose-50/30 border-rose-200'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {q.syllabusTopic}
                    </span>
                    {q.isAuthentic ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Verified Past Question
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Original Practice Question
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isBookmarked
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title="Bookmark for revision"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedQuestionForAi(q)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Ask AI Tutor
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <p className="text-sm sm:text-base font-semibold text-slate-900 mb-4 whitespace-pre-line">
                  {q.question}
                </p>

                {/* Options Grid */}
                <div className="space-y-2 mb-4">
                  {Object.entries(q.options).map(([letter, text]) => {
                    const isCandidateChoice = chosen === letter;
                    const isRightAnswer = q.correctAnswer === letter;

                    let optionStyle = 'bg-white border-slate-200 text-slate-700';
                    if (isRightAnswer) {
                      optionStyle = 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isCandidateChoice && !isRightAnswer) {
                      optionStyle = 'bg-rose-100/70 border-rose-400 text-rose-950 font-semibold';
                    }

                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                              isRightAnswer
                                ? 'bg-emerald-600 text-white'
                                : isCandidateChoice
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span>{text}</span>
                        </div>
                        {isRightAnswer && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                          </span>
                        )}
                        {isCandidateChoice && !isRightAnswer && (
                          <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm space-y-2 shadow-inner">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>Examiner Working & Explanation:</span>
                    <span className="text-[11px] text-slate-400 font-normal">Source: {q.source}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line font-mono text-xs">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tutor Modal */}
      {selectedQuestionForAi && (
        <AiTutorModal
          question={selectedQuestionForAi}
          examBody={attempt.examBody}
          subjectName={attempt.subjectName}
          syllabusTopic={selectedQuestionForAi.syllabusTopic}
          chosenAnswer={attempt.answers[selectedQuestionForAi.id]}
          onClose={() => setSelectedQuestionForAi(null)}
        />
      )}
    </div>
  );
};
