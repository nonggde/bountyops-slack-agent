# BountyOps Slack Agent

BountyOps is a Slack agent for small builder teams chasing cash-backed hackathons and bounties. It scans open online opportunities, ranks near-deadline work, flags blockers, and prepares submission checklists before any public action.

Built with [Bolt for JavaScript](https://docs.slack.dev/tools/bolt-js/), [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/), and the [Slack MCP Server](https://github.com/slackapi/slack-mcp-server) integration path from Slack's starter agent template.

## Hackathon Target

Primary submission target: [Slack Agent Builder Challenge](https://slackhack.devpost.com/)

- Deadline: 2026-07-13 17:00 PDT / 2026-07-14 08:00 Asia/Shanghai
- Cash pool: USD 42,000
- Track: New Slack Agent
- Required assets: text description, architecture diagram, public demo video under 3 minutes, Slack developer sandbox URL, and judge access for `slackhack@salesforce.com` and `testing@devpost.com`.

Backup target: [Global AI Hackathon Series with Qwen Cloud](https://qwencloud-hackathon.devpost.com/)

- Deadline: 2026-07-20 14:00 PDT / 2026-07-21 05:00 Asia/Shanghai
- Cash pool: USD 45,000
- Reuse path: submit as an Autopilot Agent after adding Qwen Cloud deployment proof.

## App Overview

BountyOps interacts with users through four entry points:

- **App Home** - Displays the BountyOps workflow and approval guardrails.
- **Direct Messages** - Users ask for urgent cash scans, rankings, and submission checklists.
- **Channel mentions** - Mention the agent in a team channel to triage opportunities in context.
- **Assistant Panel** - Users pick suggested prompts such as "Scan urgent cash hackathons".

BountyOps includes:

- `scan_cash_hackathons` - scans Devpost open online hackathons, parses deadlines and cash prizes, filters low-value or risky work, and applies known rule notes.
- `add_emoji_reaction` - acknowledges Slack messages.

## Guardrails

BountyOps can prepare work locally, but it does not submit, post, push public repos, sign wallet messages, pay, trade, or change accounts without explicit human approval.

## Submission Materials

- Shortlist: [`docs/hackathon-shortlist-2026-07-09.md`](docs/hackathon-shortlist-2026-07-09.md)
- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Uploadable architecture diagram: [`docs/architecture.svg`](docs/architecture.svg)
- Demo script: [`docs/demo-script.md`](docs/demo-script.md)
- Submission checklist: [`docs/submission-checklist.md`](docs/submission-checklist.md)
- Devpost draft: [`docs/devpost-submission-draft.md`](docs/devpost-submission-draft.md)

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
- `agent/tools/opportunity-scout.js` - Devpost scanner and ranking logic.
- `listeners/` - Slack event, action, and view handlers.
- `thread-context/` - In-memory Slack thread history.

## Notes

The Devpost scanner uses the open online hackathon API and rule notes manually checked on 2026-07-09. Re-check rules before any final submission.
