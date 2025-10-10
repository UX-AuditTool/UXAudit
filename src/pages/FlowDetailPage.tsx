import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import Textarea from '../components/ui/Textarea';
import EditableTitle from '../components/ui/EditableTitle';
import HeuristicCarousel from '../components/audit/HeuristicCarousel';
import EnhanceButton from '../components/ui/EnhanceButton';
import { HEURISTICS } from '../lib/constants/heuristics';
import { Heuristic, Severity } from '../types';
import { calculateFlowScore, getScoreLabel, getScoreColor } from '../lib/utils/scoreCalculation';

const FlowDetailPage = () => {
  const { projectId, flowId } = useParams<{ projectId: string; flowId: string }>();
  const project = useStore((state) => state.projects.find((p) => p.id === projectId));
  const flow = useStore((state) => state.flows.find((f) => f.id === flowId));
  const audit = useStore((state) => state.flowAudits.find((a) => a.flowId === flowId));
  const getOrCreateFlowAudit = useStore((state) => state.getOrCreateFlowAudit);
  const updateHeuristicViolation = useStore((state) => state.updateHeuristicViolation);
  const updateFlowAudit = useStore((state) => state.updateFlowAudit);
  const updateFlow = useStore((state) => state.updateFlow);

  // Initialize audit on mount
  useEffect(() => {
    if (flowId && !audit) {
      getOrCreateFlowAudit(flowId);
    }
  }, [flowId, audit, getOrCreateFlowAudit]);

  if (!project || !flow || !audit) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-body-base text-neutral-600">Flow not found</p>
      </div>
    );
  }

  const handleHeuristicChange = (heuristic: Heuristic, severity: Severity) => {
    if (!flowId) return;

    const violation = audit.heuristicViolations.find((v) => v.heuristic === heuristic) || {
      heuristic,
      severity: 'None' as Severity,
      notes: '',
    };

    updateHeuristicViolation(flowId, {
      ...violation,
      severity,
    });
  };

  const handleHeuristicNotesChange = (heuristic: Heuristic, notes: string) => {
    if (!flowId) return;

    const violation = audit.heuristicViolations.find((v) => v.heuristic === heuristic) || {
      heuristic,
      severity: 'None' as Severity,
      notes: '',
    };

    updateHeuristicViolation(flowId, {
      ...violation,
      notes,
    });
  };

  const handleHeuristicScreenshotsChange = (heuristic: Heuristic, screenshotIds: string[]) => {
    if (!flowId) return;

    const violation = audit.heuristicViolations.find((v) => v.heuristic === heuristic) || {
      heuristic,
      severity: 'None' as Severity,
      notes: '',
    };

    updateHeuristicViolation(flowId, {
      ...violation,
      screenshotIds,
    });
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    if (!flowId) return;
    updateFlowAudit(flowId, { [field]: value });
  };

  // Calculate score
  const { score, reasoning } = calculateFlowScore(audit);
  const scoreColors = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-body-sm text-neutral-600 mb-8">
          <Link to="/" className="hover:text-teal-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/projects/${projectId}`} className="hover:text-teal-500 transition-colors">
            {project.name}
          </Link>
          <span>/</span>
          <span className="text-espresso-600 font-medium">{flow.name}</span>
        </nav>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-page-bg mb-8 pb-8 border-b-2 border-neutral-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <EditableTitle
                  value={flow.name}
                  onSave={(newName) => updateFlow(flow.id, { name: newName })}
                  className="font-heading text-4xl text-espresso-600"
                  inputClassName="font-heading text-4xl text-espresso-600"
                />
                <span className="font-heading text-4xl text-espresso-600 self-baseline">Flow</span>
              </div>
              {flow.description && (
                <p className="text-body-base text-neutral-600 mb-3">
                  {flow.description}
                </p>
              )}
              {flow.urls.length > 0 && (
                <div className="space-y-2">
                  {flow.urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-body-sm text-teal-500 hover:underline"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {score > 0 && (
              <div className="text-right ml-8 px-6 py-4 bg-white rounded-lg border-2 border-neutral-300 shadow-sm">
                <p className="text-label-xs text-neutral-500 mb-1">Flow Score</p>
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

        {/* Section 1: Heuristic Violations */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-espresso-600 mb-3">
              Heuristic Violations
            </h2>
            <p className="text-body-base text-neutral-600">
              Evaluate this flow against Nielsen's 10 usability heuristics. Rate the severity of
              violations found for each principle.
            </p>
          </div>

          <HeuristicCarousel
            heuristics={HEURISTICS}
            violations={audit.heuristicViolations}
            onHeuristicChange={handleHeuristicChange}
            onNotesChange={handleHeuristicNotesChange}
            onScreenshotsChange={handleHeuristicScreenshotsChange}
          />
        </section>

        {/* Section 2: Usability Risks & Opportunities */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-espresso-600 mb-3">
              Usability Risks & Opportunities
            </h2>
            <p className="text-body-base text-neutral-600">
              Identify efficiency blockers, error-handling patterns, and improvement opportunities.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white rounded-lg border border-neutral-200">
              <Textarea
                label="Efficiency Blockers"
                placeholder="Redundant data entry, excessive clicks, unclear CTAs, unnecessary steps..."
                value={audit.efficiencyBlockers || ''}
                onChange={(e) => handleFieldChange('efficiencyBlockers', e.target.value)}
                rows={4}
                enhanceButton={
                  <EnhanceButton
                    currentText={audit.efficiencyBlockers || ''}
                    context={{ type: 'general' }}
                    onEnhanced={(enhancedText) => handleFieldChange('efficiencyBlockers', enhancedText)}
                  />
                }
              />
            </div>

            <div className="p-8 bg-white rounded-lg border border-neutral-200">
              <Textarea
                label="Error Handling Patterns"
                placeholder="Validation messages, error prevention, inline feedback..."
                value={audit.errorHandlingNotes || ''}
                onChange={(e) => handleFieldChange('errorHandlingNotes', e.target.value)}
                rows={4}
                enhanceButton={
                  <EnhanceButton
                    currentText={audit.errorHandlingNotes || ''}
                    context={{ type: 'general' }}
                    onEnhanced={(enhancedText) => handleFieldChange('errorHandlingNotes', enhancedText)}
                  />
                }
              />
            </div>

            <div className="p-8 bg-white rounded-lg border border-neutral-200">
              <Textarea
                label="Recovery Paths"
                placeholder="How users can recover from errors, undo functionality, escape routes..."
                value={audit.recoveryPathsNotes || ''}
                onChange={(e) => handleFieldChange('recoveryPathsNotes', e.target.value)}
                rows={4}
                enhanceButton={
                  <EnhanceButton
                    currentText={audit.recoveryPathsNotes || ''}
                    context={{ type: 'general' }}
                    onEnhanced={(enhancedText) => handleFieldChange('recoveryPathsNotes', enhancedText)}
                  />
                }
              />
            </div>
          </div>
        </section>

        {/* Auto-save indicator */}
        <div className="text-center text-body-sm text-neutral-500 pb-12">
          All changes are automatically saved
        </div>
      </div>
    </div>
  );
};

export default FlowDetailPage;
