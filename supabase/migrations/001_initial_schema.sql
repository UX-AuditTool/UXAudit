-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  audit_goal TEXT,
  devices TEXT[] DEFAULT '{}',
  hipaa_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flows table
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  urls TEXT[] DEFAULT '{}',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flow_audits table
CREATE TABLE flow_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE UNIQUE,
  heuristic_violations JSONB DEFAULT '[]'::jsonb,
  platform_notes TEXT,
  wcag_compliant BOOLEAN DEFAULT false,
  wcag_notes TEXT,
  hipaa_compliant BOOLEAN DEFAULT false,
  brand_guidelines_compliant BOOLEAN DEFAULT false,
  brand_guideline_non_compliance_areas TEXT,
  typography_notes TEXT,
  color_palette_notes TEXT,
  iconography_notes TEXT,
  component_usage_notes TEXT,
  feedback_affordances_notes TEXT,
  responsiveness_notes TEXT,
  efficiency_blockers TEXT,
  error_handling_notes TEXT,
  recovery_paths_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_flows_project_id ON flows(project_id);
CREATE INDEX idx_flow_audits_flow_id ON flow_audits(flow_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flow_audits_updated_at BEFORE UPDATE ON flow_audits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_audits ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you can add auth later)
CREATE POLICY "Enable all operations for projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for flows" ON flows
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for flow_audits" ON flow_audits
  FOR ALL USING (true) WITH CHECK (true);
