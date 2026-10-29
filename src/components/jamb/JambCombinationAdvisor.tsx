import React, { useState } from 'react';
import {
  JAMB_COURSE_REQUIREMENTS,
  JAMB_BROCHURE_DISCLAIMER,
} from '../../data/jambCombinations';
import { Subject, JambCourseRequirement } from '../../types';
import {
  Search,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Play,
  Info,
} from 'lucide-react';

interface Props {
  subjects: Subject[];
  onStartFullJambExam: (selectedSubjectIds: string[]) => void;
  onSaveToProfile?: (combination: string[]) => void;
}

export const JambCombinationAdvisor: React.FC<Props> = ({
  subjects,
  onStartFullJambExam,
  onSaveToProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<JambCourseRequirement>(
    JAMB_COURSE_REQUIREMENTS[0]
  );

  const faculties = [
    'all',
    'Medical & Pharmaceutical Sciences',
    'Engineering & Technology',
    'Sciences',
    'Law',
    'Social & Management Sciences',
    'Agriculture',
  ];

  const filteredCourses = JAMB_COURSE_REQUIREMENTS.filter((c) => {
    const matchesFaculty = selectedFaculty === 'all' || c.faculty === selectedFaculty;
    const matchesSearch =
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFaculty && matchesSearch;
  });

  const getSubjectIdByName = (name: string): string => {
    const found = subjects.find(
      (s) => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase())
    );
    return found ? found.id : 'english';
  };

  const handleApplyAndStart = () => {
    // English is mandatory
    const combination = [
      'english',
      ...selectedCourse.otherThreeSubjects.map((name) => getSubjectIdByName(name)),
    ];
    if (onSaveToProfile) {
      onSaveToProfile(combination);
    }
    onStartFullJambExam(combination);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20 mb-3">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          JAMB UTME Admission & Subject Combination Guide
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          JAMB UTME 4-Subject Combination Advisor
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mt-1">
          Select your intended university discipline to inspect the compulsory UTME subject combinations and launch full 4-subject mock simulations.
        </p>
      </div>

      {/* Official Disclaimer Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <span className="font-extrabold uppercase tracking-wide text-amber-900">
            Official JAMB Brochure Advisory:
          </span>
          <p className="text-amber-800">{JAMB_BROCHURE_DISCLAIMER}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Courses Explorer (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900">
              Browse University Courses ({filteredCourses.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search degree / course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-full sm:w-44"
              />
            </div>
          </div>

          {/* Faculty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {faculties.map((fac) => (
              <button
                key={fac}
                onClick={() => setSelectedFaculty(fac)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedFaculty === fac
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fac === 'all' ? 'All Faculties' : fac.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Course List */}
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredCourses.map((c) => {
              const isSelected = selectedCourse.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition active:scale-[0.99] ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/50 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="pr-2">
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
                      {c.faculty}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      {c.courseName}
                    </h4>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Subject Combination Card & Start Mock (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Selected Course Requirement
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {selectedCourse.courseName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Faculty of {selectedCourse.faculty}
              </p>
            </div>

            {/* 4 Subjects Display Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official 4 UTME Subjects Combination:
              </label>

              {/* Compulsory English */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-blue-950">
                      Use of English
                    </h5>
                    <span className="text-[10px] text-blue-700">Compulsory for all UTME Candidates (60 Questions)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-900">
                  Mandatory
                </span>
              </div>

              {/* Other 3 Subjects */}
              {selectedCourse.otherThreeSubjects.map((subName, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 2}
                    </span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                        {subName}
                      </h5>
                      <span className="text-[10px] text-slate-500">40 Questions (UTME Paper)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Required
                  </span>
                </div>
              ))}
            </div>

            {/* Specific Institution Remark */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Special Remarks & Waivers:
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {selectedCourse.institutionRequirementsNotice}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleApplyAndStart}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 4-Subject JAMB UTME Mock Exam (180 Qs)</span>
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Simulates standard 120-minute 4-subject CBT format with instant scoring out of 400.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
