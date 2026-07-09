import { tool } from '@openai/agents';
import { z } from 'zod';

const SLACK_AGENT_BUILDER_PLAN = {
  challenge: 'Slack Agent Builder Challenge',
  url: 'https://slackhack.devpost.com/',
  deadline: '2026-07-13 17:00 PDT / 2026-07-14 08:00 Asia/Shanghai',
  prize: '$42,000 cash pool',
  track: 'New Slack Agent',
  product: 'BountyOps',
  oneLiner:
    'BountyOps is a Slack agent that finds near-deadline cash hackathons and bounties, ranks what to build, and prepares submission assets before any public action.',
  requiredAssets: [
    'Working Slack app in the BountyOps developer sandbox',
    'Text description of features and functionality',
    'Architecture diagram',
    'Public demo video under 3 minutes',
    'Slack developer sandbox URL',
    'Judge access for slackhack@salesforce.com and testing@devpost.com',
  ],
  buildPlan: [
    {
      window: 'Now',
      tasks: [
        'Keep BountyOps running in the Slack sandbox with z30 OpenAI-compatible API settings.',
        'Verify the agent answers @mentions and produces urgent cash hackathon rankings.',
        'Ask the agent for the Slack submission checklist and capture the response for the demo.',
      ],
    },
    {
      window: 'Next 6 hours',
      tasks: [
        'Polish Devpost copy and README links.',
        'Capture a short screen recording: Slack prompt, BountyOps ranking response, submission checklist response.',
        'Export architecture diagram from docs/architecture.md or use it as the submitted architecture artifact.',
      ],
    },
    {
      window: 'Before submission',
      tasks: [
        'Create or verify a public GitHub repo if Devpost asks for code access.',
        'Upload demo video to a public URL.',
        'Add judge emails to the Slack sandbox.',
        'Review all public materials for no leaked API keys, tokens, private URLs, or wallet secrets.',
      ],
    },
  ],
  blockers: [
    'Do not submit Devpost until the user explicitly approves.',
    'Do not push a public GitHub repo until the user explicitly approves.',
    'Do not publish a demo video until the user explicitly approves.',
    'Do not share API keys or Slack tokens in screenshots or video.',
  ],
  demoPrompts: [
    'Find cash-backed online hackathons ending in the next 14 days.',
    'Create a submission checklist for the Slack Agent Builder Challenge.',
    'What should we skip and why?',
  ],
};

export function getSlackAgentBuilderPlan() {
  return SLACK_AGENT_BUILDER_PLAN;
}

export const prepareSlackSubmissionPlan = tool({
  name: 'prepare_slack_submission_plan',
  description:
    'Return the concrete submission checklist, build plan, demo prompts, and blockers for the Slack Agent Builder Challenge.',
  parameters: z.object({
    include_2_day_plan: z.boolean().default(true).describe('Whether to include the time-boxed build plan.'),
  }),
  execute: async ({ include_2_day_plan }) => ({
    ...SLACK_AGENT_BUILDER_PLAN,
    buildPlan: include_2_day_plan ? SLACK_AGENT_BUILDER_PLAN.buildPlan : [],
  }),
});
