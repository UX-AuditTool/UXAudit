import { create } from 'zustand';
import { Project, Flow, FlowAudit, HeuristicViolation } from '../types';
import {
  dbGetAllProjects,
  dbCreateProject,
  dbUpdateProject,
  dbDeleteProject,
  dbGetFlowsByProject,
  dbCreateFlow,
  dbUpdateFlow,
  dbGetOrCreateFlowAudit,
  dbUpdateFlowAudit,
} from '../lib/db';

interface AppState {
  // Data
  projects: Project[];
  flows: Flow[];
  flowAudits: FlowAudit[];
  currentProjectId: string | null;
  isLoading: boolean;

  // Actions - Init
  loadProjects: () => Promise<void>;
  loadFlows: (projectId: string) => Promise<void>;

  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (projectId: string) => void;

  // Actions - Flows
  addFlow: (flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Flow>;
  updateFlow: (flowId: string, updates: Partial<Omit<Flow, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  getFlowsByProject: (projectId: string) => Flow[];

  // Actions - Flow Audits
  getOrCreateFlowAudit: (flowId: string) => FlowAudit;
  updateFlowAudit: (flowId: string, updates: Partial<Omit<FlowAudit, 'id' | 'flowId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  updateHeuristicViolation: (flowId: string, violation: HeuristicViolation) => Promise<void>;
}

const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  flows: [],
  flowAudits: [],
  currentProjectId: null,
  isLoading: false,

  // Load data from database
  loadProjects: async () => {
    try {
      set({ isLoading: true });
      const projects = await dbGetAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Error loading projects:', error);
      set({ isLoading: false });
    }
  },

  loadFlows: async (projectId: string) => {
    try {
      const flows = await dbGetFlowsByProject(projectId);
      set((state) => ({
        flows: [
          ...state.flows.filter((f) => f.projectId !== projectId),
          ...flows,
        ],
      }));
    } catch (error) {
      console.error('Error loading flows:', error);
    }
  },

  // Project actions
  addProject: async (projectData) => {
    try {
      const newProject = await dbCreateProject(projectData);
      set((state) => ({
        projects: [...state.projects, newProject],
        currentProjectId: newProject.id,
      }));
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (projectId: string, updates) => {
    try {
      const updatedProject = await dbUpdateProject(projectId, updates);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    try {
      await dbDeleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        flows: state.flows.filter((f) => f.projectId !== projectId),
        currentProjectId: state.currentProjectId === projectId ? null : state.currentProjectId,
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  setCurrentProject: (projectId) => {
    set({ currentProjectId: projectId });
  },

  // Flow actions
  addFlow: async (flowData) => {
    try {
      const newFlow = await dbCreateFlow(flowData);
      set((state) => ({
        flows: [...state.flows, newFlow],
      }));
      return newFlow;
    } catch (error) {
      console.error('Error creating flow:', error);
      throw error;
    }
  },

  updateFlow: async (flowId: string, updates) => {
    try {
      const updatedFlow = await dbUpdateFlow(flowId, updates);
      set((state) => ({
        flows: state.flows.map((f) =>
          f.id === flowId ? updatedFlow : f
        ),
      }));
    } catch (error) {
      console.error('Error updating flow:', error);
      throw error;
    }
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

    // Create placeholder - will be synced with DB on first update
    const newAudit: FlowAudit = {
      id: `audit-temp-${Date.now()}`,
      flowId,
      heuristicViolations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      flowAudits: [...state.flowAudits, newAudit],
    }));

    // Load from DB in background
    dbGetOrCreateFlowAudit(flowId).then((dbAudit) => {
      set((state) => ({
        flowAudits: state.flowAudits.map((audit) =>
          audit.flowId === flowId ? dbAudit : audit
        ),
      }));
    });

    return newAudit;
  },

  updateFlowAudit: async (flowId, updates) => {
    try {
      // Optimistic update
      set((state) => ({
        flowAudits: state.flowAudits.map((audit) =>
          audit.flowId === flowId
            ? { ...audit, ...updates, updatedAt: new Date() }
            : audit
        ),
      }));

      // Persist to database
      const updatedAudit = await dbUpdateFlowAudit(flowId, updates);

      // Update with server response
      set((state) => ({
        flowAudits: state.flowAudits.map((audit) =>
          audit.flowId === flowId ? updatedAudit : audit
        ),
      }));
    } catch (error) {
      console.error('Error updating flow audit:', error);
      // Reload from DB on error
      const dbAudit = await dbGetOrCreateFlowAudit(flowId);
      set((state) => ({
        flowAudits: state.flowAudits.map((audit) =>
          audit.flowId === flowId ? dbAudit : audit
        ),
      }));
    }
  },

  updateHeuristicViolation: async (flowId, violation) => {
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

    await get().updateFlowAudit(flowId, {
      heuristicViolations: updatedViolations,
    });
  },
}));

export default useStore;
