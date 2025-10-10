export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          client_name: string
          audit_goal: string | null
          devices: string[] | null
          hipaa_required: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_name: string
          audit_goal?: string | null
          devices?: string[] | null
          hipaa_required?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_name?: string
          audit_goal?: string | null
          devices?: string[] | null
          hipaa_required?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      flows: {
        Row: {
          id: string
          project_id: string
          name: string
          urls: string[] | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          urls?: string[] | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          urls?: string[] | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      flow_audits: {
        Row: {
          id: string
          flow_id: string
          heuristic_violations: Json | null
          platform_notes: string | null
          wcag_compliant: boolean | null
          wcag_notes: string | null
          hipaa_compliant: boolean | null
          brand_guidelines_compliant: boolean | null
          brand_guideline_non_compliance_areas: string | null
          typography_notes: string | null
          color_palette_notes: string | null
          iconography_notes: string | null
          component_usage_notes: string | null
          feedback_affordances_notes: string | null
          responsiveness_notes: string | null
          efficiency_blockers: string | null
          error_handling_notes: string | null
          recovery_paths_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flow_id: string
          heuristic_violations?: Json | null
          platform_notes?: string | null
          wcag_compliant?: boolean | null
          wcag_notes?: string | null
          hipaa_compliant?: boolean | null
          brand_guidelines_compliant?: boolean | null
          brand_guideline_non_compliance_areas?: string | null
          typography_notes?: string | null
          color_palette_notes?: string | null
          iconography_notes?: string | null
          component_usage_notes?: string | null
          feedback_affordances_notes?: string | null
          responsiveness_notes?: string | null
          efficiency_blockers?: string | null
          error_handling_notes?: string | null
          recovery_paths_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          flow_id?: string
          heuristic_violations?: Json | null
          platform_notes?: string | null
          wcag_compliant?: boolean | null
          wcag_notes?: string | null
          hipaa_compliant?: boolean | null
          brand_guidelines_compliant?: boolean | null
          brand_guideline_non_compliance_areas?: string | null
          typography_notes?: string | null
          color_palette_notes?: string | null
          iconography_notes?: string | null
          component_usage_notes?: string | null
          feedback_affordances_notes?: string | null
          responsiveness_notes?: string | null
          efficiency_blockers?: string | null
          error_handling_notes?: string | null
          recovery_paths_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
