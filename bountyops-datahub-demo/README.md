# BountyOps DataHub Demo

HyperFrames source and final render for the BountyOps DataOps Autopilot demo.

The 56-second video presents the verified workflow used in the live deployment:

- Search the DataHub showcase catalog from Slack.
- Inspect the `order_entry.orders` dataset and its 15 schema fields.
- Summarize 20 downstream lineage entities and PII impact.
- Produce a prioritized remediation plan without exposing mutation tools.
- Keep every proposed metadata write behind explicit human approval.

## Verify

```bash
npm run check
```

## Render

```bash
npm run render -- --output bountyops-datahub-demo-final.mp4 --quality high --fps 30
```

The included final video is silent by design and uses on-screen product copy throughout.
