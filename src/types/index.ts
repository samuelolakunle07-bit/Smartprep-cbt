export type ExamBody = 'WAEC' | 'NECO' | 'JAMB';

export type SubjectCategory =
  | 'Languages'
  | 'Sciences'
  | 'Commercial'
  | 'Arts'
  | 'Technical';

export interface SyllabusTopic {
  id: string;
  name: string;
  subjectId: string;
  subtopics?: string[];
  keyConcepts?: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: SubjectCategory;
  bodies: ExamBody[];
  syllabusTopics: string[];
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface Question {
  id: string;
  examBody: ExamBody;
  year: number; // 2005 - 2026
  subjectId: string;
  questionNumber: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string; // NECO occasionally has 5 options
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  syllabusTopic: string;
  isAuthentic: boolean; // true = authentic past exam question; false = syllabus-aligned practice
  source: string; // e.g., "WAEC SSCE May/June 2020 Question 14" or "Original Practice Question (SS3 Syllabus)"
  questionType: 'objective' | 'theory';
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examBody: ExamBody;
  subjectId: string; // or 'UTME_COMBINATION'
  subjectName: string;
  year?: number;
  topic?: string;
  mode: 'subject_practice' | 'topic_practice' | 'full_cbt' | 'mock_exam';
  totalQuestions: number;
  answeredCount: number;
  score: number;
  percentage: number;
  utmeScaledScore?: number; // Out of 400 for JAMB
  timeAllowedSeconds: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
  answers: Record<string, string>; // questionId -> chosenOption
  flaggedQuestionIds: string[];
  subjectBreakdown?: Record<string, { total: number; score: number; percentage: number }>;
  topicBreakdown?: Record<string, { total: number; score: number }>;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  classLevel: 'SS1' | 'SS2' | 'SS3' | 'Remedial/External';
  preferredExam: ExamBody;
  intendedCourse?: string;
  jambCombination?: string[]; // 4 subject IDs, e.g. ['english', 'math', 'physics', 'chemistry']
  isPremium: boolean;
  avatarSeed: string;
  registeredDate: string;
}

export interface JambCourseRequirement {
  id: string;
  faculty: 'Medical & Pharmaceutical Sciences' | 'Engineering & Technology' | 'Sciences' | 'Law' | 'Social & Management Sciences' | 'Arts & Humanities' | 'Education' | 'Agriculture';
  courseName: string;
  compulsorySubject: 'English Language';
  otherThreeSubjects: string[];
  acceptableAlternatives?: string[];
  institutionRequirementsNotice: string;
}

export interface QuestionFilter {
  examBody?: ExamBody;
  subjectId?: string;
  year?: number;
  topic?: string;
  authenticity?: 'all' | 'authentic' | 'practice';
  searchQuery?: string;
}
