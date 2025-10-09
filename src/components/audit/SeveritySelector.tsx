import { Severity } from '../../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle, MinusCircle } from 'lucide-react';

interface SeveritySelectorProps {
  value: Severity;
  onChange: (severity: Severity) => void;
  label?: string;
}

const severityConfig = {
  Critical: {
    icon: AlertCircle,
    color: 'error',
    bgClass: 'bg-[#8B3A3A]',
    bgHoverClass: 'hover:bg-[#6B2C2C]',
    borderClass: 'border-[#8B3A3A]',
    textClass: 'text-white',
    selectedBorderClass: 'ring-4 ring-[#8B3A3A]/20',
  },
  High: {
    icon: AlertTriangle,
    color: 'goldenrod',
    bgClass: 'bg-goldenrod-500',
    bgHoverClass: 'hover:bg-goldenrod-600',
    borderClass: 'border-goldenrod-500',
    textClass: 'text-espresso-600',
    selectedBorderClass: 'ring-4 ring-goldenrod-500/20',
  },
  Medium: {
    icon: Info,
    color: 'blush',
    bgClass: 'bg-blush-200',
    bgHoverClass: 'hover:bg-blush-300',
    borderClass: 'border-blush-400',
    textClass: 'text-blush-800',
    selectedBorderClass: 'ring-4 ring-blush-400/20',
  },
  Low: {
    icon: CheckCircle,
    color: 'sage',
    bgClass: 'bg-sage-100',
    bgHoverClass: 'hover:bg-sage-200',
    borderClass: 'border-sage-300',
    textClass: 'text-sage-800',
    selectedBorderClass: 'ring-4 ring-sage-300/20',
  },
  None: {
    icon: MinusCircle,
    color: 'neutral',
    bgClass: 'bg-neutral-100',
    bgHoverClass: 'hover:bg-neutral-200',
    borderClass: 'border-neutral-300',
    textClass: 'text-neutral-600',
    selectedBorderClass: 'ring-4 ring-neutral-300/20',
  },
} as const;

const SeveritySelector = ({ value, onChange, label }: SeveritySelectorProps) => {
  const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'None'];

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-label-base text-espresso-600">
          {label}
        </label>
      )}

      <div className="flex gap-3">
        {severities.map((severity) => {
          const config = severityConfig[severity];
          const Icon = config.icon;
          const isSelected = value === severity;

          return (
            <button
              key={severity}
              type="button"
              onClick={() => onChange(severity)}
              className={`
                flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2
                transition-all duration-200
                ${isSelected ? config.bgClass : 'bg-white'}
                ${isSelected ? config.borderClass : 'border-neutral-200'}
                ${isSelected ? config.selectedBorderClass : ''}
                ${!isSelected && config.bgHoverClass}
                ${!isSelected && 'hover:border-neutral-300'}
                focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
              `}
            >
              <Icon
                className={`h-6 w-6 ${isSelected ? config.textClass : 'text-neutral-400'}`}
              />
              <span
                className={`text-label-sm font-medium ${
                  isSelected ? config.textClass : 'text-neutral-600'
                }`}
              >
                {severity}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeveritySelector;
