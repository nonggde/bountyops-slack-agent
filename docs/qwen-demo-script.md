# QwenCloud Three-Minute Demo Script

Record only after `npm run verify:qwen` passes and the Alibaba Cloud deployment is live.

## 0:00-0:20 - Problem

Small builder teams lose time deciding which opportunity is real, urgent, eligible, and worth shipping. Rules, deadlines, assets, and approval risks are scattered across platforms.

## 0:20-0:55 - Ambiguous input

In Slack, ask:

```text
We have one week and a small budget. Find the strongest cash-backed agent opportunity and turn it into a safe execution plan.
```

Show that BountyOps understands the open-ended request instead of requiring a rigid form.

## 0:55-1:35 - QwenCloud tool use

Show QwenCloud invoking `scan_cash_hackathons` and returning:

- exact deadlines and reward values
- do-now, backup, and skip recommendations
- eligibility and account blockers
- the strongest next action

Briefly show the QwenCloud request log or successful `npm run verify:qwen` result as live-provider evidence. Do not show credentials.

## 1:35-2:15 - Autopilot plan

Ask:

```text
Create an end-to-end execution plan for the selected opportunity with a 16-hour budget.
```

Show `prepare_autopilot_execution_plan` producing qualify, plan, build, verify, and publish phases with completion criteria.

## 2:15-2:40 - Human approval boundary

Highlight that the publish phase is assigned to a human approver. BountyOps can prepare code, evidence, tests, and submission copy, but it does not spend, sign, post, or submit without approval.

## 2:40-3:00 - Production evidence

Show the Qwen-specific architecture diagram and the Alibaba Cloud deployment script. Close with:

> BountyOps turns an ambiguous opportunity into a verified execution workflow, using QwenCloud for reasoning, tools for real work, and human approval for consequential actions.
