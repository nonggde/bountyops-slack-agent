# DataHub Agent Hackathon Submission

- Challenge: Build with DataHub: The Agent Hackathon
- Deadline: August 10, 2026 at 2:00 PM PDT / August 11, 2026 at 5:00 AM Asia/Shanghai
- Track: Agents That Do Real Work
- License: Apache 2.0

## Positioning

BountyOps DataOps Autopilot gives data teams a Slack-native way to investigate high-impact data assets. It searches DataHub, inspects entity metadata and schemas, traces lineage, reviews common queries, and turns that evidence into a prioritized remediation plan. Metadata changes remain behind an explicit human approval gate.

## DataHub Usage

- Official `mcp-server-datahub` process launched through the OpenAI Agents SDK.
- Read-only MCP allowlist: `search`, `get_entities`, `list_schema_fields`, `get_lineage`, `get_lineage_paths_between`, and `get_dataset_queries`.
- Deterministic `assess_datahub_metadata` tool for ownership, documentation, freshness, and criticality findings.
- Mutation tools are disabled in both the child process environment and the SDK tool filter.

## Submission Assets

- Public Apache 2.0 repository with setup instructions
- Working app or clear local setup path
- DataHub-backed investigation demonstrated in Slack
- Public demo video under three minutes
- Architecture diagram
- Sample remediation output in `examples/datahub-remediation-plan.json`

## Remaining External Steps

- Start a local DataHub instance or obtain a DataHub Cloud trial
- Create a DataHub personal access token
- Load the official showcase or bootstrap datapack
- Record a live DataHub-backed Slack demo
- Register for the hackathon and create the Devpost project
