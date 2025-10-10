import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini only if API key is provided
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

export interface EnhanceContext {
  type: 'heuristic' | 'wcag' | 'hipaa' | 'brand' | 'general';
  heuristic?: string;
  severity?: string;
  fieldName?: string;
}

export const enhanceText = async (
  currentText: string,
  context: EnhanceContext
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Build context-aware prompt
  let prompt = '';

  if (context.type === 'heuristic' && context.heuristic) {
    prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about a usability issue related to "${context.heuristic}":

"${currentText}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions. If the note is too brief, make it slightly more descriptive while staying true to what was written.

Enhanced note:`;
  } else if (context.type === 'wcag') {
    prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about accessibility:

"${currentText}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
  } else if (context.type === 'brand') {
    prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about brand guidelines:

"${currentText}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
  } else {
    // General enhancement
    prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote:

"${currentText}"

Rewrite this to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text().trim();

    return enhancedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to enhance text. Please try again.');
  }
};

export const isAIConfigured = (): boolean => {
  return genAI !== null;
};

export interface ProjectSummaryData {
  projectName: string;
  flowCount: number;
  averageScore: number;
  flowSummaries: Array<{
    flowName: string;
    score: number;
    notes: string[];
  }>;
}

export const generateProjectSummary = async (
  data: ProjectSummaryData
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Build summary of all flows and their notes
  const flowSummaries = data.flowSummaries
    .map((flow) => {
      const notesText = flow.notes.filter(n => n.trim()).join('\n- ');
      return `**${flow.name}** (Score: ${flow.score}/5)\n${notesText ? `- ${notesText}` : '(No detailed notes)'}`;
    })
    .join('\n\n');

  const prompt = `You are a UX audit assistant creating an executive summary for a project audit.

Project: ${data.projectName}
Total Flows Audited: ${data.flowCount}
Average Score: ${data.averageScore.toFixed(1)}/5

Flow-by-Flow Findings:
${flowSummaries}

Based on the audit findings above, create a concise executive summary (3-4 paragraphs) that:
1. Opens with the overall project health and average score
2. Highlights the most critical issues found across all flows
3. Identifies common patterns or themes in the usability problems
4. Provides 2-3 high-priority recommendations for improvement

Keep it professional, actionable, and focused on business impact. Use bullet points sparingly for clarity.

Executive Summary:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
};
