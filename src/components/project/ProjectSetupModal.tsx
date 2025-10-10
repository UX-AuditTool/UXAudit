import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import MultiSelect from '../ui/MultiSelect';
import useStore from '../../store/useStore';
import { Device } from '../../types';

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
    devices: [] as Device[],
    hipaaRequired: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // Create project
      const project = await addProject({
        name: formData.name,
        clientName: formData.clientName,
        auditGoal: formData.auditGoal || undefined,
        devices: formData.devices.length > 0 ? formData.devices : undefined,
        hipaaRequired: formData.hipaaRequired,
      });

      // Reset form
      setFormData({
        name: '',
        clientName: '',
        auditGoal: '',
        devices: [],
        hipaaRequired: false,
      });
      setErrors({});

      // Close modal and navigate to project
      onOpenChange(false);
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    }
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

        <MultiSelect
          label="Target Devices"
          description="Select all devices that will be audited in this project"
          options={[
            { value: 'Desktop', label: 'Desktop' },
            { value: 'Mobile', label: 'Mobile' },
            { value: 'Tablet', label: 'Tablet' },
          ]}
          selected={formData.devices}
          onChange={(devices) => setFormData((prev) => ({ ...prev, devices: devices as Device[] }))}
        />

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.hipaaRequired}
              onChange={(e) => setFormData((prev) => ({ ...prev, hipaaRequired: e.target.checked }))}
              className="mt-1 w-5 h-5 rounded border-2 border-neutral-300 text-sage-500 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 transition-colors"
            />
            <div>
              <span className="block text-label-base text-espresso-600 group-hover:text-espresso-700 transition-colors">
                Protected Health Information (PHI) Present
              </span>
              <span className="block text-body-xs text-neutral-600 mt-1">
                Check this if the project involves HIPAA-regulated health data
              </span>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectSetupModal;
