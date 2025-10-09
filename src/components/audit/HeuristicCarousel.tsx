import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Textarea from '../ui/Textarea';
import SeveritySelector from './SeveritySelector';
import ScreenshotUpload from './ScreenshotUpload';
import { Heuristic, Severity, HeuristicViolation } from '../../types';
import { HeuristicDefinition } from '../../lib/constants/heuristics';

interface HeuristicCarouselProps {
  heuristics: HeuristicDefinition[];
  violations: HeuristicViolation[];
  onHeuristicChange: (heuristic: Heuristic, severity: Severity) => void;
  onNotesChange: (heuristic: Heuristic, notes: string) => void;
  onScreenshotsChange: (heuristic: Heuristic, screenshotIds: string[]) => void;
}

const HeuristicCarousel = ({
  heuristics,
  violations,
  onHeuristicChange,
  onNotesChange,
  onScreenshotsChange,
}: HeuristicCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heuristics.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heuristics.length) % heuristics.length);
  };

  const currentHeuristic = heuristics[currentIndex];
  const violation = violations.find((v) => v.heuristic === currentHeuristic.name);
  const severity = violation?.severity || 'None';
  const notes = violation?.notes || '';

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${
              currentIndex === 0
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-espresso-600 hover:bg-sage-50 active:bg-sage-100'
            }
          `}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        {/* Progress Indicators */}
        <div className="flex gap-2">
          {heuristics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-sage-500'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to heuristic ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === heuristics.length - 1}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${
              currentIndex === heuristics.length - 1
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-espresso-600 hover:bg-sage-50 active:bg-sage-100'
            }
          `}
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Carousel Content */}
      <div className="p-8 bg-white rounded-lg border border-neutral-200 min-h-[500px]">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sage-100 text-sage-700 font-heading text-lg font-semibold flex-shrink-0">
            {currentIndex + 1}
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-espresso-600 mb-2">
              {currentHeuristic.name}
            </h3>
            <p className="text-body-base text-neutral-600 mb-4">
              {currentHeuristic.description}
            </p>
            <div className="flex items-center gap-2 text-body-sm text-neutral-500">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>Examples: {currentHeuristic.examples.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SeveritySelector
            value={severity}
            onChange={(newSeverity) => onHeuristicChange(currentHeuristic.name, newSeverity)}
            label="Severity"
          />

          <Textarea
            label="Observations & Notes"
            placeholder="Describe the violation, context, and impact..."
            value={notes}
            onChange={(e) => onNotesChange(currentHeuristic.name, e.target.value)}
            rows={4}
          />

          <ScreenshotUpload
            screenshots={violation?.screenshotIds || []}
            onUpload={(files) => {
              // For now, create mock URLs. In production, upload to storage
              const newScreenshots = files.map((file) => URL.createObjectURL(file));
              const currentScreenshots = violation?.screenshotIds || [];
              onScreenshotsChange(currentHeuristic.name, [...currentScreenshots, ...newScreenshots]);
            }}
            onRemove={(index) => {
              const currentScreenshots = violation?.screenshotIds || [];
              const updatedScreenshots = currentScreenshots.filter((_, i) => i !== index);
              onScreenshotsChange(currentHeuristic.name, updatedScreenshots);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeuristicCarousel;
