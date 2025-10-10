export interface Project {
  id: string;
  name: string;
  clientName: string;
  auditGoal?: string;
  devices?: Device[];
  hipaaRequired?: boolean;

  // Platform & Technical (project-level)
  platformNotes?: string;

  // Accessibility & Compliance (project-level)
  wcagCompliant?: boolean;
  wcagNotes?: string;
  hipaaCompliant?: boolean;

  // Brand Guidelines (project-level)
  brandGuidelinesCompliant?: boolean;
  brandGuidelineNonComplianceAreas?: string;
  typographyNotes?: string;
  colorPaletteNotes?: string;
  iconographyNotes?: string;
  componentUsageNotes?: string;
  feedbackAffordancesNotes?: string;
  responsivenessNotes?: string;

  // Usability Risks & Opportunities (project-level)
  efficiencyBlockers?: string;
  errorHandlingNotes?: string;
  recoveryPathsNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Flow {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  urls: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
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

  // Heuristic Violations
  heuristicViolations: HeuristicViolation[];

  // Platform & Technical
  platformNotes?: string;

  // Accessibility & Compliance
  wcagCompliant?: boolean;
  wcagNotes?: string;
  hipaaCompliant?: boolean;
  hipaaRequired?: boolean;

  // Design System Assessment
  brandGuidelinesCompliant?: boolean;
  brandGuidelineNonComplianceAreas?: string;
  typographyNotes?: string;
  colorPaletteNotes?: string;
  iconographyNotes?: string;
  componentUsageNotes?: string;
  feedbackAffordancesNotes?: string;
  responsivenessNotes?: string;

  // Usability Risks & Opportunities
  efficiencyBlockers?: string;
  errorHandlingNotes?: string;
  recoveryPathsNotes?: string;

  // Auto-calculated score
  overallScore?: number;

  createdAt: Date;
  updatedAt: Date;
}

export type Platform = 'Web' | 'iOS' | 'Android';
export type Device = 'Desktop' | 'Mobile' | 'Tablet';
