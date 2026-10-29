import React, { useState } from 'react';
import { ExamAttempt, Question, Subject } from '../../types';
import { StorageService } from '../../services/storageService';
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Bookmark,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { CbtResultsView } from '../cbt/CbtResultsView';

interface Props {
  attempts: ExamAttempt[];
  questions: Question[];
  subjects: Subject[];
  onStartRetake: (attempt: ExamAttempt) => void;
  onGoToPractice: () => void;
}

export const PerformanceHistoryView: React.FC<Props> = ({
  attempts,
  questions,
  subjects,
  onStartRetake,
  onGoToPractice,
}) => {
  const [selectedAttemptForReview, setSelectedAttemptForReview] = useState<ExamAttempt | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'bookmarks' | 'weak_topics'>('history');

  const bookmarkedIds = StorageService.getBookmarks();
  const bookmarkedQuestions = questions.filter((q) => bookmarkedIds.includes(q.id));

  // Calculate weak topics from attempts
  const topicStats: Record<string, { total: number; correct: number; subject: string }> = {};
  attempts.forEach((att) => {
    Object.entries(att.answers).forEach(([qId, ans]) => {
      const q = questions.find((item) => item.id === qId);
      if (q && q.syllabusTopic) {
        if (!topicStats[q.syllabusTopic]) {
          topicStats[q.syllabusTopic] = { total: 0, correct: 0, subject: q.subjectId };
        }
        topicStats[q.syllabusTopic].total++;
        if (ans === q.correctAnswer) {
          topicStats[q.syllabusTopic].correct++;
        }
      }
    });
  });

  const weakTopics = Object.entries(topicStats)
    .map(([topic, data]) => ({
      topic,
      subject: data.subject,
      total: data.total,
      accuracy: Math.round((data.correct / data.total) * 100),
    }))
    .filter((item) => item.total >= 2 && item.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy);

  // If currently reviewing a historical attempt
  if (selectedAttemptForReview) {
    const attemptQuestions = questions.filter((q) =>
      Object.keys(selectedAttemptForReview.answers).includes(q.id)
    );
    return (
      <CbtResultsView
        attempt={selectedAttemptForReview}
        questions={attemptQuestions.length > 0 ? attemptQuestions : questions.slice(0, 10)}
        onRetake={() => onStartRetake(selectedAttemptForReview)}
        onGoHome={() => setSelectedAttemptForReview(null)}
      />
    );
  }

  const averagePercentage =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length)
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Student Performance & Progress Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Examination Results & Mastery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your score trajectories, review past attempts, and focus on recommended weak topics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase">Average Score</span>
            <div className="text-2xl font-black text-blue-900">{averagePercentage}%</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Total Tests</span>
            <div className="text-2xl font-black text-emerald-900">{attempts.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs text-xs font-bold gap-1">
        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeSubTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Test Attempts ({attempts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('weak_topics')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeSubTab === 'weak_topics' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Weak Topics to Revise ({weakTopics.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeSubTab === 'bookmarks' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saved Bookmarks ({bookmarkedQuestions.length})
        </button>
      </div>

      {/* SUB-TAB 1: TEST ATTEMPTS */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          {attempts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No examination attempts yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select any subject or full examination from the past questions bank to complete your first CBT session!
              </p>
              <button
                onClick={onGoToPractice}
                className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Start Practising Now
              </button>
            </div>
          ) : (
            attempts.map((att) => (
              <div
                key={att.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm shrink-0 shadow-inner ${
                      att.percentage >= 60
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : att.percentage >= 45
                        ? 'bg-blue-50 text-blue-800 border border-blue-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}
                  >
                    <span>{att.percentage}%</span>
                    <span className="text-[10px] font-normal">Score</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                        {att.examBody}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {att.subjectName}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>{att.score} of {att.totalQuestions} Correct</span>
                      <span>•</span>
                      <span>Time: {Math.round(att.timeSpentSeconds / 60)} mins</span>
                      <span>•</span>
                      <span>{new Date(att.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedAttemptForReview(att)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition"
                  >
                    Review Answers
                  </button>
                  <button
                    onClick={() => onStartRetake(att)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                    title="Retake this test"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB 2: WEAK TOPICS */}
      {activeSubTab === 'weak_topics' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Personalized Syllabus Revision Recommendations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Topics where your accuracy is below 60% across completed practice sessions.
            </p>
          </div>

          {weakTopics.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-medium">No severe weak topics detected yet! Keep practicing consistently.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider capitalize">
                      {item.subject}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{item.topic}</h4>
                    <p className="text-xs text-slate-500">
                      Accuracy: <strong className="text-rose-700">{item.accuracy}%</strong> ({item.total} attempts)
                    </p>
                  </div>
                  <button
                    onClick={onGoToPractice}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Revise Topic
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: BOOKMARKS */}
      {activeSubTab === 'bookmarks' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Saved Bookmarked Questions ({bookmarkedQuestions.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Difficult past exam problems you saved during examination review sessions.
            </p>
          </div>

          {bookmarkedQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs">No questions bookmarked yet. Tap the bookmark icon during test reviews to save key questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedQuestions.map((q) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{q.examBody} {q.year} • {q.syllabusTopic}</span>
                    <span className="text-emerald-700 font-bold">Answer: Option {q.correctAnswer}</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{q.question}</p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                    <strong>Working: </strong>{q.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
