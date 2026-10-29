import React, { useState } from 'react';
import { Question, ExamBody } from '../../types';
import { AiService } from '../../services/aiService';
import { Sparkles, BookOpen, Lightbulb, X, Copy, Check, RefreshCw, AlertCircle, Send } from 'lucide-react';

interface Props {
  question?: Question;
  examBody: ExamBody;
  subjectName: string;
  syllabusTopic: string;
  chosenAnswer?: string;
  onClose: () => void;
  onAddGeneratedQuestions?: (questions: Question[]) => void;
}

export const AiTutorModal: React.FC<Props> = ({
  question,
  examBody,
  subjectName,
  syllabusTopic,
  chosenAnswer,
  onClose,
  onAddGeneratedQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'summary' | 'generate'>('explain');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<string>('');
  const [isFallback, setIsFallback] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<Question[]>([]);

  // Automatically trigger explanation when modal opens on a question
  React.useEffect(() => {
    if (activeTab === 'explain' && question && !content) {
      loadExplanation('step-by-step');
    }
  }, [activeTab, question]);

  const loadExplanation = async (type: 'standard' | 'step-by-step') => {
    if (!question) return;
    setLoading(true);
    setContent('');
    try {
      const res = await AiService.explainQuestion({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        chosenAnswer,
        explanation: question.explanation,
        subject: subjectName,
        syllabusTopic: question.syllabusTopic || syllabusTopic,
        queryType: type,
      });
      setContent(res.text || res.explanation || 'No explanation returned.');
      setIsFallback(!!res.fallback);
    } catch {
      setContent(question.explanation || 'Review this topic in your standard syllabus.');
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const loadRevisionSummary = async () => {
    setLoading(true);
    setContent('');
    try {
      const res = await AiService.getRevisionSummary({
        subject: subjectName,
        topic: syllabusTopic || 'General Syllabus',
        examBody,
      });
      setContent(res.summary);
    } catch {
      setContent('Summary currently unavailable. Verify network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setGeneratedItems([]);
    try {
      const res = await AiService.generatePracticeQuestions({
        subject: subjectName,
        topic: syllabusTopic || 'General Syllabus',
        examBody,
        count: 3,
      });
      if (res.success && res.questions.length > 0) {
        setGeneratedItems(res.questions);
      } else {
        setContent(res.error || 'Unable to generate practice questions at this moment.');
      }
    } catch {
      setContent('Failed to generate practice questions.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                SmartPrep AI Study Assistant
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {subjectName} Tutor
              </h3>
              <p className="text-xs text-blue-200 truncate max-w-xs sm:max-w-md">
                Topic: {syllabusTopic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('explain');
              if (!content && question) loadExplanation('step-by-step');
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'explain'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Step-by-Step Solution
          </button>
          <button
            onClick={() => {
              setActiveTab('summary');
              loadRevisionSummary();
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            Topic Revision Summary
          </button>
          <button
            onClick={() => {
              setActiveTab('generate');
              if (generatedItems.length === 0) handleGenerateQuestions();
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'generate'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Original Practice Questions
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 text-sm space-y-4">
          {isFallback && activeTab === 'explain' && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Standard Verified Examiner Solution loaded directly from SmartPrep local database.</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium">SmartPrep AI is generating step-by-step guidance...</p>
              <p className="text-xs text-slate-400">Synthesizing {examBody} syllabus explanations</p>
            </div>
          ) : activeTab === 'generate' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CRITICAL ACCURACY NOTICE:</span> These questions are syllabus-aligned original practice questions generated for practice purposes. They are <strong>NOT authentic past examination questions</strong>.
                </div>
              </div>

              {generatedItems.length > 0 ? (
                <div className="space-y-4">
                  {generatedItems.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">Practice Question {idx + 1}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                          Original Practice
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 text-sm">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {Object.entries(q.options).map(([letter, text]) => (
                          <div
                            key={letter}
                            className={`p-2 rounded-lg border text-xs ${
                              letter === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{letter}.</span> {text}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                        <strong className="text-emerald-700">Explanation: </strong> {q.explanation}
                      </div>
                    </div>
                  ))}

                  {onAddGeneratedQuestions && (
                    <button
                      onClick={() => {
                        onAddGeneratedQuestions(generatedItems);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                    >
                      Save Generated Practice Questions to My Bank
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-xs mb-3">No practice questions generated yet.</p>
                  <button
                    onClick={handleGenerateQuestions}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    Generate 3 Practice Questions
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'explain' && (
              <button
                onClick={() => loadExplanation('step-by-step')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Re-explain Step-by-Step
              </button>
            )}
            {content && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
