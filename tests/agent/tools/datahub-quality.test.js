import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assessDataHubAssets } from '../../../agent/tools/datahub-quality.js';

describe('DataHub metadata assessment', () => {
  it('prioritizes missing ownership and stale high-impact assets without mutating metadata', () => {
    const result = assessDataHubAssets([
      {
        urn: 'urn:li:dataset:(urn:li:dataPlatform:snowflake,analytics.orders,PROD)',
        name: 'analytics.orders',
        owners: [],
        description: '',
        freshnessHours: 36,
        downstreamCount: 12,
        tags: [],
      },
    ]);

    assert.equal(result.summary.high, 2);
    assert.equal(result.summary.medium, 1);
    assert.equal(result.summary.low, 1);
    assert.equal(result.approvalGate.required, true);
    assert.equal(result.approvalGate.mutationExecuted, false);
    assert.deepEqual(
      result.proposedChanges.map((change) => change.operation),
      ['add_owners', 'update_description', 'add_tags'],
    );
  });

  it('returns no remediation changes for a documented, owned asset', () => {
    const result = assessDataHubAssets([
      {
        urn: 'urn:li:dataset:(urn:li:dataPlatform:snowflake,analytics.customers,PROD)',
        name: 'analytics.customers',
        owners: ['data-platform'],
        description: 'Curated customer dimension.',
        freshnessHours: 4,
        downstreamCount: 3,
        tags: ['Tier 1'],
      },
    ]);

    assert.equal(result.findings.length, 0);
    assert.equal(result.approvalGate.required, false);
  });
});
