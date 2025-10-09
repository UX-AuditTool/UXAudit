UX Audit MVP PRD

TL;DR

A lightweight UX audit tool for solo auditors to capture global notes, evaluate flows with standardized scores, annotate screenshots, and deliver a client-friendly dashboard and export. It streamlines manual audits with clear structure, rapid capture, and shareable outputs. Target users are independent UX auditors and small agencies who need to deliver consistent, actionable audits fast.



Goals

Business Goals





Launch a functional MVP used by at least 5 pilot clients within 30 days.



Reduce average audit turnaround time by 30% compared to current manual processes.



Achieve a 50% conversion rate from trial to paid within the first 60 days.



Maintain <10% support requests per project over the first 20 projects.

User Goals





Make it easy to set up an audit and capture findings without tool overhead.



Standardize flow ratings for comparable, defensible scoring across projects.



Quickly annotate screenshots to show issues and recommendations clearly.



Share an interactive dashboard that clients can understand without guidance.



Export a professional, client-ready report with minimal formatting work.

Non-Goals





Real-time multi-user collaboration (beyond read-only client viewing) in MVP.



Automated crawling or deep analytics of user behavior.



Full project management (e.g., sprint planning, task assignment) beyond recommendation statuses.



User Stories





Solo Auditor





As a Solo Auditor, I want to create a project and define audit scope, so that I can start capturing findings immediately.



As a Solo Auditor, I want to add flows and steps, so that I can structure findings by user journeys.



As a Solo Auditor, I want to rate flows using a consistent rubric, so that I can compare and defend my assessments.



As a Solo Auditor, I want to upload screenshots and annotate issues, so that clients understand exactly what to fix.



As a Solo Auditor, I want to generate prioritized recommendations, so that clients know what to do next.



As a Solo Auditor, I want to share a read-only dashboard, so that stakeholders can review findings without manual presentations.



As a Solo Auditor, I want to export a PDF/CSV report, so that I can deliver artifacts for legal/procurement or offline review.



Client Reviewer





As a Client Reviewer, I want to open a secure shared link, so that I can view findings without creating an account.



As a Client Reviewer, I want to filter by severity, flow, and status, so that I can focus on what matters to my team.



As a Client Reviewer, I want to see annotated screenshots, so that I understand context and needed changes quickly.



As a Client Reviewer, I want to download the report, so that I can circulate internally.



Stakeholder (Optional)





As a Stakeholder, I want a high-level dashboard with scores and top recommendations, so that I can align teams on priorities.



As a Stakeholder, I want a summary of potential business impact, so that I can justify resourcing decisions.



Functional Requirements





Project Setup (Priority: P0)





Create Project: Capture project name, client name, audit goal, and due date.



Scope Definition: Define flows to be audited (name, URL(s), device/platform).



Heuristic Rubric Setup: Select default rubric (provided) or adjust weights per heuristic.



Access Control: Generate read-only share links with token; optional project password.



Import Flows (Stretch, P2): CSV import for flows/steps.



Global & Flow Feedback (Priority: P0)





Global Notes: Add cross-cutting observations and constraints (e.g., tech limitations).



Heuristic Tags: Apply heuristic categories to global notes and flow issues.



Flow Structure: Create flows with ordered steps; add per-step notes and issues.



Issue Management: Log issues with title, description, severity, heuristic, affected step(s), evidence (screenshots), and recommendation link.



Ratings (Priority: P0)





Flow Rating: 1–5 scale across heuristics; weighted overall flow score.



Project Score: Weighted aggregation across flows; show distribution and variance.



Scoring Guide: Inline definitions for each rating level to ensure consistency.



Screenshot Upload & Annotation (Priority: P0)





Upload: Drag-and-drop and file picker for images (JPG, PNG, up to 10 MB).



Annotation Tools: Highlight, rectangle, arrows, text callouts; color and thickness options.



Redaction: Blur tool for PII elements.



Versioning: Track updates to annotated images (v1, v2, etc.).



Browser Capture Extension (Stretch, P2): Capture full-page or viewport screenshots with auto-URL capture.



Recommendations & Prioritization (Priority: P0)





Recommendation Cards: Title, description, linked issues, expected impact, effort estimate.



Priority Matrix: Auto-calculate Priority (High/Med/Low) from Impact x Effort.



Status: Proposed, Accepted, In Progress, Done; optional target owner.



Templates (Stretch, P2): Reusable recommendation snippets by heuristic.



Client Dashboard & Review (Priority: P0)





Overview: Project score, top 5 issues, top 5 recommendations, flow scorecards.



Filtering: By flow, severity, heuristic, status.



Evidence Gallery: Annotated screenshots grouped by issue.



Comments (Stretch, P2): Client can leave comments on issues/recommendations.



Branding (Stretch, P2): Add client logo and color accent.



Export (Priority: P1)





PDF Export: Executive summary page + flows + issues + recommendations + screenshots.



CSV Export: Issues and recommendations with fields for import to PM tools.



PowerPoint/Slides Export (Stretch, P2): Lightly formatted deck with key visuals.



Share Settings: Choose what to include in exports (e.g., hide low severity).

Sample Scales and Labels:





Rating Scale





1: Critical usability failure



2: Major problem, frequent errors or confusion



3: Noticeable friction, learnable with effort



4: Minor issue, acceptable but improvable



5: Meets best practice; no notable issues



Severity vs. Impact vs. Effort





Severity: How badly the issue harms user tasks.



Impact: Potential business effect if resolved.



Effort: Estimated implementation complexity.



User Experience





Entry Point & First-Time User Experience





Landing: Simple value proposition with sample dashboard preview and Start Free button.



Onboarding: Minimal sign-up (email + password) and create first project in a single flow.



Guided Setup: Inline tooltips to add first flow and a sample heuristic rubric preloaded.



Empty States: Clear prompts for adding flows, issues, and screenshots; 1-click “Add first flow.”



Core Experience





Step 1: Create Project





UI: Single-pane form; defaults pre-filled where possible.



Validation: Required fields—project name, client name.



Success: Project dashboard opens with Scope and Flows panels.



Step 2: Add Flows and Steps





UI: “Add Flow” modal: name, platform/device, URL(s).



Steps: Inline list for step title and optional URL; reorder via drag-and-drop.



Success: Flow card displays initial score as “Not Rated.”



Step 3: Capture Issues





UI: Within a flow, “Add Issue” opens a right-side panel to input fields.



Validation: Title and severity required; heuristic dropdown suggested.



Attach: Upload/annotate screenshots; link to step(s).



Success: Issue card appears under relevant step with evidence badge.



Step 4: Rate Flow





UI: Heuristic ratings grid (1–5) with tooltips; optional notes per heuristic.



Logic: Weighted score auto-calculated; overall flow score updates.



Success: Flow scorecard shows color-coded badge (e.g., Red <2.5, Amber 2.5–3.5, Green >3.5).



Step 5: Create Recommendations





UI: “New Recommendation” with linked issues; select Impact/Effort; auto-priority.



Batch: Bulk-create “Quick Wins” from selected low-effort, high-impact issues.



Success: Recommendations list and Priority Matrix update on Overview.



Step 6: Global Notes





UI: Global notes field with tags; pin important notes to dashboard.



Success: Global notes appear in Executive Summary section.



Step 7: Review Dashboard





UI: Client dashboard preview with filters; evidence gallery.



QA: Check for missing screenshots/ratings; completeness indicator shows % flows rated.



Step 8: Share and Export





Share: Generate tokenized link; optional password; expiration date.



Export: PDF (sections selectable) and CSV (issues/recommendations).



Post: Activity log records share and export actions.



Advanced Features & Edge Cases





Large Images: Auto-resize to target resolution; warn if >10 MB; maintain original for download.



Private Info: Blur/redact tool required before sharing; warning for unredacted PII keywords in annotations.



Versioning: If flow steps change, preserve historical ratings and mark “v2” of flow.



Offline Work (Limited): Local draft state for unsaved annotations; sync when online.



Access Revocation: Immediately invalidate share tokens; dashboard shows “Access revoked.”



Duplicate Issues: Detect similar titles/descriptions within a flow; prompt to merge.



Export Failures: Retry with simplified images; show fallback “download raw CSV.”



UI/UX Highlights





Accessibility: WCAG AA contrast, keyboard navigation for all forms and annotation controls.



Responsiveness: Optimized for desktop first; readable on tablet; mobile read-only dashboard adequate.



Clarity: Plain-language labels; inline scoring definitions; empty-state guidance.



Speed: Optimistic UI for uploads and annotation; background processing for exports.



Consistency: Uniform card layouts for issues and recommendations; standardized color scales.



Safety: Undo for destructive actions; autosave drafts; clear confirmation on share settings.



Narrative

Mia, a solo UX auditor, is hired to evaluate a B2C checkout experience in two weeks. In the past, she bounced between screenshots, spreadsheets, and slide decks, often duplicating effort to keep everything aligned. With the UX Audit MVP, she signs in, creates a project, and adds three flows: Homepage to Product, Cart to Checkout, and Account Creation.

Working through each flow, Mia records issues step-by-step. She uploads screenshots and uses callouts to highlight unlabeled buttons and ambiguous error messaging. The tool’s rating grid keeps her assessment consistent, and each flow’s score updates automatically. As patterns emerge, she writes global notes about confusing terminology and inconsistent payment CTAs.

For each issue, Mia adds a practical recommendation and marks expected impact and effort. The Priority Matrix surfaces quick wins, like clarifying field labels and standardizing button text. An optional AI assist suggests phrasing for her recommendations and flags missing heuristic tags, shaving time off her write-up.

When she’s ready, Mia previews the client dashboard. The overview clearly shows flow scores, top issues, and annotated evidence. She generates a secure share link and sends it to the stakeholder group. In their review, the team filters by “High Impact, Low Effort” and immediately commits to the top five fixes. Mia exports a PDF for their internal archive. The client appreciates the clarity and speed; Mia finishes the audit ahead of schedule and wins a follow-on engagement to validate improvements post-implementation.