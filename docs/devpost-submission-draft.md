# Devpost Submission Draft

## Project Title

BountyOps

## Tagline

A Slack agent that finds urgent cash-backed hackathons and bounties, ranks what to build, and prepares submission assets before public action.

## Track

New Slack Agent

## What It Does

BountyOps helps small builder teams decide what to work on before a deadline disappears. Inside Slack, a user can ask for cash-backed hackathons ending soon. The agent scans open online Devpost opportunities, ranks them by deadline, cash pool, fit, and risk, and returns a clear do-now / backup / skip recommendation.

It can also prepare a Slack Agent Builder submission checklist, including demo assets, architecture diagram needs, sandbox judge access, and human approval boundaries.

## How We Built It

- Slack Agent surface with Bolt for JavaScript.
- OpenAI Agents SDK using an OpenAI-compatible gateway through `OPENAI_BASE_URL`.
- Slack MCP-ready starter architecture for Slack-native context.
- Custom Devpost scanner tool with Windows PowerShell fallback for local reliability.
- Submission planning tool for the Slack Agent Builder Challenge.

## What Makes It Useful

Most hackathon discovery workflows stop at a list of links. BountyOps turns discovery into a ranked execution plan: what to do first, what to ignore, and what assets must be prepared before public submission.

## Guardrails

BountyOps prepares work locally but does not submit Devpost entries, post publicly, push public GitHub repos, sign wallet messages, pay, trade, or change accounts without explicit human approval.

## Demo Prompts

```text
@BountyOps Find cash-backed online hackathons ending in the next 14 days.
```

```text
@BountyOps Create a submission checklist for the Slack Agent Builder Challenge.
```
