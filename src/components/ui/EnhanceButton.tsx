import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { enhanceText, EnhanceContext, isAIConfigured } from '../../lib/ai';

interface EnhanceButtonProps {
  currentText: string;
  context: EnhanceContext;
  onEnhanced: (enhancedText: string) => void;
  className?: string;
}

const EnhanceButton = ({ currentText, context, onEnhanced, className = '' }: EnhanceButtonProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAIConfigured()) {
    return null; // Don't show button if AI is not configured
  }

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setError(null);

    try {
      const enhanced = await enhanceText(currentText, context);
      onEnhanced(enhanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance text');
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleEnhance}
        disabled={isEnhancing}
        className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors ${
          isEnhancing
            ? 'text-neutral-400 cursor-wait'
            : 'text-sage-600 hover:text-sage-700'
        } ${className}`}
        title="Polish with AI"
      >
        <Sparkles className={`h-3.5 w-3.5 ${isEnhancing ? 'animate-pulse' : ''}`} />
        <span>{isEnhancing ? 'Polishing...' : 'Polish with AI'}</span>
      </button>
      {error && (
        <div className="absolute top-full mt-1 left-0 right-0 text-label-xs text-error bg-red-50 px-2 py-1 rounded-base">
          {error}
        </div>
      )}
    </div>
  );
};

export default EnhanceButton;
