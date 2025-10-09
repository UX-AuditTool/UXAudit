import { create } from 'zustand';
import { Project, Flow, FlowAudit, HeuristicViolation } from '../types';

interface AppState {
  // Data
  projects: Project[];
  flows: Flow[];
  flowAudits: FlowAudit[];
  currentProjectId: string | null;

  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  setCurrentProject: (projectId: string) => void;

  // Actions - Flows
  addFlow: (flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Flow;
  getFlowsByProject: (projectId: string) => Flow[];

  // Actions - Flow Audits
  getOrCreateFlowAudit: (flowId: string) => FlowAudit;
  updateFlowAudit: (flowId: string, updates: Partial<Omit<FlowAudit, 'id' | 'flowId' | 'createdAt' | 'updatedAt'>>) => void;
  updateHeuristicViolation: (flowId: string, violation: HeuristicViolation) => void;
}

const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  flows: [],
  flowAudits: [],
  currentProjectId: null,

  // Project actions
  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      projects: [...state.projects, newProject],
      currentProjectId: newProject.id,
    }));

    return newProject;
  },

  setCurrentProject: (projectId) => {
    set({ currentProjectId: projectId });
  },

  // Flow actions
  addFlow: (flowData) => {
    const flows = get().flows.filter((f) => f.projectId === flowData.projectId);
    const maxOrder = flows.length > 0 ? Math.max(...flows.map((f) => f.order)) : -1;

    const newFlow: Flow = {
      ...flowData,
      id: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      flows: [...state.flows, newFlow],
    }));

    return newFlow;
  },

  getFlowsByProject: (projectId) => {
    return get()
      .flows.filter((f) => f.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  },

  // Flow Audit actions
  getOrCreateFlowAudit: (flowId) => {
    const existing = get().flowAudits.find((a) => a.flowId === flowId);
    if (existing) return existing;

    const newAudit: FlowAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      flowId,
      heuristicViolations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      flowAudits: [...state.flowAudits, newAudit],
    }));

    return newAudit;
  },

  updateFlowAudit: (flowId, updates) => {
    set((state) => ({
      flowAudits: state.flowAudits.map((audit) =>
        audit.flowId === flowId
          ? { ...audit, ...updates, updatedAt: new Date() }
          : audit
      ),
    }));
  },

  updateHeuristicViolation: (flowId, violation) => {
    const audit = get().getOrCreateFlowAudit(flowId);
    const existingIndex = audit.heuristicViolations.findIndex(
      (v) => v.heuristic === violation.heuristic
    );

    const updatedViolations = [...audit.heuristicViolations];
    if (existingIndex >= 0) {
      updatedViolations[existingIndex] = violation;
    } else {
      updatedViolations.push(violation);
    }

    get().updateFlowAudit(flowId, {
      heuristicViolations: updatedViolations,
    });
  },
}));

export default useStore;
