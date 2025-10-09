import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import useStore from '../../store/useStore';

interface ProjectSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectSetupModal = ({ open, onOpenChange }: ProjectSetupModalProps) => {
  const navigate = useNavigate();
  const addProject = useStore((state) => state.addProject);

  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    auditGoal: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create project
    const project = addProject({
      name: formData.name,
      clientName: formData.clientName,
      auditGoal: formData.auditGoal || undefined,
    });

    // Reset form
    setFormData({ name: '', clientName: '', auditGoal: '' });
    setErrors({});

    // Close modal and navigate to project
    onOpenChange(false);
    navigate(`/projects/${project.id}`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Project"
      description="Set up your UX audit project with basic information"
      size="md"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project Name"
          placeholder="e.g., E-commerce Checkout Audit"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          autoFocus
        />

        <Input
          label="Client Name"
          placeholder="e.g., Acme Corporation"
          value={formData.clientName}
          onChange={(e) => handleChange('clientName', e.target.value)}
          error={errors.clientName}
          required
        />

        <Textarea
          label="Audit Goal"
          placeholder="Describe the main objectives of this audit..."
          value={formData.auditGoal}
          onChange={(e) => handleChange('auditGoal', e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
};

export default ProjectSetupModal;
