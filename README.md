# BountyOps Slack Agent

BountyOps is a Slack agent for small builder teams and data teams. It scans cash-backed opportunities, and its DataOps mode uses DataHub context to investigate data assets and prepare remediation plans before any write action.

Built with [Bolt for JavaScript](https://docs.slack.dev/tools/bolt-js/), [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/), the official [DataHub MCP Server](https://github.com/acryldata/mcp-server-datahub), and the [Slack MCP Server](https://github.com/slackapi/slack-mcp-server) integration path from Slack's starter agent template.

## Hackathon Targets

Current target: [Build with DataHub: The Agent Hackathon](https://datahub.devpost.com/)

- Deadline: 2026-08-10 14:00 PDT / 2026-08-11 05:00 Asia/Shanghai
- Cash pool: USD 20,500
- Track: Agents That Do Real Work
- Required assets: working application, public Apache 2.0 repository, description, and public demo video under three minutes.

Submitted project: [Slack Agent Builder Challenge](https://slackhack.devpost.com/)

- Deadline: 2026-07-13 17:00 PDT / 2026-07-14 08:00 Asia/Shanghai
- Cash pool: USD 42,000
- Track: New Slack Agent
- Required assets: text description, architecture diagram, public demo video under 3 minutes, Slack developer sandbox URL, and judge access for `slackhack@salesforce.com` and `testing@devpost.com`.

Secondary target: [Global AI Hackathon Series with Qwen Cloud](https://qwencloud-hackathon.devpost.com/)

- Deadline: 2026-07-20 14:00 PDT / 2026-07-21 05:00 Asia/Shanghai
- Cash pool: USD 45,000
- Track: Autopilot Agent
- Qwen provider: [`agent/provider.js`](agent/provider.js)
- Alibaba Cloud deployment proof: [`deploy/alibaba-cloud/deploy-to-ecs.ps1`](deploy/alibaba-cloud/deploy-to-ecs.ps1)

## App Overview

BountyOps interacts with users through four entry points:

- **App Home** - Displays the BountyOps workflow and approval guardrails.
- **Direct Messages** - Users ask for urgent cash scans, rankings, and submission checklists.
- **Channel mentions** - Mention the agent in a team channel to triage opportunities in context.
- **Assistant Panel** - Users pick suggested prompts such as "Scan urgent cash hackathons".

BountyOps includes:

- `scan_cash_hackathons` - scans Devpost open online hackathons, parses deadlines and cash prizes, filters low-value or risky work, and applies known rule notes.
- `prepare_autopilot_execution_plan` - converts an ambiguous opportunity into build, verification, and human-approval phases.
- DataHub MCP tools - search assets, inspect entities and fields, trace lineage, and retrieve common dataset queries.
- `assess_datahub_metadata` - ranks ownership, documentation, freshness, and criticality risks and proposes non-executing metadata changes.
- `add_emoji_reaction` - acknowledges Slack messages.

## Guardrails

BountyOps can prepare work locally, but it does not submit, post, push public repos, sign wallet messages, pay, trade, change accounts, or mutate DataHub metadata without explicit human approval. The current DataHub MCP integration enforces a read-only allowlist.

## Submission Materials

- Live Slack demo: [YouTube](https://youtu.be/8jPSfNMiX8c)
- Shortlist: [`docs/hackathon-shortlist-2026-07-09.md`](docs/hackathon-shortlist-2026-07-09.md)
- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Uploadable architecture diagram: [`docs/architecture.svg`](docs/architecture.svg)
- Demo script: [`docs/demo-script.md`](docs/demo-script.md)
- Submission checklist: [`docs/submission-checklist.md`](docs/submission-checklist.md)
- Devpost draft: [`docs/devpost-submission-draft.md`](docs/devpost-submission-draft.md)
- Qwen submission plan: [`docs/qwen-cloud-submission.md`](docs/qwen-cloud-submission.md)
- Qwen architecture: [`docs/qwen-architecture.md`](docs/qwen-architecture.md)
- Uploadable Qwen diagram: [`docs/qwen-architecture.svg`](docs/qwen-architecture.svg)
- Qwen demo script: [`docs/qwen-demo-script.md`](docs/qwen-demo-script.md)
- Qwen Devpost story: [`docs/qwen-devpost-story.md`](docs/qwen-devpost-story.md)
- DataHub submission plan: [`docs/datahub-submission.md`](docs/datahub-submission.md)
- DataHub architecture: [`docs/datahub-architecture.md`](docs/datahub-architecture.md)
- Uploadable DataHub diagram: [`docs/datahub-architecture.svg`](docs/datahub-architecture.svg)
- DataHub demo script: [`docs/datahub-demo-script.md`](docs/datahub-demo-script.md)
- Sample remediation output: [`examples/datahub-remediation-plan.json`](examples/datahub-remediation-plan.json)

## Setup

Before getting started, make sure you have a development workspace where you have permissions to install apps.

### Developer Program

Join the [Slack Developer Program](https://api.slack.com/developer-program) for sandbox environments.

### Create the Slack app

This repo was created with:

```sh
slack create agent slack-bountyops-agent
```

To create or install the app in a workspace, log in with the Slack CLI:

```sh
slack login
slack run
```

You can also create an app manually from [`manifest.json`](manifest.json) at [api.slack.com/apps/new](https://api.slack.com/apps/new).

### Environment variables

Rename `.env.sample` to `.env` and fill in:

```sh
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
SLACK_APP_TOKEN=YOUR_SLACK_APP_TOKEN
SLACK_BOT_TOKEN=YOUR_SLACK_BOT_TOKEN
```

For the Qwen Cloud deployment, use the provider-specific variables instead:

```sh
QWEN_API_KEY=YOUR_QWEN_CLOUD_API_KEY
QWEN_BASE_URL=https://YOUR_QWEN_OPENAI_COMPATIBLE_ENDPOINT/v1
QWEN_MODEL=qwen-plus
```

### DataHub MCP

Install [`uv`](https://docs.astral.sh/uv/) so the `uvx` command is available, then start DataHub locally with the official [quickstart](https://docs.datahub.com/docs/quickstart) or use a DataHub Cloud trial. Configure:

```sh
DATAHUB_GMS_URL=http://localhost:8080
DATAHUB_GMS_TOKEN=YOUR_DATAHUB_PERSONAL_ACCESS_TOKEN
DATAHUB_MCP_COMMAND=uvx
DATAHUB_MCP_PACKAGE=mcp-server-datahub@latest
```

When these variables are present, BountyOps starts the official MCP server for each agent run. The integration exposes only read operations even if the upstream MCP package adds mutation tools.

For a representative catalog without private company data, load one of DataHub's official datapacks:

```sh
datahub datapack load showcase-ecommerce
```

For OAuth HTTP mode, also set:

```sh
SLACK_CLIENT_ID=YOUR_CLIENT_ID
SLACK_CLIENT_SECRET=YOUR_CLIENT_SECRET
SLACK_SIGNING_SECRET=YOUR_SIGNING_SECRET
SLACK_REDIRECT_URI=https://YOUR_NGROK_SUBDOMAIN.ngrok-free.app/slack/oauth_redirect
```

## Development

```sh
npm install
npm run check
npm test
npm run verify:qwen
npm run demo:datahub
npm start
```

With Slack CLI:

```sh
slack run
```

## Project Structure

- `app.js` - Socket Mode entry point.
- `app-oauth.js` - HTTP/OAuth entry point.
- `agent/agent.js` - OpenAI Agents SDK agent definition and Slack MCP connection.
- `agent/provider.js` - explicit Qwen Cloud/OpenAI-compatible provider selection.
- `agent/datahub.js` - official DataHub MCP process configuration with a read-only tool allowlist.
- `agent/tools/opportunity-scout.js` - Devpost scanner and ranking logic.
- `agent/tools/autopilot-plan.js` - end-to-end workflow planner with human approval gates.
- `agent/tools/datahub-quality.js` - deterministic DataHub metadata risk assessment and proposed changes.
- `deploy/alibaba-cloud/` - ACR/ECS production deployment code and instructions.
- `listeners/` - Slack event, action, and view handlers.
- `thread-context/` - In-memory Slack thread history.

## Notes

The Devpost scanner uses the open online hackathon API and rule notes manually checked on 2026-07-09. Re-check rules before any final submission.
