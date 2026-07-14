# Qwen Cloud Hackathon Submission

- Track: Autopilot Agent
- Deadline: July 20, 2026 at 2:00 PM PDT
- Prize: USD 7,000 cash plus USD 3,000 cloud credits for the track winner

## Current Status

- Registered for the hackathon on Devpost.
- Created the `BountyOps Autopilot` submission draft (`1078429`), currently 2/5 steps complete.
- Configured a project-specific Qwen Cloud API key locally; no secret is stored in this repository.
- Selected `qwen3.7-plus` through the Qwen Cloud OpenAI-compatible endpoint.
- Confirmed that the API key can list available models.
- Submitted the hackathon free-credit application on 2026-07-14; approval is pending.
- Inference currently returns an eligibility error until the free-credit application is approved.

## Positioning

BountyOps turns an ambiguous opportunity into an end-to-end, verified execution workflow. Qwen Cloud reasons over deadlines, prize rules, team constraints, and required assets; tools scan opportunities and generate execution plans; explicit approval gates prevent unapproved posting, spending, wallet signing, or final submission.

## Qwen Cloud Evidence

- Provider configuration: `agent/provider.js`
- Qwen model variables: `QWEN_API_KEY`, `QWEN_BASE_URL`, `QWEN_MODEL`
- Autopilot orchestration tool: `agent/tools/autopilot-plan.js`
- Alibaba Cloud deployment API: `deploy/alibaba-cloud/deploy-to-ecs.ps1`
- Container definition: `Dockerfile`
- Architecture: `docs/qwen-architecture.md` and `docs/qwen-architecture.svg`
- Demo script: `docs/qwen-demo-script.md`
- Devpost story draft: `docs/qwen-devpost-story.md`
- Live provider verification: `scripts/verify-qwen-cloud.mjs`

## Required Assets

- Public repository with an OSI-approved license (Apache 2.0 in this repository)
- Working Qwen Cloud model call
- Backend running on Alibaba Cloud
- Link to Alibaba deployment code
- Architecture diagram
- Public three-minute demo video
- English project description

## External Blockers

- Qwen Cloud hackathon credit approval and a successful live model call
- Alibaba Cloud deployment verification on the existing ECS instance
- Qwen-specific public demo video
- Remaining Devpost project details, additional information, and final submission
