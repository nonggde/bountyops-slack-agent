# DataHub Architecture

Uploadable diagram: [`datahub-architecture.svg`](datahub-architecture.svg)

```mermaid
flowchart LR
  User["Data engineer in Slack"] --> Slack["Slack Agent Surface"]
  Slack --> Bolt["Bolt for JavaScript"]
  Bolt --> Agent["OpenAI Agents SDK: BountyOps"]
  Agent --> DataHubMcp["Official DataHub MCP Server"]
  DataHubMcp --> DataHub["DataHub metadata graph"]
  Agent --> Assess["assess_datahub_metadata"]
  DataHub --> Assess
  Assess --> Review["Findings and proposed changes"]
  Review --> Approval{"Human approval"}
  Approval -->|Not approved| Slack
  Approval -.->|Future opt-in write path| DataHub
```

## Runtime Flow

1. A data engineer asks BountyOps to investigate an asset or business concept in Slack.
2. The agent uses the official DataHub MCP server to search, inspect schema, retrieve query context, and trace lineage.
3. `assess_datahub_metadata` applies deterministic checks for missing ownership, blank descriptions, stale freshness, and unclassified high-impact assets.
4. The agent returns evidence, severity, and proposed metadata operations in Slack.
5. The current build stops at review. DataHub mutation tools are disabled by environment configuration and by an SDK allowlist.
