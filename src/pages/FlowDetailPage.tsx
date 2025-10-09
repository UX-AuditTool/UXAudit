import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ListOrdered, Trash2, GripVertical } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import AddStepForm from '../components/step/AddStepForm';

const FlowDetailPage = () => {
  const { projectId, flowId } = useParams<{ projectId: string; flowId: string }>();
  const project = useStore((state) => state.projects.find((p) => p.id === projectId));
  const flow = useStore((state) => state.flows.find((f) => f.id === flowId));
  const steps = useStore((state) => state.getStepsByFlow(flowId!));
  const deleteStep = useStore((state) => state.deleteStep);

  const [showAddStepForm, setShowAddStepForm] = useState(false);

  if (!project || !flow) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-body-base text-neutral-600">Flow not found</p>
      </div>
    );
  }

  const handleDeleteStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this step?')) {
      deleteStep(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-body-sm text-neutral-600 mb-6">
          <a href="/" className="hover:text-teal-500 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href={`/projects/${projectId}`}
            className="hover:text-teal-500 transition-colors"
          >
            {project.name}
          </a>
          <span>/</span>
          <span className="text-espresso-600 font-medium">{flow.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-3">
            <div className="text-4xl">
              {flow.platform === 'Web' ? '🌐' : flow.platform === 'iOS' ? '📱' : '🤖'}
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-4xl text-espresso-600 mb-2">
                {flow.name}
              </h1>
              <p className="text-body-base text-neutral-600">
                {flow.platform} · {flow.device}
              </p>
              {flow.urls.length > 0 && (
                <div className="mt-2 space-y-1">
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
          </div>
        </div>

        {/* Steps Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl text-espresso-600">Steps</h2>
            {steps.length > 0 && !showAddStepForm && (
              <Button
                onClick={() => setShowAddStepForm(true)}
                leftIcon={<Plus className="h-5 w-5" />}
                size="sm"
              >
                Add Step
              </Button>
            )}
          </div>

          {steps.length === 0 && !showAddStepForm ? (
            <Card>
              <EmptyState
                icon={<ListOrdered className="h-16 w-16" />}
                title="No steps yet"
                description="Add steps to structure this flow. Each step represents a screen or action in the user journey."
                action={
                  <Button
                    onClick={() => setShowAddStepForm(true)}
                    leftIcon={<Plus className="h-5 w-5" />}
                  >
                    Add First Step
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Step List */}
              {steps.map((step, index) => (
                <Card key={step.id} hover={false}>
                  <CardContent className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <GripVertical className="h-5 w-5 text-neutral-400 cursor-grab" />
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 font-heading font-semibold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg text-espresso-600 mb-1">
                        {step.title}
                      </h3>
                      {step.url && (
                        <a
                          href={step.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-sm text-teal-500 hover:underline break-all"
                        >
                          {step.url}
                        </a>
                      )}
                      {step.notes && (
                        <p className="text-body-sm text-neutral-600 mt-2">
                          {step.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="flex-shrink-0 p-2 text-neutral-500 hover:text-error hover:bg-error/10 rounded-base transition-colors"
                      aria-label="Delete step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}

              {/* Add Step Form */}
              {showAddStepForm && flowId && (
                <AddStepForm
                  flowId={flowId}
                  onSuccess={() => setShowAddStepForm(false)}
                  onCancel={() => setShowAddStepForm(false)}
                />
              )}

              {/* Add Another Button */}
              {!showAddStepForm && steps.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowAddStepForm(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="w-full"
                >
                  Add Another Step
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowDetailPage;
