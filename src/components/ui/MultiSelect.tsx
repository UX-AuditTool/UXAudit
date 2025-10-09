import { Check } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  description?: string;
}

const MultiSelect = ({ label, options, selected, onChange, description }: MultiSelectProps) => {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-label-base text-espresso-600">
        {label}
      </label>
      {description && (
        <p className="text-body-xs text-neutral-600 mb-2">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? 'bg-sage-500 border-sage-500 text-white'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-sage-300'
                }
                focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
              `}
            >
              {isSelected && <Check className="h-4 w-4" />}
              <span className="text-label-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelect;
