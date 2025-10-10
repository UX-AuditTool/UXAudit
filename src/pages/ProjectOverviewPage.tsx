import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Workflow, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import AddFlowModal from '../components/flow/AddFlowModal';
import EditableTitle from '../components/ui/EditableTitle';
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
  const updateFlow = useStore((state) => state.updateFlow);

  const [showAddFlowModal, setShowAddFlowModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Load flows when project loads
  useEffect(() => {
    if (projectId) {
      loadFlows(projectId);
    }
  }, [projectId, loadFlows]);

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
        <div className="mb-8">
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

        {/* Project Scorecard */}
        {(() => {
          const projectFlowAudits = flowAudits.filter((audit) =>
            flows.some((flow) => flow.id === audit.flowId)
          );
          const { score, reasoning, flowCount } = calculateProjectScore(projectFlowAudits);
          const scoreColors = getScoreColor(score);
          const scoreLabel = getScoreLabel(score);

          if (flowCount > 0) {
            return (
              <div className="mb-8 space-y-4">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="font-heading text-2xl text-espresso-600 mb-2">
                          Project Score
                        </h2>
                        <p className="text-body-sm text-neutral-600">{reasoning}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-heading text-5xl text-espresso-600">
                            {score.toFixed(1)}<span className="text-2xl text-neutral-400">/5</span>
                          </p>
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-label-base font-medium mt-2 ${scoreColors.bg} ${scoreColors.text}`}
                          >
                            {scoreLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Summary Section */}
                {isAIConfigured() && (
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
                          className="w-full min-h-[300px] px-4 py-3 rounded-base border-[1.5px] border-neutral-200 font-body text-body-sm text-neutral-700 placeholder:text-neutral-400 resize-y focus:outline-none focus:border-2 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(81,108,97,0.12)] transition-all duration-fast"
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
                )}
              </div>
            );
          }
          return null;
        })()}

        {/* Flows Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl text-espresso-600">Flows</h2>
            <Button
              onClick={() => setShowAddFlowModal(true)}
              leftIcon={<Plus className="h-5 w-5" />}
              size="sm"
            >
              Add Flow
            </Button>
          </div>

          {flows.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Workflow className="h-16 w-16" />}
                title="No flows yet"
                description="Add your first flow to start structuring your audit by user journeys."
                action={
                  <Button
                    onClick={() => setShowAddFlowModal(true)}
                    leftIcon={<Plus className="h-5 w-5" />}
                  >
                    Add First Flow
                  </Button>
                }
              />
            </Card>
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
                    <CardContent className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading text-lg text-espresso-600">
                          {flow.name}
                        </h3>
                        {flow.description && (
                          <p className="text-body-sm text-neutral-600 mt-1">
                            {flow.description}
                          </p>
                        )}
                        {flow.urls.length > 0 && (
                          <p className="text-body-xs text-neutral-500 mt-1">
                            {flow.urls.length} URL{flow.urls.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      {hasScore && (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-label-xs text-neutral-500 mb-1">Score</p>
                            <p className="font-heading text-2xl text-espresso-600">
                              {score.toFixed(1)}/5
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${scoreColors.bg}`} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
