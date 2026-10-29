import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'SmartPrep CBT',
    version: '2.5.0',
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// AI Study Assistant: Explain Question
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const { question, options, correctAnswer, chosenAnswer, explanation, subject, syllabusTopic, queryType } = req.body;

    if (!aiClient) {
      // Graceful response when no API key is configured
      return res.json({
        fallback: true,
        explanation: explanation || `The correct answer is Option ${correctAnswer}. Revise the syllabus topic: "${syllabusTopic || subject}" to master the core principles.`,
        tip: 'Connect to internet and configure Gemini API key for dynamic interactive AI explanations.',
      });
    }

    const optionsText = Object.entries(options || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    let prompt = '';
    if (queryType === 'step-by-step') {
      prompt = `You are an expert Nigerian secondary school tutor preparing an SS3 student for WAEC, NECO, and JAMB UTME.
Teach the following ${subject} question step-by-step with clear, simple calculations and explanations suitable for a Nigerian secondary student:

Syllabus Topic: ${syllabusTopic || 'General'}
Question: ${question}
Options:
${optionsText}

Correct Answer: Option ${correctAnswer}
Candidate's Chosen Answer: Option ${chosenAnswer || 'None'}

Please provide:
1. Direct, clear step-by-step solution showing every working/formula.
2. Why Option ${correctAnswer} is the correct answer.
3. Why the other options (including Option ${chosenAnswer}) are wrong or common candidate traps.
4. An exam memory tip or mnemonics for this topic.
Keep formatting clean with clear markdown headings and bullets.`;
    } else {
      prompt = `You are a supportive, high-achieving Nigerian SSCE/UTME teacher.
Explain this ${subject} question to an SS3 student:

Topic: ${syllabusTopic}
Question: ${question}
Options:
${optionsText}

Correct Answer: Option ${correctAnswer}

Give a concise, crystal-clear explanation of the concept, explain why ${correctAnswer} is correct, and clarify the key pitfall candidates usually fall into in WAEC/JAMB.`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || 'Explanation generated successfully.';
    return res.json({ success: true, text });
  } catch (error: any) {
    console.error('AI Explain error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate explanation',
      fallback: true,
    });
  }
});

// AI Practice Question Generator: Generates syllabus-aligned practice questions
app.post('/api/ai/generate-practice', async (req: Request, res: Response) => {
  try {
    const { subject, topic, examBody, count = 3 } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        success: false,
        message: 'AI Service currently unavailable without active Gemini API key.',
      });
    }

    const prompt = `You are an expert curriculum developer for Nigerian secondary school examinations (${examBody || 'WAEC/JAMB'}).
Generate ${count} ORIGINAL PRACTICE QUESTIONS aligned with the official Nigerian Senior Secondary School (SS3) syllabus for:
Subject: ${subject}
Topic: ${topic}

CRITICAL RULES:
1. Label all questions clearly as "ORIGINAL PRACTICE QUESTION (Syllabus Aligned)". Do NOT claim they are actual past questions.
2. Follow the standard CBT multiple choice format with 4 options: A, B, C, D.
3. Include realistic options, a clear correct answer (A, B, C, or D), and a thorough educational explanation.
4. Return ONLY a valid JSON array of objects with the exact schema:
[
  {
    "id": "gen-1",
    "question": "Question text here",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A",
    "explanation": "Detailed step by step solution and reason",
    "syllabusTopic": "${topic}",
    "isAuthentic": false,
    "source": "AI-Generated Original Practice Question (SS3 Syllabus Aligned)"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawJson = response.text || '[]';
    const parsed = JSON.parse(rawJson);
    return res.json({ success: true, questions: parsed });
  } catch (error: any) {
    console.error('AI Practice Generation error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// AI Topic Revision Summary
app.post('/api/ai/revision-summary', async (req: Request, res: Response) => {
  try {
    const { subject, topic, examBody } = req.body;

    if (!aiClient) {
      return res.json({
        success: true,
        fallback: true,
        summary: `Key revision points for ${subject} - ${topic}:
• Master the fundamental definitions, laws, and core formulas.
• Solve past examination questions from 2005 to 2026 for this topic.
• Pay close attention to standard examiner units, diagrams, and common traps.`,
      });
    }

    const prompt = `Provide a high-yield, concise Nigerian SS3 revision summary for ${examBody || 'WAEC / JAMB'}:
Subject: ${subject}
Topic: ${topic}

Include:
1. Key Definitions & Core Laws/Formulas
2. 5 Must-Know Concepts frequently tested by WAEC/NECO/JAMB
3. Typical Examiner Traps & Common Mistakes
4. Quick Revision Memory Aids / Mnemonics.
Format in clean, engaging Markdown.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({ success: true, summary: response.text });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware for SPA handling: dev vs prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`[SmartPrep CBT] Server is live at http://0.0.0.0:${port}`);
});
