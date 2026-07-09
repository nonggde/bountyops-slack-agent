# BountyOps Architecture

Uploadable diagram: [`architecture.svg`](architecture.svg)

```mermaid
flowchart LR
  User["Builder in Slack"] --> Slack["Slack Agent Surface"]
  Slack --> Bolt["Bolt for JavaScript App"]
  Bolt --> Agent["OpenAI Agents SDK: BountyOps Agent"]
  Agent --> DevpostTool["scan_cash_hackathons Tool"]
  DevpostTool --> Devpost["Devpost Open Online API"]
  Agent --> SlackMcp["Slack MCP Server"]
  SlackMcp --> Workspace["Slack messages, canvases, channels"]
  Agent --> Response["Ranked shortlist, blockers, checklist"]
  Response --> Slack
```

## Core flow

1. A builder asks BountyOps to find urgent cash opportunities.
2. The agent calls `scan_cash_hackathons`.
3. The tool scans Devpost open online hackathons, cleans prize data, parses deadlines, filters low-value or risky work, and applies known rule notes checked on 2026-07-09.
4. The agent responds in Slack with a ranked shortlist and one next action.
5. If Slack MCP is connected, the agent can search team context or prepare a canvas, but it does not send, submit, post, sign, pay, or modify accounts without explicit human approval.

## Why it matches Slack Agent Builder

- It uses the Slack Agent surface for direct messages, mentions, and the assistant panel.
- It uses the Slack MCP Server integration path already present in the Slack starter template.
- It automates a real work process: finding near-deadline cash opportunities and turning them into submission-ready action plans.
- It has human-in-the-loop checkpoints for public actions.
