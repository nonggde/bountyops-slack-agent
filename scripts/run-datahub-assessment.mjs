import { assessDataHubAssets } from '../agent/tools/datahub-quality.js';

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

console.log(JSON.stringify(result, null, 2));
