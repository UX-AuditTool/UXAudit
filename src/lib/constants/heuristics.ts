import { Heuristic } from '../../types';

export interface HeuristicDefinition {
  name: Heuristic;
  shortName: string;
  description: string;
  examples: string[];
}

export const HEURISTICS: HeuristicDefinition[] = [
  {
    name: 'Visibility of System Status',
    shortName: 'System Status',
    description: 'The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.',
    examples: [
      'Loading indicators',
      'Progress bars',
      'System notifications',
      'Status messages',
    ],
  },
  {
    name: 'Match Between System and Real World',
    shortName: 'Real World Match',
    description: 'The design should speak the users\' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon.',
    examples: [
      'Familiar terminology',
      'Natural language',
      'Real-world metaphors',
      'Conventional icons',
    ],
  },
  {
    name: 'User Control and Freedom',
    shortName: 'Control & Freedom',
    description: 'Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process.',
    examples: [
      'Undo/redo functionality',
      'Cancel buttons',
      'Back navigation',
      'Clear exit paths',
    ],
  },
  {
    name: 'Consistency and Standards',
    shortName: 'Consistency',
    description: 'Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.',
    examples: [
      'Consistent terminology',
      'Standard UI patterns',
      'Uniform styling',
      'Platform conventions',
    ],
  },
  {
    name: 'Error Prevention',
    shortName: 'Error Prevention',
    description: 'Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.',
    examples: [
      'Input validation',
      'Confirmation dialogs',
      'Constraints and defaults',
      'Helpful formatting',
    ],
  },
  {
    name: 'Recognition Rather than Recall',
    shortName: 'Recognition',
    description: 'Minimize the user\'s memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another.',
    examples: [
      'Visible options',
      'Auto-complete',
      'Recently used items',
      'Clear labels',
    ],
  },
  {
    name: 'Flexibility and Efficiency of Use',
    shortName: 'Flexibility',
    description: 'Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both inexperienced and experienced users.',
    examples: [
      'Keyboard shortcuts',
      'Search functionality',
      'Customization options',
      'Bulk actions',
    ],
  },
  {
    name: 'Aesthetic and Minimalist Design',
    shortName: 'Minimalist Design',
    description: 'Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with the relevant units and diminishes their relative visibility.',
    examples: [
      'Clean layouts',
      'Focused content',
      'Progressive disclosure',
      'Visual hierarchy',
    ],
  },
  {
    name: 'Help Users Recognize, Diagnose, and Recover from Errors',
    shortName: 'Error Recovery',
    description: 'Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.',
    examples: [
      'Clear error messages',
      'Specific problem identification',
      'Actionable solutions',
      'Recovery guidance',
    ],
  },
  {
    name: 'Help and Documentation',
    shortName: 'Documentation',
    description: 'It\'s best if the system doesn\'t need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks.',
    examples: [
      'Contextual help',
      'Tooltips',
      'FAQs',
      'Tutorial guides',
    ],
  },
];

export const SEVERITY_LABELS = {
  Critical: 'Blocks task completion or causes data loss',
  High: 'Major friction, frequent errors or confusion',
  Medium: 'Noticeable friction, learnable with effort',
  Low: 'Minor issue, acceptable but improvable',
  None: 'No violation observed',
} as const;
