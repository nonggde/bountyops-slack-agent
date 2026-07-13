import { tool } from '@openai/agents';
import { z } from 'zod';

/** @typedef {'high' | 'medium' | 'low'} Severity */

/** @type {Record<Severity, number>} */
const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

/**
 * Turn DataHub metadata into a deterministic, reviewable remediation plan.
 * This function never writes to DataHub.
 * @param {Array<{ urn: string, name: string, owners?: string[], description?: string, freshnessHours?: number | null, downstreamCount?: number, tags?: string[] }>} assets
 */
export function assessDataHubAssets(assets) {
  /** @type {Array<{ urn: string, asset: string, severity: Severity, issue: string, evidence: string }>} */
  const findings = [];
  const proposedChanges = [];

  for (const asset of assets) {
    const owners = asset.owners || [];
    const tags = asset.tags || [];
    const downstreamCount = asset.downstreamCount || 0;

    if (owners.length === 0) {
      findings.push({
        urn: asset.urn,
        asset: asset.name,
        severity: 'high',
        issue: 'No owner is assigned.',
        evidence: 'DataHub returned an empty owner list.',
      });
      proposedChanges.push({
        urn: asset.urn,
        operation: 'add_owners',
        valueNeeded: 'Select a technical or data owner.',
      });
    }

    if (!asset.description?.trim()) {
      findings.push({
        urn: asset.urn,
        asset: asset.name,
        severity: 'medium',
        issue: 'The asset has no useful description.',
        evidence: 'DataHub returned a blank description.',
      });
      proposedChanges.push({
        urn: asset.urn,
        operation: 'update_description',
        valueNeeded: 'Review and approve a business-facing description.',
      });
    }

    if (typeof asset.freshnessHours === 'number' && asset.freshnessHours > 24) {
      findings.push({
        urn: asset.urn,
        asset: asset.name,
        severity: downstreamCount >= 5 ? 'high' : 'medium',
        issue: `Freshness is ${asset.freshnessHours} hours, above the 24-hour review threshold.`,
        evidence: `${downstreamCount} downstream assets may be affected.`,
      });
    }

    const hasTier = tags.some((tag) => /^tier[ _-]?[01]$/i.test(tag));
    if (downstreamCount >= 10 && !hasTier) {
      findings.push({
        urn: asset.urn,
        asset: asset.name,
        severity: 'low',
        issue: 'High-impact asset has no Tier 0 or Tier 1 tag.',
        evidence: `${downstreamCount} downstream assets depend on it.`,
      });
      proposedChanges.push({
        urn: asset.urn,
        operation: 'add_tags',
        valueNeeded: 'Confirm the appropriate criticality tier.',
      });
    }
  }

  findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  /** @type {Record<Severity, number>} */
  const counts = { high: 0, medium: 0, low: 0 };
  for (const finding of findings) counts[finding.severity] += 1;

  return {
    assetsReviewed: assets.length,
    summary: counts,
    findings,
    proposedChanges,
    approvalGate: {
      required: proposedChanges.length > 0,
      mutationExecuted: false,
      instruction:
        'A human must choose concrete values and explicitly approve before any DataHub mutation tool is enabled.',
    },
  };
}

export const assessDataHubMetadata = tool({
  name: 'assess_datahub_metadata',
  description:
    'Assess metadata collected through DataHub MCP and produce prioritized findings plus a non-executing remediation plan.',
  parameters: z.object({
    assets: z
      .array(
        z.object({
          urn: z.string().min(1),
          name: z.string().min(1),
          owners: z.array(z.string()).default([]),
          description: z.string().default(''),
          freshness_hours: z.number().nonnegative().nullable().default(null),
          downstream_count: z.number().int().nonnegative().default(0),
          tags: z.array(z.string()).default([]),
        }),
      )
      .min(1)
      .max(50),
  }),
  execute: async ({ assets }) =>
    assessDataHubAssets(
      assets.map((asset) => ({
        urn: asset.urn,
        name: asset.name,
        owners: asset.owners,
        description: asset.description,
        freshnessHours: asset.freshness_hours,
        downstreamCount: asset.downstream_count,
        tags: asset.tags,
      })),
    ),
});
