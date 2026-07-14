# BountyOps Autopilot - Devpost Story Draft

Preflight: paste this story only after `npm run verify:qwen` passes, the Alibaba Cloud deployment is verified, and the Qwen-specific demo video is public.

## Inspiration

Small builder teams do not usually fail because they lack ideas. They fail because opportunity discovery, eligibility checks, deadlines, build planning, verification, and submission work live in different places. By the time a team decides what is worth doing, the deadline is already too close.

We built BountyOps Autopilot to turn that uncertainty into an executable workflow inside Slack.

## What it does

BountyOps accepts an ambiguous goal such as "find the strongest cash-backed agent opportunity we can finish this week." It searches current opportunities, ranks them by deadline, reward, fit, and risk, and produces a do-now / backup / skip recommendation.

After a team chooses an opportunity, BountyOps creates an end-to-end execution plan with five phases: qualify, plan, build, verify, and publish. It identifies required assets, orders work by dependency and deadline risk, and keeps consequential actions behind a human approval gate.

## How we built it

- Slack and Bolt for JavaScript provide the conversational work surface.
- The OpenAI Agents SDK orchestrates QwenCloud and local tools through the OpenAI-compatible API.
- `qwen3.7-plus` reasons over ambiguous requests and decides when to invoke tools.
- `scan_cash_hackathons` discovers and ranks real opportunities.
- `prepare_autopilot_execution_plan` generates build, evidence, verification, and approval phases.
- Alibaba Cloud ECS runs the backend, with deployment automated through the ECS `RunCommand` API.
- Alibaba Cloud Container Registry stores the deployable image.

## How we use QwenCloud

QwenCloud is the reasoning layer rather than a text-only wrapper. It interprets incomplete goals, selects tools, combines structured tool results, explains tradeoffs, and produces a concrete next action. The agent must handle changing deadlines, inconsistent prize formats, eligibility constraints, and public-action risk without forcing the user through a fixed questionnaire.

## Challenges

The hardest part was separating useful autonomy from unsafe automation. An agent that can discover and plan work should not silently spend money, sign a wallet message, publish a repository, or submit an entry. We encoded those boundaries in the system prompt and in the execution plan itself.

Another challenge was making the workflow reproducible. We added deterministic ranking logic, tests, a live-provider verification command, secret scanning, architecture documentation, and an Alibaba Cloud deployment path.

## Accomplishments

- A Slack-native agent that converts open-ended requests into ranked execution decisions.
- Real tool invocation instead of a scripted chat demo.
- Explicit human approval checkpoints for consequential actions.
- Automated tests and submission-readiness checks.
- A production-oriented Alibaba Cloud deployment path with restart protection.

## What we learned

The best agent workflow is not the one with the most autonomy. It is the one that knows which decisions can be automated, which facts must be verified, and exactly where a human must take responsibility.

## What's next

We plan to add persistent execution state, deadline-change monitoring, richer repository analysis, and team-level Slack canvases that track evidence and approvals across an entire submission cycle.
