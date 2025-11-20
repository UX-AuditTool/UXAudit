import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Workflow, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Textarea from '../components/ui/Textarea';
import AddFlowModal from '../components/flow/AddFlowModal';
import EditableTitle from '../components/ui/EditableTitle';
import EnhanceButton from '../components/ui/EnhanceButton';
import { calculateFlowScore, calculateProjectScore, getScoreColor, getScoreLabel } from '../lib/utils/scoreCalculation';
import { generateProjectSummary, isAIConfigured, ProjectSummaryData } from '../lib/ai';

const ProjectOverviewPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const project = useStore((state) => state.projects.find((p) => p.id === projectId));
  const flows = useStore((state) => state.getFlowsByProject(projectId!));
  const flowAudits = useStore((state) => state.flowAudits);
  const loadFlows = useStore((state) => state.loadFlows);
  const updateProject = useStore((state) => state.updateProject);

  const [showAddFlowModal, setShowAddFlowModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Local state for text fields to enable responsive typing
  const [localFields, setLocalFields] = useState<Record<string, string>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Load flows when project loads
  useEffect(() => {
    if (projectId) {
      loadFlows(projectId);
    }
  }, [projectId, loadFlows]);

  // Sync local fields when project changes
  useEffect(() => {
    if (project) {
      setLocalFields({});
    }
  }, [project?.id]);

  // Debounced field change handler for text inputs
  const handleFieldChange = useCallback((field: string, value: string | boolean) => {
    if (!project) return;

    // For boolean values, update immediately
    if (typeof value === 'boolean') {
      updateProject(project.id, { [field]: value });
      return;
    }

    // For text values, update local state immediately for responsive typing
    setLocalFields(prev => ({ ...prev, [field]: value }));

    // Clear existing timer for this field
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }

    // Debounce the API call (500ms after user stops typing)
    debounceTimers.current[field] = setTimeout(() => {
      updateProject(project.id, { [field]: value });
    }, 500);
  }, [project, updateProject]);

  // Helper to get field value (local state takes precedence for responsive typing)
  const getFieldValue = (field: string): string => {
    if (field in localFields) {
      return localFields[field];
    }
    return (project?.[field as keyof typeof project] as string) || '';
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleGenerateSummary = async () => {
    if (!project) return;

    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      // Get all flow audits for this project
      const projectFlowAudits = flowAudits.filter((audit) =>
        flows.some((flow) => flow.id === audit.flowId)
      );

      // Build summary data
      const flowSummaries = flows
        .map((flow) => {
          const audit = projectFlowAudits.find((a) => a.flowId === flow.id);
          if (!audit) return null;

          const { score } = calculateFlowScore(audit);
          if (score === 0) return null;

          // Collect all notes from the audit
          const notes: string[] = [];
          audit.heuristicViolations?.forEach((v) => {
            if (v.notes) notes.push(`${v.heuristic}: ${v.notes}`);
          });
          if (audit.platformNotes) notes.push(audit.platformNotes);
          if (audit.wcagNotes) notes.push(audit.wcagNotes);
          if (audit.efficiencyBlockers) notes.push(audit.efficiencyBlockers);
          if (audit.errorHandlingNotes) notes.push(audit.errorHandlingNotes);

          return {
            flowName: flow.name,
            score,
            notes,
          };
        })
        .filter((f): f is NonNullable<typeof f> => f !== null);

      if (flowSummaries.length === 0) {
        setSummaryError('No audit data available to summarize.');
        return;
      }

      const { score: averageScore } = calculateProjectScore(projectFlowAudits);

      const summaryData: ProjectSummaryData = {
        projectName: project.name,
        flowCount: flowSummaries.length,
        averageScore,
        flowSummaries,
      };

      const summary = await generateProjectSummary(summaryData);
      setAiSummary(summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-body-base text-neutral-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-body-sm text-neutral-600 mb-6">
          <Link to="/" className="hover:text-teal-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-espresso-600 font-medium">{project.name}</span>
        </nav>

        {/* Header */}
        {(() => {
          const projectFlowAudits = flowAudits.filter((audit) =>
            flows.some((flow) => flow.id === audit.flowId)
          );
          const { score, flowCount } = calculateProjectScore(projectFlowAudits);
          const scoreColors = getScoreColor(score);
          const scoreLabel = getScoreLabel(score);

          return (
            <div className="sticky top-0 z-10 bg-page-bg mb-8 pb-8 border-b-2 border-neutral-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <EditableTitle
                    value={project.name}
                    onSave={(newName) => updateProject(project.id, { name: newName })}
                    className="font-heading text-4xl text-espresso-600 mb-2"
                    inputClassName="font-heading text-4xl text-espresso-600"
                  />
                  <p className="text-body-base text-neutral-600">
                    {project.clientName}
                  </p>
                  {project.auditGoal && (
                    <p className="text-body-sm text-neutral-500 mt-2">
                      {project.auditGoal}
                    </p>
                  )}
                </div>

                {flowCount > 0 && (
                  <div className="text-right ml-8 px-6 py-4 bg-white rounded-lg border-2 border-neutral-300 shadow-sm">
                    <p className="text-label-xs text-neutral-500 mb-1">Project Score</p>
                    <p className="font-heading text-5xl text-espresso-600 mb-2">
                      {score.toFixed(1)}<span className="text-2xl text-neutral-400">/5</span>
                    </p>
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-label-base font-medium ${scoreColors.bg} ${scoreColors.text}`}
                    >
                      {scoreLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Executive Summary */}
        {(() => {
          const projectFlowAudits = flowAudits.filter((audit) =>
            flows.some((flow) => flow.id === audit.flowId)
          );
          const { flowCount } = calculateProjectScore(projectFlowAudits);

          if (flowCount > 0 && isAIConfigured()) {
            return (
              <div className="mb-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading text-xl text-espresso-600 mb-1">
                          Executive Summary
                        </h3>
                        <p className="text-body-sm text-neutral-600">
                          Overview of all audit findings
                        </p>
                      </div>
                      <Button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        leftIcon={<Sparkles className="h-4 w-4" />}
                        size="sm"
                        variant="secondary"
                      >
                        {isGeneratingSummary ? 'Generating...' : aiSummary ? 'Regenerate with AI' : 'Generate with AI'}
                      </Button>
                    </div>

                    {summaryError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-base text-body-sm text-error">
                        {summaryError}
                      </div>
                    )}

                    {aiSummary && !summaryError && (
                      <textarea
                        value={aiSummary}
                        onChange={(e) => setAiSummary(e.target.value)}
                        className="w-full min-h-[300px] px-4 py-3 rounded-base border-[1.5px] border-neutral-300 font-body text-body-sm text-neutral-700 placeholder:text-neutral-400 resize-y focus:outline-none focus:border-2 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(81,108,97,0.12)] transition-all duration-fast"
                        placeholder="Edit your executive summary here..."
                      />
                    )}

                    {!aiSummary && !summaryError && !isGeneratingSummary && (
                      <div className="text-center py-8 text-body-sm text-neutral-500">
                        Click "Generate with AI" to create an executive summary of all audit findings.
                      </div>
                    )}

                    {isGeneratingSummary && (
                      <div className="text-center py-8 text-body-sm text-neutral-500">
                        <Sparkles className="h-6 w-6 mx-auto mb-2 animate-pulse text-sage-600" />
                        Analyzing audit findings and generating summary...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          }
          return null;
        })()}

        {/* 2-Column Layout: Form (2/3) + Flows (1/3) */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column: Audit Form (2/3 width) */}
          <div className="col-span-2 space-y-8">
            {/* Section 1: Platform & Technical */}
            <section>
              <div className="mb-4">
                <h2 className="font-heading text-2xl text-espresso-600">
                  Platform & Technical Considerations
                </h2>
              </div>

              <div className="p-6 bg-white rounded-lg border border-neutral-300">
                <Textarea
                  label="Platform Notes"
                  placeholder="Technical observations, framework patterns, performance considerations..."
                  value={getFieldValue('platformNotes')}
                  onChange={(e) => handleFieldChange('platformNotes', e.target.value)}
                  rows={5}
                  enhanceButton={
                    <EnhanceButton
                      currentText={project.platformNotes || ''}
                      context={{ type: 'general' }}
                      onEnhanced={(enhancedText) => handleFieldChange('platformNotes', enhancedText)}
                    />
                  }
                />
              </div>
            </section>

            {/* Section 2: Accessibility & Compliance */}
            <section>
              <div className="mb-4">
                <h2 className="font-heading text-2xl text-espresso-600">
                  Accessibility & Compliance
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white rounded-lg border border-neutral-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-lg text-espresso-600 mb-1">
                        WCAG 2.2 AA Compliance
                      </h3>
                      <p className="text-body-sm text-neutral-600">
                        Focus on visual and colorblind accessibility
                      </p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-label-base text-neutral-700">Compliant</span>
                      <input
                        type="checkbox"
                        checked={project.wcagCompliant || false}
                        onChange={(e) => handleFieldChange('wcagCompliant', e.target.checked)}
                        className="form-checkbox w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                      />
                    </label>
                  </div>

                  <Textarea
                    label="WCAG Notes"
                    placeholder="Accessibility issues found, contrast ratios, keyboard navigation, screen reader compatibility..."
                    value={getFieldValue('wcagNotes')}
                    onChange={(e) => handleFieldChange('wcagNotes', e.target.value)}
                    rows={4}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.wcagNotes || ''}
                        context={{ type: 'wcag' }}
                        onEnhanced={(enhancedText) => handleFieldChange('wcagNotes', enhancedText)}
                      />
                    }
                  />
                </div>

                {project.hipaaRequired && (
                  <div className="p-6 bg-white rounded-lg border border-neutral-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-lg text-espresso-600 mb-1">
                          HIPAA UX Safeguards
                        </h3>
                        <p className="text-body-sm text-neutral-600">
                          Protected health information (PHI) is present in this project
                        </p>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-label-base text-neutral-700">HIPAA Compliant</span>
                        <input
                          type="checkbox"
                          checked={project.hipaaCompliant || false}
                          onChange={(e) => handleFieldChange('hipaaCompliant', e.target.checked)}
                          className="form-checkbox w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Brand Guidelines */}
            <section>
              <div className="mb-4">
                <h2 className="font-heading text-2xl text-espresso-600">
                  Brand Guidelines
                </h2>
              </div>

              <div className="p-6 bg-white rounded-lg border border-neutral-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-lg text-espresso-600 mb-1">
                      Brand Guidelines Compliance
                    </h3>
                    <p className="text-body-sm text-neutral-600">
                      Visual design aligns with established brand standards
                    </p>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-label-base text-neutral-700">Compliant</span>
                    <input
                      type="checkbox"
                      checked={project.brandGuidelinesCompliant || false}
                      onChange={(e) => handleFieldChange('brandGuidelinesCompliant', e.target.checked)}
                      className="form-checkbox w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                    />
                  </label>
                </div>

                {!project.brandGuidelinesCompliant && (
                  <div className="mb-6">
                    <Textarea
                      label="Areas of Non-Compliance"
                      placeholder="Specify which areas do not comply with brand guidelines (e.g., Typography inconsistent, Color palette not followed, Custom components used)..."
                      value={getFieldValue('brandGuidelineNonComplianceAreas')}
                      onChange={(e) => handleFieldChange('brandGuidelineNonComplianceAreas', e.target.value)}
                      rows={3}
                      enhanceButton={
                        <EnhanceButton
                          currentText={project.brandGuidelineNonComplianceAreas || ''}
                          context={{ type: 'brand' }}
                          onEnhanced={(enhancedText) => handleFieldChange('brandGuidelineNonComplianceAreas', enhancedText)}
                        />
                      }
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <Textarea
                    label="Typography Consistency"
                    placeholder="Font usage, hierarchy, readability..."
                    value={getFieldValue('typographyNotes')}
                    onChange={(e) => handleFieldChange('typographyNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.typographyNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('typographyNotes', enhancedText)}
                      />
                    }
                  />

                  <Textarea
                    label="Color Palette Usage"
                    placeholder="Brand colors, contrast, accessibility..."
                    value={getFieldValue('colorPaletteNotes')}
                    onChange={(e) => handleFieldChange('colorPaletteNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.colorPaletteNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('colorPaletteNotes', enhancedText)}
                      />
                    }
                  />

                  <Textarea
                    label="Iconography Consistency"
                    placeholder="Icon style, sizing, clarity..."
                    value={getFieldValue('iconographyNotes')}
                    onChange={(e) => handleFieldChange('iconographyNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.iconographyNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('iconographyNotes', enhancedText)}
                      />
                    }
                  />

                  <Textarea
                    label="Component Usage"
                    placeholder="Design system adherence, custom components, inconsistencies..."
                    value={getFieldValue('componentUsageNotes')}
                    onChange={(e) => handleFieldChange('componentUsageNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.componentUsageNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('componentUsageNotes', enhancedText)}
                      />
                    }
                  />

                  <Textarea
                    label="Feedback & System Status"
                    placeholder="Loading states, error prevention/recovery, user feedback mechanisms..."
                    value={getFieldValue('feedbackAffordancesNotes')}
                    onChange={(e) => handleFieldChange('feedbackAffordancesNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.feedbackAffordancesNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('feedbackAffordancesNotes', enhancedText)}
                      />
                    }
                  />

                  <Textarea
                    label="Responsiveness & Micro-interactions"
                    placeholder="Breakpoint behavior, animation quality, touch interactions..."
                    value={getFieldValue('responsivenessNotes')}
                    onChange={(e) => handleFieldChange('responsivenessNotes', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.responsivenessNotes || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('responsivenessNotes', enhancedText)}
                      />
                    }
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Usability Risks & Opportunities */}
            <section>
              <div className="mb-4">
                <h2 className="font-heading text-2xl text-espresso-600">
                  Usability Risks & Opportunities
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white rounded-lg border border-neutral-300">
                  <Textarea
                    label="Efficiency Blockers"
                    placeholder="Redundant data entry, excessive clicks, unclear CTAs, unnecessary steps..."
                    value={getFieldValue('efficiencyBlockers')}
                    onChange={(e) => handleFieldChange('efficiencyBlockers', e.target.value)}
                    rows={4}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.efficiencyBlockers || ''}
                        context={{ type: 'general' }}
                        onEnhanced={(enhancedText) => handleFieldChange('efficiencyBlockers', enhancedText)}
                      />
                    }
                  />
                </div>

                <div className="p-6 bg-white rounded-lg border border-neutral-300">
                  <Textarea
                    label="Error Handling Patterns"
                    placeholder="Validation messages, error prevention, inline feedback..."
                    value={getFieldValue('errorHandlingNotes')}
                    onChange={(e) => handleFieldChange('errorHandlingNotes', e.target.value)}
                    rows={4}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.errorHandlingNotes || ''}
                        context={{ type: 'general' }}
                        onEnhanced={(enhancedText) => handleFieldChange('errorHandlingNotes', enhancedText)}
                      />
                    }
                  />
                </div>

                <div className="p-6 bg-white rounded-lg border border-neutral-300">
                  <Textarea
                    label="Recovery Paths"
                    placeholder="How users can recover from errors, undo functionality, escape routes..."
                    value={getFieldValue('recoveryPathsNotes')}
                    onChange={(e) => handleFieldChange('recoveryPathsNotes', e.target.value)}
                    rows={4}
                    enhanceButton={
                      <EnhanceButton
                        currentText={project.recoveryPathsNotes || ''}
                        context={{ type: 'general' }}
                        onEnhanced={(enhancedText) => handleFieldChange('recoveryPathsNotes', enhancedText)}
                      />
                    }
                  />
                </div>
              </div>
            </section>

            {/* Auto-save indicator */}
            <div className="text-center text-body-sm text-neutral-500 pb-8">
              All changes are automatically saved
            </div>
          </div>

          {/* Right Column: Flows List (1/3 width) */}
          <div className="col-span-1">
            <div className="sticky top-8">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-espresso-600">Flows</h2>
                  <Button
                    onClick={() => setShowAddFlowModal(true)}
                    leftIcon={<Plus className="h-4 w-4" />}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Outer container for flows */}
              <div className="p-4 bg-white rounded-lg border border-neutral-300">
                {flows.length === 0 ? (
                  <EmptyState
                    icon={<Workflow className="h-12 w-12" />}
                    title="No flows yet"
                    description="Add your first flow to start structuring your audit."
                    action={
                      <Button
                        onClick={() => setShowAddFlowModal(true)}
                        leftIcon={<Plus className="h-5 w-5" />}
                        size="sm"
                      >
                        Add First Flow
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {flows.map((flow) => {
                      const audit = flowAudits.find((a) => a.flowId === flow.id);
                      const { score } = audit ? calculateFlowScore(audit) : { score: 0 };
                      const scoreColors = getScoreColor(score);
                      const hasScore = score > 0;

                      return (
                        <Card
                          key={flow.id}
                          hover
                          onClick={() => navigate(`/projects/${projectId}/flows/${flow.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-heading text-base text-espresso-600 flex-1">
                                {flow.name}
                              </h3>
                              {hasScore && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-label-xs font-medium ${scoreColors.bg} ${scoreColors.text} whitespace-nowrap`}>
                                  {score.toFixed(1)}
                                </span>
                              )}
                            </div>
                            {flow.description && (
                              <p className="text-body-xs text-neutral-600">
                                {flow.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Flow Modal */}
      {projectId && (
        <AddFlowModal
          open={showAddFlowModal}
          onOpenChange={setShowAddFlowModal}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProjectOverviewPage;
