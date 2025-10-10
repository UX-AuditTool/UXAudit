import { FlowAudit, Severity } from '../../types';

// Severity to numeric score mapping (inverse - higher severity = lower score)
const SEVERITY_SCORES: Record<Severity, number> = {
  None: 5,      // No violation = perfect score
  Low: 4,       // Minor issue
  Medium: 3,    // Noticeable friction
  High: 2,      // Major problem
  Critical: 1,  // Blocks task completion
};

// Score to rating label mapping
export const getScoreLabel = (score: number): string => {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Fair';
  if (score >= 1.5) return 'Poor';
  return 'Critical';
};

// Score to color mapping
export const getScoreColor = (score: number): {
  bg: string;
  text: string;
  border: string;
} => {
  if (score >= 4.5) {
    return {
      bg: 'bg-sage-500',
      text: 'text-white',
      border: 'border-sage-500',
    };
  }
  if (score >= 3.5) {
    return {
      bg: 'bg-blush-100',
      text: 'text-blush-700',
      border: 'border-blush-300',
    };
  }
  if (score >= 2.5) {
    return {
      bg: 'bg-goldenrod-100',
      text: 'text-goldenrod-800',
      border: 'border-goldenrod-400',
    };
  }
  return {
    bg: 'bg-[#8B3A3A]',
    text: 'text-white',
    border: 'border-[#8B3A3A]',
  };
};

/**
 * Calculate overall flow score from heuristic violations
 *
 * Logic:
 * 1. Each heuristic gets a score from 1-5 based on severity
 * 2. Average all heuristic scores (equal weighting)
 * 3. Return score on 0-5 scale
 *
 * Reasoning visible to user:
 * - Shows which heuristics are violated
 * - Shows severity distribution
 * - Clear path to improvement
 */
export const calculateFlowScore = (audit: FlowAudit): {
  score: number;
  reasoning: string;
} => {
  // If no violations recorded, return empty score
  if (!audit.heuristicViolations || audit.heuristicViolations.length === 0) {
    return {
      score: 0,
      reasoning: 'No heuristic evaluations recorded yet.',
    };
  }

  // Calculate score for each heuristic
  const scores = audit.heuristicViolations.map((violation) => {
    return SEVERITY_SCORES[violation.severity];
  });

  // Average all scores
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Count violations by severity
  const severityCounts = audit.heuristicViolations.reduce(
    (counts, violation) => {
      counts[violation.severity] = (counts[violation.severity] || 0) + 1;
      return counts;
    },
    {} as Record<Severity, number>
  );

  // Build reasoning text
  const violationParts: string[] = [];
  if (severityCounts.Critical) {
    violationParts.push(`${severityCounts.Critical} Critical`);
  }
  if (severityCounts.High) {
    violationParts.push(`${severityCounts.High} High`);
  }
  if (severityCounts.Medium) {
    violationParts.push(`${severityCounts.Medium} Medium`);
  }
  if (severityCounts.Low) {
    violationParts.push(`${severityCounts.Low} Low`);
  }

  const totalViolations = Object.entries(severityCounts)
    .filter(([key]) => key !== 'None')
    .reduce((sum, [, count]) => sum + count, 0);

  const reasoning =
    totalViolations > 0
      ? `Based on ${audit.heuristicViolations.length} heuristic evaluations: ${violationParts.join(', ')} severity violations found.`
      : `All ${audit.heuristicViolations.length} heuristics passed with no violations.`;

  return {
    score: Math.round(averageScore * 10) / 10, // Round to 1 decimal
    reasoning,
  };
};

/**
 * Calculate overall project score from flow audits
 *
 * Logic:
 * 1. Calculate score for each flow
 * 2. Average all flow scores (equal weighting)
 * 3. Return score on 0-5 scale
 */
export const calculateProjectScore = (flowAudits: FlowAudit[]): {
  score: number;
  reasoning: string;
  flowCount: number;
} => {
  // Filter to only audits with violations recorded
  const auditsWithData = flowAudits.filter(
    (audit) => audit.heuristicViolations && audit.heuristicViolations.length > 0
  );

  if (auditsWithData.length === 0) {
    return {
      score: 0,
      reasoning: 'No flows have been evaluated yet.',
      flowCount: 0,
    };
  }

  // Calculate score for each flow
  const flowScores = auditsWithData.map((audit) => calculateFlowScore(audit).score);

  // Average all flow scores
  const averageScore = flowScores.reduce((sum, score) => sum + score, 0) / flowScores.length;

  const reasoning = `Average score across ${auditsWithData.length} evaluated flow${auditsWithData.length > 1 ? 's' : ''}.`;

  return {
    score: Math.round(averageScore * 10) / 10, // Round to 1 decimal
    reasoning,
    flowCount: auditsWithData.length,
  };
};
