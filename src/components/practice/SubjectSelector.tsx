import React, { useState } from 'react';
import { ExamBody, Subject, Question } from '../../types';
import { Search, Calendar, BookOpen, ShieldCheck, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  subjects: Subject[];
  allQuestions: Question[];
  currentExam: ExamBody;
  onSelectExam: (exam: ExamBody) => void;
  onStartExam: (params: {
    subject: Subject;
    year: number;
    mode: 'subject_practice' | 'full_cbt';
    questionCount: number;
    durationMinutes: number;
  }) => void;
  onStartTopicPractice: (subject: Subject) => void;
}

// All examination years from 2005 to 2026 inclusive as requested
export const ALL_YEARS = Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i);

export const SubjectSelector: React.FC<Props> = ({
  subjects,
  allQuestions,
  currentExam,
  onSelectExam,
  onStartExam,
  onStartTopicPractice,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    subjects.find((s) => s.id === 'mathematics') || subjects[0]
  );
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter subjects supported by current exam body
  const availableSubjects = subjects.filter((s) => {
    const matchesBody = s.bodies.includes(currentExam) && s.isAvailable;
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBody && matchesCategory && matchesSearch;
  });

  // Calculate questions availability for current subject & years
  const getYearInfo = (year: number) => {
    const qList = allQuestions.filter(
      (q) => q.examBody === currentExam && q.subjectId === selectedSubject.id && q.year === year
    );
    const authenticCount = qList.filter((q) => q.isAuthentic).length;
    const practiceCount = qList.filter((q) => !q.isAuthentic).length;
    const total = qList.length;

    return { total, authenticCount, practiceCount };
  };

  const handleLaunchTest = () => {
    // Determine standard exam parameters
    const defaultDuration = currentExam === 'JAMB' ? 45 : 50;
    const defaultCount = currentExam === 'JAMB' ? 40 : 50;

    onStartExam({
      subject: selectedSubject,
      year: selectedYear,
      mode: 'subject_practice',
      questionCount: defaultCount,
      durationMinutes: defaultDuration,
    });
  };

  const yearStats = getYearInfo(selectedYear);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Exam Category Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Select Examination Body
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Past Question Bank (2005 – 2026)
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          {(['WAEC', 'NECO', 'JAMB'] as ExamBody[]).map((exam) => (
            <button
              key={exam}
              onClick={() => onSelectExam(exam)}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all text-center ${
                currentExam === exam
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {exam} {exam === 'JAMB' ? 'UTME' : 'SSCE'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Subject Picker + Year / Topic Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subjects Catalogue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-base text-slate-900">
              {currentExam} Subject Catalogue ({availableSubjects.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full sm:w-44"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Sciences', 'Commercial', 'Arts', 'Languages', 'Technical'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Subjects' : cat}
              </button>
            ))}
          </div>

          {/* Subject Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {availableSubjects.map((sub) => {
              const isSelected = selectedSubject.id === sub.id;
              const subQuestionsCount = allQuestions.filter(
                (q) => q.examBody === currentExam && q.subjectId === sub.id
              ).length;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/50 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                        {sub.code}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {sub.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{sub.syllabusTopics.length} Topics</span>
                      <span>•</span>
                      <span>{subQuestionsCount} Questions</span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Year Selector (2005 - 2026) & Practice Mode (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Target Subject
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedSubject.category}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {selectedSubject.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an examination year between 2005 and 2026 to begin CBT.
              </p>
            </div>

            {/* Year Selector Grid (2005 - 2026) */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Select Year (2005 – 2026):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {ALL_YEARS.map((yr) => {
                  const isCurrentYear = yr === selectedYear;
                  return (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        isCurrentYear
                          ? 'bg-blue-600 text-white shadow-xs scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Year {selectedYear} Question Status:</span>
                <span className="font-mono text-blue-700">
                  {yearStats.total > 0 ? `${yearStats.total} Questions Loaded` : 'Ready for CBT Practice'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                {yearStats.authenticCount > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {yearStats.authenticCount} Verified Past Questions
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-700 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Syllabus-Aligned Practice Series
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleLaunchTest}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/25 transition active:scale-95"
              >
                <span>Start {currentExam} {selectedYear} CBT Test</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartTopicPractice(selectedSubject)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Practise by Syllabus Topic Instead</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
