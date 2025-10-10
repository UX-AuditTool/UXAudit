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
