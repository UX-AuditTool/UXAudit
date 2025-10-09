import { create } from 'zustand';
import { Project, Flow, Step } from '../types';

interface AppState {
  // Data
  projects: Project[];
  flows: Flow[];
  steps: Step[];
  currentProjectId: string | null;

  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  setCurrentProject: (projectId: string) => void;

  // Actions - Flows
  addFlow: (flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Flow;
  getFlowsByProject: (projectId: string) => Flow[];

  // Actions - Steps
  addStep: (step: Omit<Step, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Step;
  getStepsByFlow: (flowId: string) => Step[];
  updateStep: (stepId: string, updates: Partial<Step>) => void;
  deleteStep: (stepId: string) => void;
}

const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  flows: [],
  steps: [],
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

  // Step actions
  addStep: (stepData) => {
    const steps = get().steps.filter((s) => s.flowId === stepData.flowId);
    const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) : -1;

    const newStep: Step = {
      ...stepData,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      steps: [...state.steps, newStep],
    }));

    return newStep;
  },

  getStepsByFlow: (flowId) => {
    return get()
      .steps.filter((s) => s.flowId === flowId)
      .sort((a, b) => a.order - b.order);
  },

  updateStep: (stepId, updates) => {
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates, updatedAt: new Date() } : step
      ),
    }));
  },

  deleteStep: (stepId) => {
    set((state) => ({
      steps: state.steps.filter((step) => step.id !== stepId),
    }));
  },
}));

export default useStore;
