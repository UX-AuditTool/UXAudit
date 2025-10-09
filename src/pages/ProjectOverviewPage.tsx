import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Workflow } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import AddFlowModal from '../components/flow/AddFlowModal';

const ProjectOverviewPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useStore((state) => state.projects.find((p) => p.id === projectId));
  const flows = useStore((state) => state.getFlowsByProject(projectId!));

  const [showAddFlowModal, setShowAddFlowModal] = useState(false);

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
          <a href="/" className="hover:text-teal-500 transition-colors">
            Home
          </a>
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
              {flows.map((flow) => (
                <Card
                  key={flow.id}
                  hover
                  onClick={() => {
                    window.location.href = `/projects/${projectId}/flows/${flow.id}`;
                  }}
                >
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {flow.platform === 'Web' ? '🌐' : flow.platform === 'iOS' ? '📱' : '🤖'}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-espresso-600">
                          {flow.name}
                        </h3>
                        <p className="text-body-sm text-neutral-600">
                          {flow.platform} · {flow.device}
                        </p>
                      </div>
                    </div>
                    <div className="text-body-sm text-neutral-500">
                      {flow.urls.length > 0 && `${flow.urls.length} URL${flow.urls.length > 1 ? 's' : ''}`}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
