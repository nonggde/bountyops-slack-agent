# DataHub Demo Script

Target length: 90-150 seconds.

## Scene 1: The problem

Show a Slack request: "Find high-impact datasets with missing ownership or stale freshness."

## Scene 2: Evidence collection

Show BountyOps using DataHub MCP to search assets, inspect entity metadata and fields, and trace downstream lineage. Keep the focus on the evidence returned by DataHub.

## Scene 3: Prioritized review

Show `assess_datahub_metadata` returning high, medium, and low findings. Highlight missing ownership, freshness above 24 hours, and downstream impact.

## Scene 4: Human approval gate

Show the proposed `add_owners`, `update_description`, and `add_tags` operations. Confirm that `mutationExecuted` remains `false` and that no DataHub mutation tool is exposed to the agent.

## Scene 5: Outcome

Close on the value: DataHub supplies trustworthy organizational context; BountyOps turns it into a reviewable DataOps workflow inside Slack.
