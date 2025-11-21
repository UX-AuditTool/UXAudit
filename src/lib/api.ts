/**
 * Frontend API Client for UX Audit Tool
 * Replaces Supabase client with direct backend API calls
 */

import { Project, Flow, FlowAudit, PublicProject } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Error handling helper
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// Projects
// ============================================================================

export interface CreateProjectInput {
  name: string;
  clientName: string;
  auditGoal?: string | null;
  devices?: string[];
  hipaaRequired?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  clientName?: string;
  auditGoal?: string | null;
  devices?: string[];
  hipaaRequired?: boolean;
}

export const apiGetProjects = async (): Promise<Project[]> => {
  return fetchApi<Project[]>('/api/projects');
};

export const apiGetProject = async (id: string): Promise<Project> => {
  return fetchApi<Project>(`/api/projects/${id}`);
};

export const apiCreateProject = async (data: CreateProjectInput): Promise<Project> => {
  return fetchApi<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiUpdateProject = async (id: string, data: UpdateProjectInput): Promise<Project> => {
  return fetchApi<Project>(`/api/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDeleteProject = async (id: string): Promise<void> => {
  await fetchApi<void>(`/api/projects/${id}`, { method: 'DELETE' });
};

// ============================================================================
// Flows
// ============================================================================

export interface CreateFlowInput {
  projectId: string;
  name: string;
  urls?: string[];
}

export interface UpdateFlowInput {
  name?: string;
  urls?: string[];
  order?: number;
}

export const apiGetFlows = async (projectId: string): Promise<Flow[]> => {
  return fetchApi<Flow[]>(`/api/projects/${projectId}/flows`);
};

export const apiGetFlow = async (id: string): Promise<Flow> => {
  return fetchApi<Flow>(`/api/flows/${id}`);
};

export const apiCreateFlow = async (data: CreateFlowInput): Promise<Flow> => {
  return fetchApi<Flow>('/api/flows', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiUpdateFlow = async (id: string, data: UpdateFlowInput): Promise<Flow> => {
  return fetchApi<Flow>(`/api/flows/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDeleteFlow = async (id: string): Promise<void> => {
  await fetchApi<void>(`/api/flows/${id}`, { method: 'DELETE' });
};

export const apiReorderFlows = async (projectId: string, flowIds: string[]): Promise<Flow[]> => {
  return fetchApi<Flow[]>(`/api/projects/${projectId}/flows/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ flowIds }),
  });
};

// ============================================================================
// Flow Audits
// ============================================================================

export interface CreateFlowAuditInput {
  flowId: string;
  heuristicViolations?: any[];
  platformNotes?: string | null;
  wcagCompliant?: boolean;
  wcagNotes?: string | null;
  hipaaCompliant?: boolean;
  brandGuidelinesCompliant?: boolean;
  brandGuidelineNonComplianceAreas?: string | null;
  typographyNotes?: string | null;
  colorPaletteNotes?: string | null;
  iconographyNotes?: string | null;
  componentUsageNotes?: string | null;
  feedbackAffordancesNotes?: string | null;
  responsivenessNotes?: string | null;
  efficiencyBlockers?: string | null;
  errorHandlingNotes?: string | null;
  recoveryPathsNotes?: string | null;
}

export interface UpdateFlowAuditInput {
  heuristicViolations?: any[];
  platformNotes?: string | null;
  wcagCompliant?: boolean;
  wcagNotes?: string | null;
  hipaaCompliant?: boolean;
  brandGuidelinesCompliant?: boolean;
  brandGuidelineNonComplianceAreas?: string | null;
  typographyNotes?: string | null;
  colorPaletteNotes?: string | null;
  iconographyNotes?: string | null;
  componentUsageNotes?: string | null;
  feedbackAffordancesNotes?: string | null;
  responsivenessNotes?: string | null;
  efficiencyBlockers?: string | null;
  errorHandlingNotes?: string | null;
  recoveryPathsNotes?: string | null;
}

export const apiGetFlowAudit = async (flowId: string): Promise<FlowAudit | null> => {
  try {
    return await fetchApi<FlowAudit>(`/api/flows/${flowId}/audit`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null; // No audit exists yet
    }
    throw error;
  }
};

export const apiCreateFlowAudit = async (data: CreateFlowAuditInput): Promise<FlowAudit> => {
  // Use PATCH endpoint which does upsert (create or update)
  const { flowId, ...updates } = data;
  return fetchApi<FlowAudit>(`/api/flows/${flowId}/audit`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const apiUpdateFlowAudit = async (flowId: string, data: UpdateFlowAuditInput): Promise<FlowAudit> => {
  // Use PATCH endpoint (backend uses flowId, not audit id)
  return fetchApi<FlowAudit>(`/api/flows/${flowId}/audit`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDeleteFlowAudit = async (flowId: string): Promise<void> => {
  await fetchApi<void>(`/api/flows/${flowId}/audit`, { method: 'DELETE' });
};

// ============================================================================
// Publishing
// ============================================================================

export const apiPublishProject = async (projectId: string): Promise<Project> => {
  return fetchApi<Project>(`/api/projects/${projectId}/publish`, {
    method: 'POST',
  });
};

export const apiUnpublishProject = async (projectId: string): Promise<Project> => {
  return fetchApi<Project>(`/api/projects/${projectId}/unpublish`, {
    method: 'POST',
  });
};

// ============================================================================
// Public View (no auth)
// ============================================================================

export const apiGetPublicProject = async (shareToken: string): Promise<PublicProject> => {
  return fetchApi<PublicProject>(`/api/public/${shareToken}`);
};
