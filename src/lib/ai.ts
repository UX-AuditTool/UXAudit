// AI features are now proxied through the backend for security
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  try {
    const response = await fetch(`${API_URL}/api/ai/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: currentText,
        context,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to enhance text');
    }

    const data = await response.json();
    return data.enhancedText;
  } catch (error) {
    console.error('AI enhance error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to enhance text. Please try again.');
  }
};

export const isAIConfigured = (): boolean => {
  // AI is always available through backend proxy
  return true;
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
  try {
    const response = await fetch(`${API_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: data.projectName,
        flowCount: data.flowCount,
        averageScore: data.averageScore,
        flowSummaries: data.flowSummaries,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate summary');
    }

    const responseData = await response.json();
    return responseData.summary;
  } catch (error) {
    console.error('AI summarize error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate summary. Please try again.');
  }
};
