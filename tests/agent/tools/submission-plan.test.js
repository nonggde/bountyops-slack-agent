import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getSlackAgentBuilderPlan } from '../../../agent/tools/submission-plan.js';

describe('submission plan', () => {
  it('contains the required Slack Agent Builder submission assets', () => {
    const plan = getSlackAgentBuilderPlan();
    assert.equal(plan.challenge, 'Slack Agent Builder Challenge');
    assert.ok(plan.requiredAssets.includes('Architecture diagram'));
    assert.ok(plan.requiredAssets.some((asset) => asset.includes('slackhack@salesforce.com')));
    assert.ok(plan.blockers.some((blocker) => blocker.includes('Do not submit Devpost')));
  });
});
