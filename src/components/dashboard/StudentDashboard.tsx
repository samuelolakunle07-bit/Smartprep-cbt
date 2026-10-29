import React from 'react';
import { ExamAttempt, ExamBody, Subject, UserProfile, Question } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Trophy,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Target,
  Flame,
  CheckCircle2,
  FileText,
  Brain,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  attempts: ExamAttempt[];
  subjects: Subject[];
  allQuestions: Question[];
  onNavigateTab: (tab: 'practice' | 'topic' | 'jamb_advisor' | 'history' | 'bookmarks' | 'admin' | 'settings') => void;
  onSelectExam: (exam: ExamBody) => void;
  onStartQuickExam: (exam: ExamBody) => void;
  onOpenAndroidExport: () => void;
}

export const StudentDashboard: React.FC<Props> = ({
  user,
  attempts,
  subjects,
  allQuestions,
  onNavigateTab,
  onSelectExam,
  onStartQuickExam,
  onOpenAndroidExport,
}) => {
  const latestAttempt = attempts[0];
  const totalTestsCount = attempts.length;
  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length)
      : 0;

  // Bookmarks count
  const bookmarksCount = allQuestions.filter((q) =>
    (localStorage.getItem('smartprep_bookmarks_v2') || '').includes(q.id)
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Welcome & Student Hero Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Brain className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Prepare Smart. Practise More. Pass with Confidence.
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Targeting: <strong className="text-white">{user.preferredExam} SSCE / UTME</strong> • Target Course: <strong className="text-emerald-300">{user.intendedCourse || 'Tertiary Education'}</strong>
            </p>
          </div>

          {/* Quick Study Streak Card */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">4 Days</div>
              <div className="text-[11px] text-blue-200">Daily Study Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Android App Install Banner Card */}
      <PWAInstallButton variant="card" onOpenAndroidExport={onOpenAndroidExport} />

      {/* Continue Practising Prompt if ongoing attempt or recent test */}
      {latestAttempt && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Recent Practice Result
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                {latestAttempt.subjectName} ({latestAttempt.examBody})
              </h3>
              <p className="text-xs text-slate-500">
                Scored {latestAttempt.percentage}% ({latestAttempt.score}/{latestAttempt.totalQuestions} marks)
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            <span>View Full Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3 Main Examination Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Select Your Target Examination
          </h2>
          <span className="text-xs text-slate-500">2005 – 2026 Series</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WAEC Card */}
          <div
            onClick={() => {
              onSelectExam('WAEC');
              onNavigateTab('practice');
            }}
            className="group cursor-pointer bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              West African Examinations Council
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1 group-hover:text-blue-600 transition">
              WAEC SSCE
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              May/June & Nov/Dec official objective past questions from 2005 to 2026.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Practise WAEC</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* NECO Card */}
          <div
            onClick={() => {
              onSelectExam('NECO');
              onNavigateTab('practice');
            }}
            className="group cursor-pointer bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              National Examinations Council
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1 group-hover:text-emerald-600 transition">
              NECO SSCE
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete June/July SSCE past papers & syllabus questions with detailed working.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Practise NECO</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* JAMB UTME Card */}
          <div
            onClick={() => {
              onSelectExam('JAMB');
              onNavigateTab('practice');
            }}
            className="group cursor-pointer bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Joint Admissions and Matriculation Board
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1 group-hover:text-indigo-600 transition">
              JAMB UTME CBT
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              4-subject combinations, 120-minute timer simulation, and scoring scaled over 400.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Practise JAMB</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigateTab('practice')}
          className="p-4 bg-white rounded-2xl border border-slate-200 text-left hover:border-blue-400 transition hover:shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Practice by Subject</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">45+ Secondary subjects</p>
        </button>

        <button
          onClick={() => onNavigateTab('topic')}
          className="p-4 bg-white rounded-2xl border border-slate-200 text-left hover:border-emerald-400 transition hover:shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Practice by Topic</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Focus on weak areas</p>
        </button>

        <button
          onClick={() => onNavigateTab('jamb_advisor')}
          className="p-4 bg-white rounded-2xl border border-slate-200 text-left hover:border-indigo-400 transition hover:shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">JAMB Combination</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Course admission guide</p>
        </button>

        <button
          onClick={() => onNavigateTab('bookmarks')}
          className="p-4 bg-white rounded-2xl border border-slate-200 text-left hover:border-amber-400 transition hover:shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Bookmark className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Bookmarks</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Saved difficult questions</p>
        </button>
      </div>

      {/* Progress & Performance Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Your Exam Preparation Metrics
            </h3>
            <p className="text-xs text-slate-500">
              Live statistics tracked across all your timed CBT attempts.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Attempts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Tests Taken
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalTestsCount}</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Average Score
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{averageScore}%</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Question Bank
            </span>
            <div className="text-2xl font-black text-blue-600 mt-1">2005 – 2026</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Saved Bookmarks
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">{bookmarksCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
