import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useStore from '../../store/useStore';
import { Platform, Device } from '../../types';
import { Plus, X } from 'lucide-react';

interface AddFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const AddFlowModal = ({ open, onOpenChange, projectId }: AddFlowModalProps) => {
  const navigate = useNavigate();
  const addFlow = useStore((state) => state.addFlow);

  const [formData, setFormData] = useState({
    name: '',
    platform: 'Web' as Platform,
    device: 'Desktop' as Device,
    urls: [''],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Flow name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filter out empty URLs
    const urls = formData.urls.filter((url) => url.trim() !== '');

    // Create flow
    const flow = addFlow({
      projectId,
      name: formData.name,
      platform: formData.platform,
      device: formData.device,
      urls,
    });

    // Reset form
    setFormData({
      name: '',
      platform: 'Web',
      device: 'Desktop',
      urls: [''],
    });
    setErrors({});

    // Close modal and navigate to flow
    onOpenChange(false);
    navigate(`/projects/${projectId}/flows/${flow.id}`);
  };

  const handleAddUrl = () => {
    setFormData((prev) => ({
      ...prev,
      urls: [...prev.urls, ''],
    }));
  };

  const handleRemoveUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index),
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      urls: prev.urls.map((url, i) => (i === index ? value : url)),
    }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Flow"
      description="Define a user flow to audit with steps and screens"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Flow</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Flow Name"
          placeholder="e.g., Homepage to Product"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-base text-espresso-600 mb-1.5">
              Platform <span className="text-error">*</span>
            </label>
            <select
              value={formData.platform}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, platform: e.target.value as Platform }))
              }
              className="w-full h-10 px-3 rounded-base border-[1.5px] border-neutral-200 font-body text-body-sm text-espresso-500 focus:outline-none focus:border-2 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(81,108,97,0.12)] transition-all"
            >
              <option value="Web">Web</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
            </select>
          </div>

          <div>
            <label className="block text-label-base text-espresso-600 mb-1.5">
              Device <span className="text-error">*</span>
            </label>
            <select
              value={formData.device}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, device: e.target.value as Device }))
              }
              className="w-full h-10 px-3 rounded-base border-[1.5px] border-neutral-200 font-body text-body-sm text-espresso-500 focus:outline-none focus:border-2 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(81,108,97,0.12)] transition-all"
            >
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-label-base text-espresso-600 mb-1.5">
            URLs (optional)
          </label>
          <div className="space-y-2">
            {formData.urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1"
                />
                {formData.urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    className="p-2 text-neutral-500 hover:text-error hover:bg-neutral-100 rounded-base transition-colors"
                    aria-label="Remove URL"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddUrl}
            leftIcon={<Plus className="h-4 w-4" />}
            className="mt-2"
          >
            Add Another URL
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFlowModal;
