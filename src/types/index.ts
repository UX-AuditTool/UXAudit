export interface Project {
  id: string;
  name: string;
  clientName: string;
  auditGoal: string | null;
  devices: string[];
  hipaaRequired: boolean;
  createdAt: string;
  updatedAt: string;
  // Audit fields (project-level)
  platformNotes: string | null;
  wcagCompliant: boolean;
  wcagNotes: string | null;
  hipaaCompliant: boolean;
  brandGuidelinesCompliant: boolean;
  brandGuidelineNonComplianceAreas: string | null;
  // Brand guideline fields (project-level)
  typographyNotes: string | null;
  colorPaletteNotes: string | null;
  iconographyNotes: string | null;
  componentUsageNotes: string | null;
  feedbackAffordancesNotes: string | null;
  responsivenessNotes: string | null;
  efficiencyBlockers: string | null;
  errorHandlingNotes: string | null;
  recoveryPathsNotes: string | null;
}

export interface Flow {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  urls: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'None';

export type Heuristic =
  | 'Visibility of System Status'
  | 'Match Between System and Real World'
  | 'User Control and Freedom'
  | 'Consistency and Standards'
  | 'Error Prevention'
  | 'Recognition Rather than Recall'
  | 'Flexibility and Efficiency of Use'
  | 'Aesthetic and Minimalist Design'
  | 'Help Users Recognize, Diagnose, and Recover from Errors'
  | 'Help and Documentation';

export interface HeuristicViolation {
  heuristic: Heuristic;
  severity: Severity;
  notes: string;
  screenshotIds?: string[];
}

export interface FlowAudit {
  id: string;
  flowId: string;
  heuristicViolations: HeuristicViolation[];
  platformNotes: string | null;
  wcagCompliant: boolean;
  wcagNotes: string | null;
  hipaaCompliant: boolean;
  brandGuidelinesCompliant: boolean;
  brandGuidelineNonComplianceAreas: string | null;
  typographyNotes: string | null;
  colorPaletteNotes: string | null;
  iconographyNotes: string | null;
  componentUsageNotes: string | null;
  feedbackAffordancesNotes: string | null;
  responsivenessNotes: string | null;
  efficiencyBlockers: string | null;
  errorHandlingNotes: string | null;
  recoveryPathsNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Platform = 'Web' | 'iOS' | 'Android';
export type Device = 'Desktop' | 'Mobile' | 'Tablet';
