import React, { useState } from 'react';
import { Question, Subject, ExamBody } from '../../types';
import { StorageService } from '../../services/storageService';
import {
  ShieldAlert,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Search,
  Filter,
  Check,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';

interface Props {
  questions: Question[];
  subjects: Subject[];
  onRefreshQuestions: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  questions,
  subjects,
  onRefreshQuestions,
  onClose,
}) => {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'questions' | 'add' | 'import' | 'stats'>('questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBody, setFilterBody] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Manual Question Creator State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [formBody, setFormBody] = useState<ExamBody>('WAEC');
  const [formYear, setFormYear] = useState<number>(2024);
  const [formSubjectId, setFormSubjectId] = useState<string>('mathematics');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formSyllabusTopic, setFormSyllabusTopic] = useState('');
  const [formIsAuthentic, setFormIsAuthentic] = useState(true);
  const [formSource, setFormSource] = useState('WAEC SSCE May/June 2024 Question 1');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Bulk Import state
  const [jsonInput, setJsonInput] = useState('');
  const [importSummary, setImportSummary] = useState<{ imported: number; duplicates: number } | null>(null);

  // Authenticate PIN
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026' || adminPin === 'admin' || adminPin === 'smartprep') {
      setIsAdminUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid Administrator PIN. (Default dev PIN: 2026)');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesBody = filterBody === 'all' || q.examBody === filterBody;
    const matchesSubject = filterSubject === 'all' || q.subjectId === filterSubject;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.syllabusTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBody && matchesSubject && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      StorageService.deleteQuestion(id);
      onRefreshQuestions();
    }
  };

  const handleEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    setFormBody(q.examBody);
    setFormYear(q.year);
    setFormSubjectId(q.subjectId);
    setFormQuestionText(q.question);
    setFormOptionA(q.options.A);
    setFormOptionB(q.options.B);
    setFormOptionC(q.options.C);
    setFormOptionD(q.options.D);
    setFormCorrectAnswer(q.correctAnswer as any);
    setFormExplanation(q.explanation);
    setFormSyllabusTopic(q.syllabusTopic);
    setFormIsAuthentic(q.isAuthentic);
    setFormSource(q.source);
    setActiveTab('add');
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText || !formOptionA || !formOptionB) {
      alert('Please fill out the question text and options A and B.');
      return;
    }

    const newQuestion: Question = {
      id: editingQuestionId || `q_${formBody.toLowerCase()}_${formSubjectId}_${formYear}_${Date.now()}`,
      examBody: formBody,
      year: Number(formYear),
      subjectId: formSubjectId,
      questionNumber: 1,
      question: formQuestionText,
      options: {
        A: formOptionA,
        B: formOptionB,
        C: formOptionC,
        D: formOptionD,
      },
      correctAnswer: formCorrectAnswer,
      explanation: formExplanation,
      syllabusTopic: formSyllabusTopic || 'General Syllabus',
      isAuthentic: formIsAuthentic,
      source: formSource || (formIsAuthentic ? `${formBody} Past Question` : 'Original Practice Question'),
      questionType: 'objective',
    };

    if (editingQuestionId) {
      StorageService.updateQuestion(newQuestion);
      setFormSuccessMessage('Question updated successfully!');
    } else {
      StorageService.addQuestion(newQuestion);
      setFormSuccessMessage('New question added to official question bank!');
    }

    onRefreshQuestions();
    setTimeout(() => setFormSuccessMessage(''), 3000);

    // Reset fields if adding new
    if (!editingQuestionId) {
      setFormQuestionText('');
      setFormOptionA('');
      setFormOptionB('');
      setFormOptionC('');
      setFormOptionD('');
      setFormExplanation('');
    }
    setEditingQuestionId(null);
  };

  const handleBulkJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert('Invalid JSON: Must be an array of Question objects.');
        return;
      }
      const result = StorageService.importQuestions(parsed);
      setImportSummary(result);
      onRefreshQuestions();
      setJsonInput('');
    } catch (e: any) {
      alert(`JSON parsing error: ${e.message}`);
    }
  };

  const exportQuestionsToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smartprep_questions_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Locked View
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Administrator Portal Access
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Protected area for SmartPrep CBT Question Bank Management, authentic past questions verification, and syllabus administration.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: 2026)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5">{pinError}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to App
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
              >
                Unlock Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Official Question Bank Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SmartPrep CBT Admin Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total Questions: <strong className="text-white">{questions.length}</strong> • Verified Authentic: <strong className="text-emerald-400">{questions.filter((q) => q.isAuthentic).length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportQuestionsToJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export JSON
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs text-xs font-bold gap-1">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeTab === 'questions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Browse Questions ({questions.length})
        </button>
        <button
          onClick={() => {
            setEditingQuestionId(null);
            setActiveTab('add');
          }}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeTab === 'add' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {editingQuestionId ? 'Edit Question' : 'Add Question Manually'}
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeTab === 'import' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bulk JSON / CSV Import
        </button>
      </div>

      {/* TAB 1: BROWSE QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search question, topic, source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterBody}
                onChange={(e) => setFilterBody(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="all">All Exam Bodies</option>
                <option value="WAEC">WAEC SSCE</option>
                <option value="NECO">NECO SSCE</option>
                <option value="JAMB">JAMB UTME</option>
              </select>
            </div>
            <div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Exam / Year</th>
                  <th className="py-3 px-3">Subject & Topic</th>
                  <th className="py-3 px-3">Question Text</th>
                  <th className="py-3 px-3">Answer</th>
                  <th className="py-3 px-3">Authenticity</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {q.examBody} {q.year}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 capitalize">{q.subjectId}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{q.syllabusTopic}</div>
                    </td>
                    <td className="py-3 px-3 max-w-sm truncate font-medium">
                      {q.question}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      Option {q.correctAnswer}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {q.isAuthentic ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Verified Past
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Practice Q
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleEdit(q)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL QUESTION CREATOR */}
      {activeTab === 'add' && (
        <form onSubmit={handleSaveQuestion} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
          <h3 className="font-extrabold text-base text-slate-900">
            {editingQuestionId ? 'Edit Existing Question' : 'Add New Question to Question Bank'}
          </h3>

          {formSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> {formSuccessMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Exam Body</label>
              <select
                value={formBody}
                onChange={(e) => setFormBody(e.target.value as ExamBody)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="WAEC">WAEC SSCE</option>
                <option value="NECO">NECO SSCE</option>
                <option value="JAMB">JAMB UTME</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Exam Year (2005 - 2026)</label>
              <input
                type="number"
                min="2005"
                max="2026"
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Syllabus Topic</label>
            <input
              type="text"
              placeholder="e.g. Indices, Logarithms & Surds"
              value={formSyllabusTopic}
              onChange={(e) => setFormSyllabusTopic(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Question Content</label>
            <textarea
              rows={3}
              placeholder="Type the full question text here..."
              value={formQuestionText}
              onChange={(e) => setFormQuestionText(e.target.value)}
              className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              required
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Option A</label>
              <input
                type="text"
                value={formOptionA}
                onChange={(e) => setFormOptionA(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Option B</label>
              <input
                type="text"
                value={formOptionB}
                onChange={(e) => setFormOptionB(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Option C</label>
              <input
                type="text"
                value={formOptionC}
                onChange={(e) => setFormOptionC(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Option D</label>
              <input
                type="text"
                value={formOptionD}
                onChange={(e) => setFormOptionD(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Correct Answer</label>
              <select
                value={formCorrectAnswer}
                onChange={(e) => setFormCorrectAnswer(e.target.value as any)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold text-emerald-700"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Authenticity Verification</label>
              <select
                value={formIsAuthentic ? 'true' : 'false'}
                onChange={(e) => setFormIsAuthentic(e.target.value === 'true')}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="true">Verified Authentic Past Question</option>
                <option value="false">Original Practice Question (Syllabus Aligned)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Source Reference</label>
              <input
                type="text"
                placeholder="e.g. WAEC May/June 2024 Q1"
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Examiner Solution & Explanation</label>
            <textarea
              rows={3}
              placeholder="Show complete step by step working and concept analysis..."
              value={formExplanation}
              onChange={(e) => setFormExplanation(e.target.value)}
              className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            {editingQuestionId ? 'Save Question Changes' : 'Publish Question to SmartPrep Bank'}
          </button>
        </form>
      )}

      {/* TAB 3: BULK IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Bulk Question Importer (JSON Format)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste an array of validated questions conforming to the SmartPrep CBT schema.
            </p>
          </div>

          {importSummary && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1">
              <div className="font-bold">Import Complete!</div>
              <div>Successfully imported: <strong>{importSummary.imported}</strong> questions</div>
              <div>Skipped duplicates: <strong>{importSummary.duplicates}</strong></div>
            </div>
          )}

          <textarea
            rows={10}
            placeholder={`[
  {
    "id": "waec-mth-2024-01",
    "examBody": "WAEC",
    "year": 2024,
    "subjectId": "mathematics",
    "questionNumber": 1,
    "question": "What is ...",
    "options": {
      "A": "Option 1",
      "B": "Option 2",
      "C": "Option 3",
      "D": "Option 4"
    },
    "correctAnswer": "A",
    "explanation": "Working here...",
    "syllabusTopic": "Algebra",
    "isAuthentic": true,
    "source": "WAEC SSCE 2024 Q1",
    "questionType": "objective"
  }
]`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-2xl bg-slate-50 border border-slate-200"
          />

          <button
            onClick={handleBulkJsonImport}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
          >
            Run Import to Database
          </button>
        </div>
      )}
    </div>
  );
};
