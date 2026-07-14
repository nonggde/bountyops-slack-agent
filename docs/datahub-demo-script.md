# DataHub Demo Script

Target length: 56 seconds.

## Scene 1: The problem

Show a Slack request: "Find the orders dataset, inspect its schema, and summarize downstream lineage. Do not change metadata."

## Scene 2: Evidence collection

Show BountyOps using `search`, `get_entities`, `list_schema_fields`, and `get_lineage`. Highlight the verified `order_entry.orders` result, 15 fields, PII markers, and 20 downstream entities.

## Scene 3: Prioritized review

Show the deterministic remediation plan ranking missing ownership, PII impact, criticality, and description quality.

## Scene 4: Human approval gate

Show the proposed `add_owners`, `update_description`, and `add_tags` operations. Confirm that `mutationExecuted` remains `false` and that no DataHub mutation tool is exposed to the agent.

## Scene 5: Outcome

Close on the value: DataHub supplies trustworthy organizational context; BountyOps turns it into a reviewable DataOps workflow inside Slack.
