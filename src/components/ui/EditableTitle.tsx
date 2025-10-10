import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  className?: string;
  inputClassName?: string;
}

const EditableTitle = ({ value, onSave, className = '', inputClassName = '' }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      setEditValue(value); // Reset to original if empty
      setIsEditing(false);
      return;
    }

    if (trimmedValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(trimmedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Reset on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isSaving}
          className={`px-2 py-1 border-2 border-teal-500 rounded-base focus:outline-none ${inputClassName}`}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="p-1 text-teal-600 hover:bg-teal-50 rounded-base transition-colors"
          title="Save"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-base transition-colors"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="absolute -left-8 opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-teal-600 hover:bg-teal-50 rounded-base transition-all"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <span className={className}>{value}</span>
    </div>
  );
};

export default EditableTitle;
