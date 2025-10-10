import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Workflow } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import AddFlowModal from '../components/flow/AddFlowModal';
import { calculateFlowScore, getScoreColor } from '../lib/utils/scoreCalculation';

const ProjectOverviewPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const project = useStore((state) => state.projects.find((p) => p.id === projectId));
  const flows = useStore((state) => state.getFlowsByProject(projectId!));
  const flowAudits = useStore((state) => state.flowAudits);
  const loadFlows = useStore((state) => state.loadFlows);

  const [showAddFlowModal, setShowAddFlowModal] = useState(false);

  // Load flows when project loads
  useEffect(() => {
    if (projectId) {
      loadFlows(projectId);
    }
  }, [projectId, loadFlows]);

  if (!project) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-body-base text-neutral-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          <h1 className="font-heading text-4xl text-espresso-600 mb-2">
            {project.name}
          </h1>
          <p className="text-body-base text-neutral-600">
            {project.clientName}
          </p>
          {project.auditGoal && (
            <p className="text-body-sm text-neutral-500 mt-2">
              {project.auditGoal}
            </p>
          )}
        </div>

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
                        {flow.urls.length > 0 && (
                          <p className="text-body-sm text-neutral-600 mt-1">
                            {flow.urls.length} URL{flow.urls.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      {hasScore && (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-label-xs text-neutral-500 mb-1">Score</p>
                            <p className="font-heading text-2xl text-espresso-600">
                              {score.toFixed(1)}
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
