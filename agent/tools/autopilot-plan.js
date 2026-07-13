import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * @param {string} candidateTitle
 * @param {string} deadline
 * @param {number} [budgetHours=12]
 */
export function buildAutopilotPlan(candidateTitle, deadline, budgetHours = 12) {
  return {
    candidate: candidateTitle,
    deadline,
    budgetHours,
    objective: `Turn ${candidateTitle} from an ambiguous opportunity into a verified, submission-ready package.`,
    phases: [
      {
        id: 'qualify',
        owner: 'BountyOps',
        actions: [
          'Confirm eligibility, cash prize, deadline, required accounts, and submission artifacts.',
          'Reject unsafe, low-value, or human-only work that cannot be prepared locally.',
        ],
        approvalRequired: false,
      },
      {
        id: 'plan',
        owner: 'BountyOps',
        actions: [
          'Break the deliverable into build, evidence, demo, and submission workstreams.',
          'Order tasks by deadline risk and dependency.',
        ],
        approvalRequired: false,
      },
      {
        id: 'build',
        owner: 'Builder team',
        actions: [
          'Implement the smallest complete demo.',
          'Generate tests, architecture evidence, and submission copy in parallel.',
        ],
        approvalRequired: false,
      },
      {
        id: 'verify',
        owner: 'BountyOps',
        actions: [
          'Run automated tests and submission-readiness checks.',
          'Scan public artifacts for secrets and broken links.',
        ],
        approvalRequired: false,
      },
      {
        id: 'publish',
        owner: 'Human approver',
        actions: [
          'Approve account changes, public posts, cloud spend, and final submission.',
          'Publish only after every blocker is cleared.',
        ],
        approvalRequired: true,
      },
    ],
    completionCriteria: [
      'Working demo',
      'Passing tests',
      'Public repository and license',
      'Architecture diagram',
      'Demo video',
      'Deployment proof',
      'Human approval recorded',
    ],
  };
}

export const prepareAutopilotExecutionPlan = tool({
  name: 'prepare_autopilot_execution_plan',
  description:
    'Convert an ambiguous bounty or hackathon into an end-to-end execution plan with explicit human approval checkpoints.',
  parameters: z.object({
    candidate_title: z.string().min(1).describe('Opportunity or project name.'),
    deadline: z.string().min(1).describe('Exact deadline including timezone when known.'),
    budget_hours: z.number().int().min(1).max(200).default(12).describe('Maximum team hours available.'),
  }),
  execute: async ({ candidate_title, deadline, budget_hours }) =>
    buildAutopilotPlan(candidate_title, deadline, budget_hours),
});
