import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildAutopilotPlan } from '../../../agent/tools/autopilot-plan.js';

describe('autopilot execution plan', () => {
  it('keeps public actions behind a human approval gate', () => {
    const plan = buildAutopilotPlan('Qwen Cloud Hackathon', '2026-07-20 14:00 PDT', 16);
    assert.equal(plan.budgetHours, 16);
    assert.equal(plan.phases.at(-1).id, 'publish');
    assert.equal(plan.phases.at(-1).approvalRequired, true);
    assert.ok(plan.completionCriteria.includes('Deployment proof'));
  });
});
