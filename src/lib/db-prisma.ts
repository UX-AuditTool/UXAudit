/**
 * Database access layer using Prisma for Azure PostgreSQL
 * Replaces Supabase-based db.ts
 */

import { getPrismaClient } from './prisma';
import type { Project, Flow, FlowAudit } from '../types';

// ============================================================================
// PROJECTS
// ============================================================================

export const dbGetAllProjects = async (): Promise<Project[]> => {
  const prisma = await getPrismaClient();

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return projects.map(project => ({
    id: project.id,
    name: project.name,
    clientName: project.clientName,
    auditGoal: project.auditGoal || undefined,
    devices: project.devices,
    hipaaRequired: project.hipaaRequired,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

export const dbGetProject = async (id: string): Promise<Project | null> => {
  const prisma = await getPrismaClient();

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) return null;

  return {
    id: project.id,
    name: project.name,
    clientName: project.clientName,
    auditGoal: project.auditGoal || undefined,
    devices: project.devices,
    hipaaRequired: project.hipaaRequired,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

export const dbCreateProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> => {
  const prisma = await getPrismaClient();

  const newProject = await prisma.project.create({
    data: {
      name: project.name,
      clientName: project.clientName,
      auditGoal: project.auditGoal || null,
      devices: project.devices || [],
      hipaaRequired: project.hipaaRequired || false,
    },
  });

  return {
    id: newProject.id,
    name: newProject.name,
    clientName: newProject.clientName,
    auditGoal: newProject.auditGoal || undefined,
    devices: newProject.devices,
    hipaaRequired: newProject.hipaaRequired,
    createdAt: newProject.createdAt,
    updatedAt: newProject.updatedAt,
  };
};

export const dbUpdateProject = async (
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Project> => {
  const prisma = await getPrismaClient();

  const data: any = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.clientName !== undefined) data.clientName = updates.clientName;
  if (updates.auditGoal !== undefined) data.auditGoal = updates.auditGoal || null;
  if (updates.devices !== undefined) data.devices = updates.devices;
  if (updates.hipaaRequired !== undefined) data.hipaaRequired = updates.hipaaRequired;

  const updatedProject = await prisma.project.update({
    where: { id },
    data,
  });

  return {
    id: updatedProject.id,
    name: updatedProject.name,
    clientName: updatedProject.clientName,
    auditGoal: updatedProject.auditGoal || undefined,
    devices: updatedProject.devices,
    hipaaRequired: updatedProject.hipaaRequired,
    createdAt: updatedProject.createdAt,
    updatedAt: updatedProject.updatedAt,
  };
};

export const dbDeleteProject = async (id: string): Promise<void> => {
  const prisma = await getPrismaClient();
  await prisma.project.delete({
    where: { id },
  });
};

// ============================================================================
// FLOWS
// ============================================================================

export const dbGetFlowsByProject = async (projectId: string): Promise<Flow[]> => {
  const prisma = await getPrismaClient();

  const flows = await prisma.flow.findMany({
    where: { projectId },
    orderBy: { order: 'asc' },
  });

  return flows.map(flow => ({
    id: flow.id,
    projectId: flow.projectId,
    name: flow.name,
    urls: flow.urls,
    order: flow.order,
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
  }));
};

export const dbGetFlow = async (id: string): Promise<Flow | null> => {
  const prisma = await getPrismaClient();

  const flow = await prisma.flow.findUnique({
    where: { id },
  });

  if (!flow) return null;

  return {
    id: flow.id,
    projectId: flow.projectId,
    name: flow.name,
    urls: flow.urls,
    order: flow.order,
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
  };
};

export const dbCreateFlow = async (
  flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt' | 'order'>
): Promise<Flow> => {
  const prisma = await getPrismaClient();

  // Get max order for this project
  const maxOrderFlow = await prisma.flow.findFirst({
    where: { projectId: flow.projectId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const maxOrder = maxOrderFlow?.order ?? -1;

  const newFlow = await prisma.flow.create({
    data: {
      projectId: flow.projectId,
      name: flow.name,
      urls: flow.urls || [],
      order: maxOrder + 1,
    },
  });

  return {
    id: newFlow.id,
    projectId: newFlow.projectId,
    name: newFlow.name,
    urls: newFlow.urls,
    order: newFlow.order,
    createdAt: newFlow.createdAt,
    updatedAt: newFlow.updatedAt,
  };
};

export const dbUpdateFlow = async (
  id: string,
  updates: Partial<Omit<Flow, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>
): Promise<Flow> => {
  const prisma = await getPrismaClient();

  const data: any = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.urls !== undefined) data.urls = updates.urls;
  if (updates.order !== undefined) data.order = updates.order;

  const updatedFlow = await prisma.flow.update({
    where: { id },
    data,
  });

  return {
    id: updatedFlow.id,
    projectId: updatedFlow.projectId,
    name: updatedFlow.name,
    urls: updatedFlow.urls,
    order: updatedFlow.order,
    createdAt: updatedFlow.createdAt,
    updatedAt: updatedFlow.updatedAt,
  };
};

export const dbDeleteFlow = async (id: string): Promise<void> => {
  const prisma = await getPrismaClient();
  await prisma.flow.delete({
    where: { id },
  });
};

// ============================================================================
// FLOW AUDITS
// ============================================================================

export const dbGetFlowAudit = async (flowId: string): Promise<FlowAudit | null> => {
  const prisma = await getPrismaClient();

  const audit = await prisma.flowAudit.findUnique({
    where: { flowId },
  });

  if (!audit) return null;

  return {
    id: audit.id,
    flowId: audit.flowId,
    heuristicViolations: audit.heuristicViolations as any,
    platformNotes: audit.platformNotes || undefined,
    wcagCompliant: audit.wcagCompliant,
    wcagNotes: audit.wcagNotes || undefined,
    hipaaCompliant: audit.hipaaCompliant,
    brandGuidelinesCompliant: audit.brandGuidelinesCompliant,
    brandGuidelineNonComplianceAreas: audit.brandGuidelineNonComplianceAreas || undefined,
    typographyNotes: audit.typographyNotes || undefined,
    colorPaletteNotes: audit.colorPaletteNotes || undefined,
    iconographyNotes: audit.iconographyNotes || undefined,
    componentUsageNotes: audit.componentUsageNotes || undefined,
    feedbackAffordancesNotes: audit.feedbackAffordancesNotes || undefined,
    responsivenessNotes: audit.responsivenessNotes || undefined,
    efficiencyBlockers: audit.efficiencyBlockers || undefined,
    errorHandlingNotes: audit.errorHandlingNotes || undefined,
    recoveryPathsNotes: audit.recoveryPathsNotes || undefined,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
  };
};

export const dbCreateFlowAudit = async (flowId: string): Promise<FlowAudit> => {
  const prisma = await getPrismaClient();

  const audit = await prisma.flowAudit.create({
    data: {
      flowId,
      heuristicViolations: [],
    },
  });

  return {
    id: audit.id,
    flowId: audit.flowId,
    heuristicViolations: audit.heuristicViolations as any,
    platformNotes: audit.platformNotes || undefined,
    wcagCompliant: audit.wcagCompliant,
    wcagNotes: audit.wcagNotes || undefined,
    hipaaCompliant: audit.hipaaCompliant,
    brandGuidelinesCompliant: audit.brandGuidelinesCompliant,
    brandGuidelineNonComplianceAreas: audit.brandGuidelineNonComplianceAreas || undefined,
    typographyNotes: audit.typographyNotes || undefined,
    colorPaletteNotes: audit.colorPaletteNotes || undefined,
    iconographyNotes: audit.iconographyNotes || undefined,
    componentUsageNotes: audit.componentUsageNotes || undefined,
    feedbackAffordancesNotes: audit.feedbackAffordancesNotes || undefined,
    responsivenessNotes: audit.responsivenessNotes || undefined,
    efficiencyBlockers: audit.efficiencyBlockers || undefined,
    errorHandlingNotes: audit.errorHandlingNotes || undefined,
    recoveryPathsNotes: audit.recoveryPathsNotes || undefined,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
  };
};

export const dbUpdateFlowAudit = async (
  flowId: string,
  updates: Partial<Omit<FlowAudit, 'id' | 'flowId' | 'createdAt' | 'updatedAt'>>
): Promise<FlowAudit> => {
  const prisma = await getPrismaClient();

  const data: any = {};
  if (updates.heuristicViolations !== undefined) data.heuristicViolations = updates.heuristicViolations;
  if (updates.platformNotes !== undefined) data.platformNotes = updates.platformNotes || null;
  if (updates.wcagCompliant !== undefined) data.wcagCompliant = updates.wcagCompliant;
  if (updates.wcagNotes !== undefined) data.wcagNotes = updates.wcagNotes || null;
  if (updates.hipaaCompliant !== undefined) data.hipaaCompliant = updates.hipaaCompliant;
  if (updates.brandGuidelinesCompliant !== undefined) data.brandGuidelinesCompliant = updates.brandGuidelinesCompliant;
  if (updates.brandGuidelineNonComplianceAreas !== undefined) data.brandGuidelineNonComplianceAreas = updates.brandGuidelineNonComplianceAreas || null;
  if (updates.typographyNotes !== undefined) data.typographyNotes = updates.typographyNotes || null;
  if (updates.colorPaletteNotes !== undefined) data.colorPaletteNotes = updates.colorPaletteNotes || null;
  if (updates.iconographyNotes !== undefined) data.iconographyNotes = updates.iconographyNotes || null;
  if (updates.componentUsageNotes !== undefined) data.componentUsageNotes = updates.componentUsageNotes || null;
  if (updates.feedbackAffordancesNotes !== undefined) data.feedbackAffordancesNotes = updates.feedbackAffordancesNotes || null;
  if (updates.responsivenessNotes !== undefined) data.responsivenessNotes = updates.responsivenessNotes || null;
  if (updates.efficiencyBlockers !== undefined) data.efficiencyBlockers = updates.efficiencyBlockers || null;
  if (updates.errorHandlingNotes !== undefined) data.errorHandlingNotes = updates.errorHandlingNotes || null;
  if (updates.recoveryPathsNotes !== undefined) data.recoveryPathsNotes = updates.recoveryPathsNotes || null;

  const updatedAudit = await prisma.flowAudit.update({
    where: { flowId },
    data,
  });

  return {
    id: updatedAudit.id,
    flowId: updatedAudit.flowId,
    heuristicViolations: updatedAudit.heuristicViolations as any,
    platformNotes: updatedAudit.platformNotes || undefined,
    wcagCompliant: updatedAudit.wcagCompliant,
    wcagNotes: updatedAudit.wcagNotes || undefined,
    hipaaCompliant: updatedAudit.hipaaCompliant,
    brandGuidelinesCompliant: updatedAudit.brandGuidelinesCompliant,
    brandGuidelineNonComplianceAreas: updatedAudit.brandGuidelineNonComplianceAreas || undefined,
    typographyNotes: updatedAudit.typographyNotes || undefined,
    colorPaletteNotes: updatedAudit.colorPaletteNotes || undefined,
    iconographyNotes: updatedAudit.iconographyNotes || undefined,
    componentUsageNotes: updatedAudit.componentUsageNotes || undefined,
    feedbackAffordancesNotes: updatedAudit.feedbackAffordancesNotes || undefined,
    responsivenessNotes: updatedAudit.responsivenessNotes || undefined,
    efficiencyBlockers: updatedAudit.efficiencyBlockers || undefined,
    errorHandlingNotes: updatedAudit.errorHandlingNotes || undefined,
    recoveryPathsNotes: updatedAudit.recoveryPathsNotes || undefined,
    createdAt: updatedAudit.createdAt,
    updatedAt: updatedAudit.updatedAt,
  };
};

export const dbGetOrCreateFlowAudit = async (flowId: string): Promise<FlowAudit> => {
  const existing = await dbGetFlowAudit(flowId);
  if (existing) return existing;
  return await dbCreateFlowAudit(flowId);
};
