import { supabase } from './supabase';
import { Project, Flow, FlowAudit, Device, HeuristicViolation } from '../types';

// Helper to convert database rows to app types
const dbToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  clientName: row.client_name,
  auditGoal: row.audit_goal,
  devices: row.devices as Device[],
  hipaaRequired: row.hipaa_required,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

const dbToFlow = (row: any): Flow => ({
  id: row.id,
  projectId: row.project_id,
  name: row.name,
  urls: row.urls || [],
  order: row.order,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

const dbToFlowAudit = (row: any): FlowAudit => ({
  id: row.id,
  flowId: row.flow_id,
  heuristicViolations: (row.heuristic_violations || []) as HeuristicViolation[],
  platformNotes: row.platform_notes,
  wcagCompliant: row.wcag_compliant,
  wcagNotes: row.wcag_notes,
  hipaaCompliant: row.hipaa_compliant,
  brandGuidelinesCompliant: row.brand_guidelines_compliant,
  brandGuidelineNonComplianceAreas: row.brand_guideline_non_compliance_areas,
  typographyNotes: row.typography_notes,
  colorPaletteNotes: row.color_palette_notes,
  iconographyNotes: row.iconography_notes,
  componentUsageNotes: row.component_usage_notes,
  feedbackAffordancesNotes: row.feedback_affordances_notes,
  responsivenessNotes: row.responsiveness_notes,
  efficiencyBlockers: row.efficiency_blockers,
  errorHandlingNotes: row.error_handling_notes,
  recoveryPathsNotes: row.recovery_paths_notes,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

// Projects
export const dbGetAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(dbToProject);
};

export const dbGetProject = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return dbToProject(data);
};

export const dbCreateProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: project.name,
      client_name: project.clientName,
      audit_goal: project.auditGoal,
      devices: project.devices,
      hipaa_required: project.hipaaRequired,
    })
    .select()
    .single();

  if (error) throw error;
  return dbToProject(data);
};

export const dbUpdateProject = async (
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Project> => {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
  if (updates.auditGoal !== undefined) dbUpdates.audit_goal = updates.auditGoal;
  if (updates.devices !== undefined) dbUpdates.devices = updates.devices;
  if (updates.hipaaRequired !== undefined) dbUpdates.hipaa_required = updates.hipaaRequired;

  const { data, error } = await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return dbToProject(data);
};

export const dbDeleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

// Flows
export const dbGetFlowsByProject = async (projectId: string): Promise<Flow[]> => {
  const { data, error } = await supabase
    .from('flows')
    .select('*')
    .eq('project_id', projectId)
    .order('order', { ascending: true });

  if (error) throw error;
  return data.map(dbToFlow);
};

export const dbGetFlow = async (id: string): Promise<Flow | null> => {
  const { data, error } = await supabase
    .from('flows')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return dbToFlow(data);
};

export const dbCreateFlow = async (
  flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt' | 'order'>
): Promise<Flow> => {
  // Get max order for this project
  const { data: flows } = await supabase
    .from('flows')
    .select('order')
    .eq('project_id', flow.projectId)
    .order('order', { ascending: false })
    .limit(1);

  const maxOrder = flows && flows.length > 0 ? flows[0].order : -1;

  const { data, error } = await supabase
    .from('flows')
    .insert({
      project_id: flow.projectId,
      name: flow.name,
      urls: flow.urls,
      order: maxOrder + 1,
    })
    .select()
    .single();

  if (error) throw error;
  return dbToFlow(data);
};

export const dbUpdateFlow = async (
  id: string,
  updates: Partial<Omit<Flow, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>
): Promise<Flow> => {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.urls !== undefined) dbUpdates.urls = updates.urls;
  if (updates.order !== undefined) dbUpdates.order = updates.order;

  const { data, error } = await supabase
    .from('flows')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return dbToFlow(data);
};

export const dbDeleteFlow = async (id: string): Promise<void> => {
  const { error } = await supabase.from('flows').delete().eq('id', id);
  if (error) throw error;
};

// Flow Audits
export const dbGetFlowAudit = async (flowId: string): Promise<FlowAudit | null> => {
  const { data, error } = await supabase
    .from('flow_audits')
    .select('*')
    .eq('flow_id', flowId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return dbToFlowAudit(data);
};

export const dbCreateFlowAudit = async (flowId: string): Promise<FlowAudit> => {
  const { data, error } = await supabase
    .from('flow_audits')
    .insert({
      flow_id: flowId,
      heuristic_violations: [],
    })
    .select()
    .single();

  if (error) throw error;
  return dbToFlowAudit(data);
};

export const dbUpdateFlowAudit = async (
  flowId: string,
  updates: Partial<Omit<FlowAudit, 'id' | 'flowId' | 'createdAt' | 'updatedAt'>>
): Promise<FlowAudit> => {
  const dbUpdates: any = {};

  if (updates.heuristicViolations !== undefined)
    dbUpdates.heuristic_violations = updates.heuristicViolations;
  if (updates.platformNotes !== undefined)
    dbUpdates.platform_notes = updates.platformNotes;
  if (updates.wcagCompliant !== undefined)
    dbUpdates.wcag_compliant = updates.wcagCompliant;
  if (updates.wcagNotes !== undefined)
    dbUpdates.wcag_notes = updates.wcagNotes;
  if (updates.hipaaCompliant !== undefined)
    dbUpdates.hipaa_compliant = updates.hipaaCompliant;
  if (updates.brandGuidelinesCompliant !== undefined)
    dbUpdates.brand_guidelines_compliant = updates.brandGuidelinesCompliant;
  if (updates.brandGuidelineNonComplianceAreas !== undefined)
    dbUpdates.brand_guideline_non_compliance_areas = updates.brandGuidelineNonComplianceAreas;
  if (updates.typographyNotes !== undefined)
    dbUpdates.typography_notes = updates.typographyNotes;
  if (updates.colorPaletteNotes !== undefined)
    dbUpdates.color_palette_notes = updates.colorPaletteNotes;
  if (updates.iconographyNotes !== undefined)
    dbUpdates.iconography_notes = updates.iconographyNotes;
  if (updates.componentUsageNotes !== undefined)
    dbUpdates.component_usage_notes = updates.componentUsageNotes;
  if (updates.feedbackAffordancesNotes !== undefined)
    dbUpdates.feedback_affordances_notes = updates.feedbackAffordancesNotes;
  if (updates.responsivenessNotes !== undefined)
    dbUpdates.responsiveness_notes = updates.responsivenessNotes;
  if (updates.efficiencyBlockers !== undefined)
    dbUpdates.efficiency_blockers = updates.efficiencyBlockers;
  if (updates.errorHandlingNotes !== undefined)
    dbUpdates.error_handling_notes = updates.errorHandlingNotes;
  if (updates.recoveryPathsNotes !== undefined)
    dbUpdates.recovery_paths_notes = updates.recoveryPathsNotes;

  const { data, error } = await supabase
    .from('flow_audits')
    .update(dbUpdates)
    .eq('flow_id', flowId)
    .select()
    .single();

  if (error) throw error;
  return dbToFlowAudit(data);
};

export const dbGetOrCreateFlowAudit = async (flowId: string): Promise<FlowAudit> => {
  const existing = await dbGetFlowAudit(flowId);
  if (existing) return existing;
  return dbCreateFlowAudit(flowId);
};
