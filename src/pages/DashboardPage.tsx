import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ProjectSetupModal from '../components/project/ProjectSetupModal';
import { format } from 'date-fns';

const DashboardPage = () => {
  const navigate = useNavigate();
  const projects = useStore((state) => state.projects);
  const loadProjects = useStore((state) => state.loadProjects);
  const isLoading = useStore((state) => state.isLoading);
  const setCurrentProject = useStore((state) => state.setCurrentProject);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load projects from database on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleProjectClick = (projectId: string) => {
    setCurrentProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-espresso-600 mb-2">
              Dashboard
            </h1>
            <p className="text-body-base text-neutral-600">
              Manage your UX audit projects
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="h-5 w-5" />}
          >
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-body-base text-neutral-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FolderOpen className="h-16 w-16" />}
              title="No projects yet"
              description="Create your first project to start auditing user experiences and capturing findings."
              action={
                <Button
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Create First Project
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                hover
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-heading text-xl text-espresso-600 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-body-sm text-neutral-600">
                      {project.clientName}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200">
                    <div className="text-body-xs text-neutral-500">
                      <span>Created {format(project.createdAt, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <ProjectSetupModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default DashboardPage;
