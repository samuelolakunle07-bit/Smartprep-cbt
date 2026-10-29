import React, { useState } from 'react';
import { Subject, ExamBody, Question } from '../../types';
import { BookOpen, Sparkles, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  subject: Subject;
  examBody: ExamBody;
  allQuestions: Question[];
  onBack: () => void;
  onStartTopicTest: (params: {
    subject: Subject;
    topic: string;
    questionCount: number;
    durationMinutes: number;
  }) => void;
}

export const TopicPracticeSelector: React.FC<Props> = ({
  subject,
  examBody,
  allQuestions,
  onBack,
  onStartTopicTest,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    subject.syllabusTopics[0] || 'General Syllabus'
  );
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  const getTopicQuestionsCount = (topic: string) => {
    return allQuestions.filter(
      (q) => q.subjectId === subject.id && q.syllabusTopic === topic
    ).length;
  };

  const handleStart = () => {
    onStartTopicTest({
      subject,
      topic: selectedTopic,
      questionCount,
      durationMinutes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subject Catalogue
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Official {examBody} Syllabus Alignment
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Practise {subject.name} by Topic
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Focus on specific weak topics to achieve mastery before sitting for the full examination.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Syllabus Topic ({subject.syllabusTopics.length} Available):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {subject.syllabusTopics.map((topic, index) => {
              const isSelected = selectedTopic === topic;
              const availableInBank = getTopicQuestionsCount(topic);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition active:scale-[0.99] ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/50 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="pr-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {topic}
                    </h4>
                    <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
                      {availableInBank > 0
                        ? `${availableInBank} questions loaded`
                        : 'Syllabus practice generated'}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Number of Questions:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setQuestionCount(num);
                    setDurationMinutes(num === 10 ? 15 : num === 20 ? 25 : 35);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    questionCount === num
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Allocated Time:
            </label>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>{durationMinutes} Minutes</span>
              <span className="text-slate-400 font-normal">Approx. 1.2 min/question</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Topic Practice on "{selectedTopic}"</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
