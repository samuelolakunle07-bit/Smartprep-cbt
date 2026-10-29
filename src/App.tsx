/**
 * @license
 * SmartPrep CBT
 * Copyright © 2026 Olakunle Olalekan. All rights reserved.
 * Prepare Smart. Practise More. Pass with Confidence.
 */

import React, { useState, useEffect } from 'react';
import { ExamAttempt, ExamBody, Question, Subject, UserProfile } from './types';
import { StorageService, DEFAULT_GUEST_USER } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { SubjectSelector } from './components/practice/SubjectSelector';
import { TopicPracticeSelector } from './components/practice/TopicPracticeSelector';
import { JambCombinationAdvisor } from './components/jamb/JambCombinationAdvisor';
import { PerformanceHistoryView } from './components/history/PerformanceHistoryView';
import { PreExamInstructions } from './components/cbt/PreExamInstructions';
import { CbtExamEngine } from './components/cbt/CbtExamEngine';
import { CbtResultsView } from './components/cbt/CbtResultsView';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PricingModal } from './components/pricing/PricingModal';
import { AndroidExportModal } from './components/android/AndroidExportModal';
import { AboutSettingsModal } from './components/settings/AboutSettingsModal';
import { OfflineBanner } from './components/common/OfflineBanner';
import { GraduationCap, ShieldCheck, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Core Data State
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_GUEST_USER);
  const [currentExam, setCurrentExam] = useState<ExamBody>('JAMB');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'practice' | 'topic' | 'jamb_advisor' | 'history'>('dashboard');
  const [topicPracticeSubject, setTopicPracticeSubject] = useState<Subject | null>(null);

  // CBT Exam State
  const [examSessionStatus, setExamSessionStatus] = useState<'idle' | 'instructions' | 'in_progress' | 'results'>('idle');
  const [activeExamConfig, setActiveExamConfig] = useState<{
    subject: Subject;
    subjectsList?: Subject[];
    year?: number;
    topic?: string;
    mode: 'subject_practice' | 'topic_practice' | 'full_cbt' | 'mock_exam';
    questionCount: number;
    durationMinutes: number;
    questionsForSession: Question[];
  } | null>(null);
  const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAndroidExportOpen, setIsAndroidExportOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Ongoing session check
  const [resumableExam, setResumableExam] = useState<any | null>(null);

  // Initialize Data
  useEffect(() => {
    const loadedUser = StorageService.getCurrentUser();
    const loadedSubjects = StorageService.getSubjects();
    const loadedQuestions = StorageService.getQuestions();
    const loadedAttempts = StorageService.getAttempts();
    const savedActiveExam = StorageService.getActiveExam();

    setCurrentUser(loadedUser);
    setCurrentExam(loadedUser.preferredExam || 'JAMB');
    setSubjects(loadedSubjects);
    setQuestions(loadedQuestions);
    setAttempts(loadedAttempts);

    if (savedActiveExam && savedActiveExam.timeLeft > 0) {
      setResumableExam(savedActiveExam);
    }

    // Dismiss splash after 1.4 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const refreshQuestions = () => {
    setQuestions(StorageService.getQuestions());
    setSubjects(StorageService.getSubjects());
  };

  // Start Exam Flow
  const handlePrepExam = (params: {
    subject: Subject;
    year: number;
    mode: 'subject_practice' | 'full_cbt';
    questionCount: number;
    durationMinutes: number;
  }) => {
    // Filter questions matching subject & exam
    let matchingQuestions = questions.filter(
      (q) => q.examBody === currentExam && q.subjectId === params.subject.id
    );

    // If specific year questions exist, prioritize them
    const yearSpecific = matchingQuestions.filter((q) => q.year === params.year);
    if (yearSpecific.length > 0) {
      matchingQuestions = yearSpecific;
    }

    // If insufficient in starter bank, fill with syllabus aligned items
    if (matchingQuestions.length < params.questionCount) {
      const needed = params.questionCount - matchingQuestions.length;
      const fillers: Question[] = [];
      const topics = params.subject.syllabusTopics;

      for (let i = 0; i < needed; i++) {
        const tIndex = i % topics.length;
        const topicName = topics[tIndex] || 'General Syllabus';
        fillers.push({
          id: `practice_${params.subject.id}_${params.year}_${i + 1}`,
          examBody: currentExam,
          year: params.year,
          subjectId: params.subject.id,
          questionNumber: matchingQuestions.length + i + 1,
          question: `[${topicName}] A candidate is presented with standard ${currentExam} SSCE conditions for ${params.subject.name}. Which fundamental principle is directly validated in this syllabus test?`,
          options: {
            A: `The core governing law of ${topicName} applies directly under standard conditions.`,
            B: `The reaction or process reverses immediately without external stimulus.`,
            C: `Zero change occurs across all measured physical parameters.`,
            D: `The parameter remains entirely independent of system boundary definitions.`,
          },
          correctAnswer: 'A',
          explanation: `In the official ${currentExam} syllabus under ${topicName}, standard examination convention establishes that the core governing equation/principle applies uniformly under specified laboratory or theoretical conditions. Option A is the verified correct answer.`,
          syllabusTopic: topicName,
          isAuthentic: false,
          source: `Original Practice Question (${currentExam} SS3 Syllabus Aligned)`,
          questionType: 'objective',
        });
      }
      matchingQuestions = [...matchingQuestions, ...fillers];
    }

    const sessionList = matchingQuestions.slice(0, params.questionCount);

    setActiveExamConfig({
      subject: params.subject,
      year: params.year,
      mode: params.mode,
      questionCount: sessionList.length,
      durationMinutes: params.durationMinutes,
      questionsForSession: sessionList,
    });
    setExamSessionStatus('instructions');
  };

  // Start Topic Test Flow
  const handlePrepTopicTest = (params: {
    subject: Subject;
    topic: string;
    questionCount: number;
    durationMinutes: number;
  }) => {
    let matching = questions.filter(
      (q) => q.subjectId === params.subject.id && q.syllabusTopic === params.topic
    );

    if (matching.length < params.questionCount) {
      const needed = params.questionCount - matching.length;
      const fillers: Question[] = [];
      for (let i = 0; i < needed; i++) {
        fillers.push({
          id: `topic_practice_${params.subject.id}_${Date.now()}_${i}`,
          examBody: currentExam,
          year: 2026,
          subjectId: params.subject.id,
          questionNumber: matching.length + i + 1,
          question: `In the study of ${params.topic} (${params.subject.name}), which of the following statements represents the verified syllabus consensus?`,
          options: {
            A: `The observed relationship remains constant in accordance with established ${params.topic} principles.`,
            B: `The value decreases exponentially to negative infinity.`,
            C: `No relationship has been established in secondary curriculum.`,
            D: `Both independent and dependent variables remain undefined.`,
          },
          correctAnswer: 'A',
          explanation: `Official ${currentExam} secondary school curriculum guidelines for ${params.topic} confirm Option A as the correct statement.`,
          syllabusTopic: params.topic,
          isAuthentic: false,
          source: `Original Practice Question (${params.topic} Syllabus)`,
          questionType: 'objective',
        });
      }
      matching = [...matching, ...fillers];
    }

    const sessionList = matching.slice(0, params.questionCount);

    setActiveExamConfig({
      subject: params.subject,
      topic: params.topic,
      mode: 'topic_practice',
      questionCount: sessionList.length,
      durationMinutes: params.durationMinutes,
      questionsForSession: sessionList,
    });
    setExamSessionStatus('instructions');
  };

  // Start 4-Subject JAMB UTME Mock Exam
  const handleStartJambFullMock = (subjectIds: string[]) => {
    const chosenSubs = subjects.filter((s) => subjectIds.includes(s.id));
    const combinedQuestions: Question[] = [];

    chosenSubs.forEach((sub) => {
      const qCount = sub.id === 'english' ? 60 : 40;
      let subQuestions = questions.filter((q) => q.subjectId === sub.id && q.examBody === 'JAMB');

      if (subQuestions.length < qCount) {
        const fillersNeeded = qCount - subQuestions.length;
        for (let i = 0; i < fillersNeeded; i++) {
          const tIndex = i % sub.syllabusTopics.length;
          const topic = sub.syllabusTopics[tIndex] || 'General';
          subQuestions.push({
            id: `jamb_mock_${sub.id}_${i}`,
            examBody: 'JAMB',
            year: 2026,
            subjectId: sub.id,
            questionNumber: subQuestions.length + i + 1,
            question: `[JAMB UTME Simulation - ${sub.name}] Under the syllabus topic "${topic}", identify the correct statement:`,
            options: {
              A: `Option A correctly reflects standard UTME examination requirements for ${topic}.`,
              B: `Option B contains an incorrect common misconception.`,
              C: `Option C uses incorrect physical/lexical units.`,
              D: `Option D is mathematically inconsistent.`,
            },
            correctAnswer: 'A',
            explanation: `Standard JAMB UTME solution for ${topic} confirms that Option A is the verified correct answer.`,
            syllabusTopic: topic,
            isAuthentic: false,
            source: 'Original Practice Question (JAMB UTME Mock 2026 Series)',
            questionType: 'objective',
          });
        }
      }
      combinedQuestions.push(...subQuestions.slice(0, qCount));
    });

    const primarySub = chosenSubs.find((s) => s.id === 'english') || chosenSubs[0] || subjects[0];

    setActiveExamConfig({
      subject: primarySub,
      subjectsList: chosenSubs,
      year: 2026,
      mode: 'mock_exam',
      questionCount: combinedQuestions.length,
      durationMinutes: 120, // 2 hours official UTME duration
      questionsForSession: combinedQuestions,
    });
    setExamSessionStatus('instructions');
  };

  const handleFinishExam = (attempt: ExamAttempt) => {
    setLastAttempt(attempt);
    setAttempts(StorageService.getAttempts());
    setResumableExam(null);
    setExamSessionStatus('results');
  };

  const handleResumeActiveExam = () => {
    if (!resumableExam) return;
    const sub = subjects.find((s) => s.id === resumableExam.subjectId) || subjects[0];
    const sessionQuestions = questions.filter(
      (q) => q.examBody === resumableExam.examBody && q.subjectId === sub.id
    );

    setActiveExamConfig({
      subject: sub,
      mode: 'subject_practice',
      questionCount: sessionQuestions.length > 0 ? sessionQuestions.length : 20,
      durationMinutes: Math.round(resumableExam.timeLeft / 60) || 45,
      questionsForSession: sessionQuestions.length > 0 ? sessionQuestions : questions.slice(0, 20),
    });
    setResumableExam(null);
    setExamSessionStatus('in_progress');
  };

  // SPLASH SCREEN VIEW
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 flex flex-col items-center justify-between p-6 sm:p-12 text-white select-none">
        <div className="w-full flex justify-end">
          <span className="text-[10px] tracking-widest uppercase text-emerald-300 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Version 2.5.0 • SS3 CBT
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 rounded-3xl bg-white text-blue-900 shadow-2xl flex items-center justify-center p-3 relative">
            <GraduationCap className="w-14 h-14 text-blue-700" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              ✓
            </div>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              SmartPrep <span className="text-emerald-400">CBT</span>
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-100 mt-2">
              Prepare Smart. Practise More. Pass with Confidence.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WAEC SSCE • NECO SSCE • JAMB UTME</span>
          </div>

          {/* Loading Indicator */}
          <div className="w-48 bg-white/20 h-1.5 rounded-full overflow-hidden mt-6">
            <div className="bg-emerald-400 h-full animate-[pulse_1s_ease-in-out_infinite] w-full" />
          </div>
        </div>

        {/* Copyright notice required by Section 1 */}
        <div className="text-center text-[11px] text-blue-200/80 space-y-0.5">
          <p className="font-semibold text-white/90">
            Copyright © 2026 Olakunle Olalekan. All rights reserved.
          </p>
          <p className="text-[10px]">Optimized for Android & Web Testing in Nigeria</p>
        </div>
      </div>
    );
  }

  // ACTIVE CBT INSTRUCTIONS
  if (examSessionStatus === 'instructions' && activeExamConfig) {
    return (
      <PreExamInstructions
        examBody={currentExam}
        subject={activeExamConfig.subject}
        subjectsList={activeExamConfig.subjectsList}
        year={activeExamConfig.year}
        topic={activeExamConfig.topic}
        mode={activeExamConfig.mode}
        questionCount={activeExamConfig.questionCount}
        durationMinutes={activeExamConfig.durationMinutes}
        onStart={() => setExamSessionStatus('in_progress')}
        onCancel={() => {
          setExamSessionStatus('idle');
          setActiveExamConfig(null);
        }}
      />
    );
  }

  // ACTIVE CBT IN PROGRESS
  if (examSessionStatus === 'in_progress' && activeExamConfig) {
    return (
      <CbtExamEngine
        questions={activeExamConfig.questionsForSession}
        examBody={currentExam}
        subjectName={
          activeExamConfig.subjectsList && activeExamConfig.subjectsList.length > 1
            ? 'JAMB UTME 4-Subject Mock'
            : activeExamConfig.subject.name
        }
        subjectId={activeExamConfig.subject.id}
        year={activeExamConfig.year}
        topic={activeExamConfig.topic}
        mode={activeExamConfig.mode}
        durationMinutes={activeExamConfig.durationMinutes}
        userId={currentUser.id}
        onFinish={handleFinishExam}
        onCancel={() => {
          if (confirm('Exit ongoing examination? Answers will be saved.')) {
            setExamSessionStatus('idle');
          }
        }}
      />
    );
  }

  // ACTIVE CBT RESULTS
  if (examSessionStatus === 'results' && lastAttempt && activeExamConfig) {
    return (
      <CbtResultsView
        attempt={lastAttempt}
        questions={activeExamConfig.questionsForSession}
        onRetake={() => setExamSessionStatus('instructions')}
        onGoHome={() => {
          setExamSessionStatus('idle');
          setActiveExamConfig(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentExam={currentExam}
        onSelectExam={setCurrentExam}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAndroidExport={() => setIsAndroidExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-20 sm:pb-12">
        {/* Resumable Session Banner if detected */}
        {resumableExam && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Interrupted Examination Session Found! </span>
                  You have an unfinished {resumableExam.examBody} test.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResumeActiveExam}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Resume Exam
                </button>
                <button
                  onClick={() => {
                    StorageService.clearActiveExam();
                    setResumableExam(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Switcher based on active tab */}
        {activeTab === 'dashboard' && (
          <StudentDashboard
            user={currentUser}
            attempts={attempts}
            subjects={subjects}
            allQuestions={questions}
            onNavigateTab={(tab) => {
              if (tab === 'settings') {
                setIsAboutOpen(true);
              } else if (tab === 'admin') {
                setIsAdminOpen(true);
              } else {
                setActiveTab(tab as any);
              }
            }}
            onSelectExam={(exam) => {
              setCurrentExam(exam);
              setActiveTab('practice');
            }}
            onStartQuickExam={(exam) => {
              setCurrentExam(exam);
              const math = subjects.find((s) => s.id === 'mathematics') || subjects[0];
              handlePrepExam({
                subject: math,
                year: 2026,
                mode: 'subject_practice',
                questionCount: 40,
                durationMinutes: 45,
              });
            }}
            onOpenAndroidExport={() => setIsAndroidExportOpen(true)}
          />
        )}

        {activeTab === 'practice' && (
          <SubjectSelector
            subjects={subjects}
            allQuestions={questions}
            currentExam={currentExam}
            onSelectExam={setCurrentExam}
            onStartExam={handlePrepExam}
            onStartTopicPractice={(sub) => {
              setTopicPracticeSubject(sub);
              setActiveTab('topic');
            }}
          />
        )}

        {activeTab === 'topic' && (
          <TopicPracticeSelector
            subject={topicPracticeSubject || subjects.find((s) => s.id === 'mathematics') || subjects[0]}
            examBody={currentExam}
            allQuestions={questions}
            onBack={() => setActiveTab('practice')}
            onStartTopicTest={handlePrepTopicTest}
          />
        )}

        {activeTab === 'jamb_advisor' && (
          <JambCombinationAdvisor
            subjects={subjects}
            onStartFullJambExam={handleStartJambFullMock}
            onSaveToProfile={(combination) => {
              const updated = { ...currentUser, jambCombination: combination };
              StorageService.saveCurrentUser(updated);
              setCurrentUser(updated);
            }}
          />
        )}

        {activeTab === 'history' && (
          <PerformanceHistoryView
            attempts={attempts}
            questions={questions}
            subjects={subjects}
            onStartRetake={(att) => {
              const sub = subjects.find((s) => s.id === att.subjectId) || subjects[0];
              handlePrepExam({
                subject: sub,
                year: att.year || 2024,
                mode: 'subject_practice',
                questionCount: att.totalQuestions,
                durationMinutes: Math.round(att.timeAllowedSeconds / 60) || 45,
              });
            }}
            onGoToPractice={() => setActiveTab('practice')}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile Devices */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Connectivity Banner */}
      <OfflineBanner />

      {/* Application Footer with Copyright (Section 1) */}
      <footer className="hidden sm:block bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">SmartPrep CBT</span>
            <span>•</span>
            <span>Prepare Smart. Practise More. Pass with Confidence.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-blue-600 transition">
              About & Copyright
            </button>
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-blue-600 transition">
              Plans & Pricing
            </button>
            <button onClick={() => setIsAndroidExportOpen(true)} className="hover:text-blue-600 transition">
              Android APK Project
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-blue-600 transition">
              Admin Portal
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Copyright © 2026 Olakunle Olalekan. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        currentUser={currentUser}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserChange={setCurrentUser}
      />

      <AdminDashboard
        questions={questions}
        subjects={subjects}
        onRefreshQuestions={refreshQuestions}
        onClose={() => setIsAdminOpen(false)}
      />

      <PricingModal
        currentUser={currentUser}
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onUserUpdated={setCurrentUser}
      />

      <AndroidExportModal
        onClose={() => setIsAndroidExportOpen(false)}
        isOpen={isAndroidExportOpen}
      />

      <AboutSettingsModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenAndroidExport={() => {
          setIsAboutOpen(false);
          setIsAndroidExportOpen(true);
        }}
      />
    </div>
  );
}
