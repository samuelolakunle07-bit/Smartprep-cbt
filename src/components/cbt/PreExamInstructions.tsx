import React from 'react';
import { ExamBody, Subject } from '../../types';
import { Clock, HelpCircle, CheckCircle, AlertTriangle, ShieldCheck, Play, ArrowLeft } from 'lucide-react';

interface Props {
  examBody: ExamBody;
  subject?: Subject;
  subjectsList?: Subject[];
  year?: number;
  topic?: string;
  mode: 'subject_practice' | 'topic_practice' | 'full_cbt' | 'mock_exam';
  questionCount: number;
  durationMinutes: number;
  onStart: () => void;
  onCancel: () => void;
}

export const PreExamInstructions: React.FC<Props> = ({
  examBody,
  subject,
  subjectsList,
  year,
  topic,
  mode,
  questionCount,
  durationMinutes,
  onStart,
  onCancel,
}) => {
  const getExamInstructions = () => {
    switch (examBody) {
      case 'JAMB':
        return [
          'This is a timed Computer-Based Test (CBT) simulating the official JAMB UTME.',
          'You can switch between questions and review flagged questions using the question grid.',
          'The examination will automatically submit when the countdown reaches 00:00.',
          'An on-screen basic calculator is provided for calculations. Programmable devices are prohibited.',
          'Scores are calculated and mapped to the standard 400-mark JAMB UTME benchmark scale.',
        ];
      case 'WAEC':
        return [
          'This session tests standard WAEC SSCE objective multiple choice past and practice questions.',
          'Each question has 4 options: A, B, C, and D with exactly one correct answer.',
          'You may flag questions you are unsure about and revisit them prior to final submission.',
          'Review mode with detailed step-by-step examiner solutions will be available immediately after completion.',
        ];
      case 'NECO':
        return [
          'NECO SSCE timed CBT practice designed to test comprehensive secondary school syllabus depth.',
          'Ensure you pace yourself carefully. Average recommended time is under 1 minute per question.',
          'Your progress is preserved continuously on your device. Accidental browser refresh will not lose answers.',
        ];
    }
  };

  const getTitle = () => {
    if (mode === 'topic_practice') return `Topic Practice: ${topic || 'Syllabus Topic'}`;
    if (mode === 'subject_practice') return `${subject?.name || 'Subject'} (${year || 'Comprehensive'})`;
    if (mode === 'full_cbt' || mode === 'mock_exam') return `${examBody} Full CBT Simulation (${year || '2026 Series'})`;
    return `${examBody} Examination`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 animate-in fade-in zoom-in-95">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official {examBody} CBT Format
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getTitle()}
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Prepare Smart. Practise More. Pass with Confidence. Review the official testing instructions below before clicking Begin.
          </p>
        </div>

        {/* Exam Parameter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Exam Body</div>
            <div className="text-base font-bold text-blue-700 mt-0.5">{examBody}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions</div>
            <div className="text-base font-bold text-slate-800 mt-0.5">{questionCount} Questions</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Duration</div>
            <div className="text-base font-bold text-amber-600 flex items-center gap-1 mt-0.5">
              <Clock className="w-4 h-4" />
              {durationMinutes} Mins
            </div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Passing Grade</div>
            <div className="text-base font-bold text-emerald-600 mt-0.5">Credit (≥ 50%)</div>
          </div>
        </div>

        {/* Subjects Included in combination if applicable */}
        {subjectsList && subjectsList.length > 1 && (
          <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              JAMB 4-Subject Combination:
            </div>
            <div className="flex flex-wrap gap-2">
              {subjectsList.map((s, idx) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white text-blue-800 border border-blue-200 shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Examination Rules & Instructions
            </h2>
            <ul className="space-y-2.5">
              {getExamInstructions().map((inst, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CBT Navigation Tip */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              CBT Navigation & Keyboard Shortcuts
            </div>
            <p className="text-amber-800 text-xs leading-relaxed">
              You can tap options directly or use keyboard keys: <strong>A, B, C, D</strong> to select options, <strong>N</strong> for Next, <strong>P</strong> for Previous, and <strong>F</strong> to flag/unflag. The Question Palette lets you jump directly to any question.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              Cancel & Exit
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-lg shadow-emerald-600/25 transition active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Begin Examination Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
