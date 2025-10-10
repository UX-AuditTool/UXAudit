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
        <div className="mb-16">
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

          {/* Overall Score Card */}
          {score > 0 && (
            <div className="mb-8 p-6 bg-white rounded-lg border-2 border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-base text-neutral-600 mb-2">Overall Flow Score</p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-4xl text-espresso-600">
                      {score.toFixed(1)}/5
                    </span>
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-label-base font-medium ${scoreColors.bg} ${scoreColors.text}`}
                    >
                      {scoreLabel}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-body-sm text-neutral-600 mt-4">{reasoning}</p>
            </div>
          )}

          <HeuristicCarousel
            heuristics={HEURISTICS}
            violations={audit.heuristicViolations}
            onHeuristicChange={handleHeuristicChange}
            onNotesChange={handleHeuristicNotesChange}
            onScreenshotsChange={handleHeuristicScreenshotsChange}
          />
        </section>

        {/* Section 2: Platform & Technical */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-espresso-600 mb-3">
              Platform & Technical Considerations
            </h2>
            <p className="text-body-base text-neutral-600">
              Document platform-specific observations, technical constraints, and framework
              considerations.
            </p>
          </div>

          <div className="p-8 bg-white rounded-lg border border-neutral-200">
            <Textarea
              label="Platform Notes"
              placeholder="Technical observations, framework patterns, performance considerations..."
              value={audit.platformNotes || ''}
              onChange={(e) => handleFieldChange('platformNotes', e.target.value)}
              rows={5}
              enhanceButton={
                <EnhanceButton
                  currentText={audit.platformNotes || ''}
                  context={{ type: 'general' }}
                  onEnhanced={(enhancedText) => handleFieldChange('platformNotes', enhancedText)}
                />
              }
            />
          </div>
        </section>

        {/* Section 3: Accessibility & Compliance */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-espresso-600 mb-3">
              Accessibility & Compliance
            </h2>
            <p className="text-body-base text-neutral-600">
              WCAG 2.2 AA spot-check for sighted and colorblind users, plus HIPAA safeguards if
              applicable.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-6">
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
                    checked={audit.wcagCompliant || false}
                    onChange={(e) => handleFieldChange('wcagCompliant', e.target.checked)}
                    className="w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                  />
                </label>
              </div>

              <Textarea
                label="WCAG Notes"
                placeholder="Accessibility issues found, contrast ratios, keyboard navigation, screen reader compatibility..."
                value={audit.wcagNotes || ''}
                onChange={(e) => handleFieldChange('wcagNotes', e.target.value)}
                rows={4}
                enhanceButton={
                  <EnhanceButton
                    currentText={audit.wcagNotes || ''}
                    context={{ type: 'wcag' }}
                    onEnhanced={(enhancedText) => handleFieldChange('wcagNotes', enhancedText)}
                  />
                }
              />
            </div>

            {project.hipaaRequired && (
              <div className="p-8 bg-white rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between mb-6">
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
                      checked={audit.hipaaCompliant || false}
                      onChange={(e) => handleFieldChange('hipaaCompliant', e.target.checked)}
                      className="w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Brand Guidelines */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-espresso-600 mb-3">
              Brand Guidelines
            </h2>
            <p className="text-body-base text-neutral-600">
              Evaluate compliance with design system patterns, brand guidelines, and interaction
              quality.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white rounded-lg border border-neutral-200">
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
                    checked={audit.brandGuidelinesCompliant || false}
                    onChange={(e) => handleFieldChange('brandGuidelinesCompliant', e.target.checked)}
                    className="w-6 h-6 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                  />
                </label>
              </div>

              {!audit.brandGuidelinesCompliant && (
                <div className="mb-6">
                  <Textarea
                    label="Areas of Non-Compliance"
                    placeholder="Specify which areas do not comply with brand guidelines (e.g., Typography inconsistent, Color palette not followed, Custom components used)..."
                    value={audit.brandGuidelineNonComplianceAreas || ''}
                    onChange={(e) => handleFieldChange('brandGuidelineNonComplianceAreas', e.target.value)}
                    rows={3}
                    enhanceButton={
                      <EnhanceButton
                        currentText={audit.brandGuidelineNonComplianceAreas || ''}
                        context={{ type: 'brand' }}
                        onEnhanced={(enhancedText) => handleFieldChange('brandGuidelineNonComplianceAreas', enhancedText)}
                      />
                    }
                  />
                </div>
              )}

              <div className="space-y-6">
                <Textarea
                  label="Typography Consistency"
                  placeholder="Font usage, hierarchy, readability..."
                  value={audit.typographyNotes || ''}
                  onChange={(e) => handleFieldChange('typographyNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.typographyNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('typographyNotes', enhancedText)}
                    />
                  }
                />

                <Textarea
                  label="Color Palette Usage"
                  placeholder="Brand colors, contrast, accessibility..."
                  value={audit.colorPaletteNotes || ''}
                  onChange={(e) => handleFieldChange('colorPaletteNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.colorPaletteNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('colorPaletteNotes', enhancedText)}
                    />
                  }
                />

                <Textarea
                  label="Iconography Consistency"
                  placeholder="Icon style, sizing, clarity..."
                  value={audit.iconographyNotes || ''}
                  onChange={(e) => handleFieldChange('iconographyNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.iconographyNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('iconographyNotes', enhancedText)}
                    />
                  }
                />

                <Textarea
                  label="Component Usage"
                  placeholder="Design system adherence, custom components, inconsistencies..."
                  value={audit.componentUsageNotes || ''}
                  onChange={(e) => handleFieldChange('componentUsageNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.componentUsageNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('componentUsageNotes', enhancedText)}
                    />
                  }
                />

                <Textarea
                  label="Feedback & System Status"
                  placeholder="Loading states, error prevention/recovery, user feedback mechanisms..."
                  value={audit.feedbackAffordancesNotes || ''}
                  onChange={(e) => handleFieldChange('feedbackAffordancesNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.feedbackAffordancesNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('feedbackAffordancesNotes', enhancedText)}
                    />
                  }
                />

                <Textarea
                  label="Responsiveness & Micro-interactions"
                  placeholder="Breakpoint behavior, animation quality, touch interactions..."
                  value={audit.responsivenessNotes || ''}
                  onChange={(e) => handleFieldChange('responsivenessNotes', e.target.value)}
                  rows={3}
                  enhanceButton={
                    <EnhanceButton
                      currentText={audit.responsivenessNotes || ''}
                      context={{ type: 'brand' }}
                      onEnhanced={(enhancedText) => handleFieldChange('responsivenessNotes', enhancedText)}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Usability Risks & Opportunities */}
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
