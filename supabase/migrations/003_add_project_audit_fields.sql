-- Add project-level audit fields
-- Moving Platform & Technical, Accessibility & Compliance, Brand Guidelines,
-- and Usability Risks from flow_audits to projects

ALTER TABLE projects ADD COLUMN IF NOT EXISTS platform_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS wcag_compliant BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS wcag_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hipaa_compliant BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS brand_guidelines_compliant BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS brand_guideline_non_compliance_areas TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS typography_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS color_palette_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS iconography_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS component_usage_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS feedback_affordances_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS responsiveness_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS efficiency_blockers TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS error_handling_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS recovery_paths_notes TEXT;

-- Note: We keep these fields in flow_audits as well since they exist at both levels
-- Flow-level fields are for flow-specific observations
-- Project-level fields are for overall project observations
