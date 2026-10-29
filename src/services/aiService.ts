import { Question } from '../types';

export interface AiExplanationResult {
  success: boolean;
  text?: string;
  explanation?: string;
  fallback?: boolean;
  error?: string;
}

export class AiService {
  static async explainQuestion(params: {
    question: string;
    options: Record<string, string>;
    correctAnswer: string;
    chosenAnswer?: string;
    explanation?: string;
    subject: string;
    syllabusTopic: string;
    queryType: 'standard' | 'step-by-step';
  }): Promise<AiExplanationResult> {
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        text: data.text || data.explanation,
        fallback: data.fallback,
      };
    } catch {
      // Local educational fallback when offline or server unreachable
      return {
        success: true,
        fallback: true,
        text: `### 📚 Solution & Tutor Analysis

**Correct Answer:** Option **${params.correctAnswer}**

**Syllabus Topic:** ${params.syllabusTopic}

**Core Concept:**
${params.explanation || 'Review the core principles governing this concept in your syllabus.'}

${params.chosenAnswer && params.chosenAnswer !== params.correctAnswer ? `*Note on Option ${params.chosenAnswer}:* This is a frequent examiner trap. Ensure you verify formulas and operational units before selecting your final answer.` : ''}

*💡 Tip: For interactive real-time AI calculations, verify your device has active internet access.*`,
      };
    }
  }

  static async generatePracticeQuestions(params: {
    subject: string;
    topic: string;
    examBody: string;
    count?: number;
  }): Promise<{ success: boolean; questions: Question[]; error?: string }> {
    try {
      const response = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        return { success: true, questions: data.questions };
      }
      return { success: false, questions: [], error: 'Invalid response format' };
    } catch (err: any) {
      return {
        success: false,
        questions: [],
        error: err.message || 'Could not generate practice questions offline.',
      };
    }
  }

  static async getRevisionSummary(params: {
    subject: string;
    topic: string;
    examBody: string;
  }): Promise<{ success: boolean; summary: string }> {
    try {
      const response = await fetch('/api/ai/revision-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return {
        success: true,
        summary: data.summary || 'Summary unavailable.',
      };
    } catch {
      return {
        success: true,
        summary: `### 📌 Quick SS3 Revision: ${params.subject} - ${params.topic}

1. **Foundational Concept**: Familiarise yourself with all key definitions and dimensional units.
2. **Examiner Focus**: WAEC and JAMB frequently examine boundary conditions and real-world applications of ${params.topic}.
3. **Practice Habit**: Solve at least 15 past questions from 2005 to 2026 under timed conditions.`,
      };
    }
  }
}
