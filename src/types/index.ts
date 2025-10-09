export interface Project {
  id: string;
  name: string;
  clientName: string;
  auditGoal?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flow {
  id: string;
  projectId: string;
  name: string;
  platform: 'Web' | 'iOS' | 'Android';
  device: 'Desktop' | 'Mobile' | 'Tablet';
  urls: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Step {
  id: string;
  flowId: string;
  title: string;
  url?: string;
  notes?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Platform = 'Web' | 'iOS' | 'Android';
export type Device = 'Desktop' | 'Mobile' | 'Tablet';
