import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useStore from '../../store/useStore';
import { X } from 'lucide-react';

interface AddStepFormProps {
  flowId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddStepForm = ({ flowId, onSuccess, onCancel }: AddStepFormProps) => {
  const addStep = useStore((state) => state.addStep);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Step title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create step
    addStep({
      flowId,
      title: formData.title,
      url: formData.url || undefined,
    });

    // Reset form
    setFormData({ title: '', url: '' });
    setErrors({});

    // Callback
    onSuccess?.();
  };

  const handleCancel = () => {
    setFormData({ title: '', url: '' });
    setErrors({});
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-neutral-50 border border-neutral-200 rounded-md">
      <div className="space-y-3">
        <Input
          label="Step Title"
          placeholder="e.g., View product page"
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: '' }));
            }
          }}
          error={errors.title}
          required
          autoFocus
        />

        <Input
          label="URL (optional)"
          placeholder="https://example.com/products/item-123"
          value={formData.url}
          onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              leftIcon={<X className="h-4 w-4" />}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            Add Step
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddStepForm;
