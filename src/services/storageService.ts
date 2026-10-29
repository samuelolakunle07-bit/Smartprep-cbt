import { ExamAttempt, Question, Subject, UserProfile, ExamBody } from '../types';
import { INITIAL_QUESTIONS } from '../data/questionsData';
import { OFFICIAL_SUBJECTS } from '../data/subjects';

const STORAGE_KEYS = {
  QUESTIONS: 'smartprep_questions_v2',
  SUBJECTS: 'smartprep_subjects_v2',
  ATTEMPTS: 'smartprep_attempts_v2',
  CURRENT_USER: 'smartprep_current_user_v2',
  ALL_USERS: 'smartprep_all_users_v2',
  BOOKMARKS: 'smartprep_bookmarks_v2',
  SETTINGS: 'smartprep_settings_v2',
  ACTIVE_EXAM_STATE: 'smartprep_active_exam_state_v2',
};

// Default Guest User
export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user',
  fullName: 'SS3 Candidate (Guest)',
  email: 'candidate@smartprep.ng',
  classLevel: 'SS3',
  preferredExam: 'JAMB',
  intendedCourse: 'Medicine and Surgery (MBBS)',
  jambCombination: ['english', 'biology', 'chemistry', 'physics'],
  isPremium: false,
  avatarSeed: 'scholar',
  registeredDate: new Date().toISOString(),
};

export class StorageService {
  // ================= QUESTIONS =================
  static getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
        return INITIAL_QUESTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_QUESTIONS;
    }
  }

  static saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Error saving questions to storage:', e);
    }
  }

  static addQuestion(question: Question): void {
    const list = this.getQuestions();
    list.unshift(question);
    this.saveQuestions(list);
  }

  static updateQuestion(updated: Question): void {
    const list = this.getQuestions().map((q) => (q.id === updated.id ? updated : q));
    this.saveQuestions(list);
  }

  static deleteQuestion(id: string): void {
    const list = this.getQuestions().filter((q) => q.id !== id);
    this.saveQuestions(list);
  }

  static importQuestions(newQuestions: Question[]): { imported: number; duplicates: number } {
    const existing = this.getQuestions();
    const existingIds = new Set(existing.map((q) => q.id));
    let imported = 0;
    let duplicates = 0;

    const toAdd: Question[] = [];
    for (const q of newQuestions) {
      if (existingIds.has(q.id)) {
        duplicates++;
      } else {
        toAdd.push(q);
        existingIds.add(q.id);
        imported++;
      }
    }

    if (toAdd.length > 0) {
      this.saveQuestions([...toAdd, ...existing]);
    }

    return { imported, duplicates };
  }

  // ================= SUBJECTS =================
  static getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(OFFICIAL_SUBJECTS));
        return OFFICIAL_SUBJECTS;
      }
      return JSON.parse(data);
    } catch {
      return OFFICIAL_SUBJECTS;
    }
  }

  static saveSubjects(subjects: Subject[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Error saving subjects:', e);
    }
  }

  // ================= ATTEMPTS =================
  static getAttempts(): ExamAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAttempt(attempt: ExamAttempt): void {
    try {
      const list = this.getAttempts();
      list.unshift(attempt);
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(list));
      // Clear any ongoing interrupted session once completed
      this.clearActiveExam();
    } catch (e) {
      console.error('Error saving exam attempt:', e);
    }
  }

  // ================= ONGOING EXAM STATE (Session Resilience) =================
  static saveActiveExam(state: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAM_STATE, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving active exam:', e);
    }
  }

  static getActiveExam(): any | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAM_STATE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static clearActiveExam(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM_STATE);
    } catch (e) {
      console.error('Error clearing active exam:', e);
    }
  }

  // ================= BOOKMARKS =================
  static getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleBookmark(questionId: string): boolean {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(questionId);
    let isBookmarked = false;
    if (index > -1) {
      bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      bookmarks.push(questionId);
      isBookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return isBookmarked;
  }

  // ================= USER & AUTH =================
  static getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_GUEST_USER;
    } catch {
      return DEFAULT_GUEST_USER;
    }
  }

  static saveCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving current user:', e);
    }
  }

  static getAllUsers(): Array<UserProfile & { passwordHash?: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveAllUsers(users: Array<UserProfile & { passwordHash?: string }>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users list:', e);
    }
  }
}
