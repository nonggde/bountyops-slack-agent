/**
 * Build the App Home Block Kit view.
 * @param {string | null} [installUrl] - OAuth install URL shown when MCP is disconnected.
 * @param {boolean} [isConnected] - Whether the Slack MCP Server is connected.
 * @returns {import('@slack/types').HomeView}
 */
export function buildAppHomeView(installUrl = null, isConnected = false) {
  /** @type {import('@slack/types').KnownBlock[]} */
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'BountyOps Agent',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          'I scan cash-backed hackathons and bounties, rank near-deadline work, ' +
          'and use DataHub context to investigate data quality risks before any write action.\n\n' +
          'Ask me to *scan urgent cash hackathons*, *review DataHub assets*, or *draft a remediation plan*.',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '*Default guardrails:* no posting, submitting, wallet signing, account changes, paid cloud spend, ' +
          'or public repo pushes without explicit human approval.',
      },
    },
    { type: 'divider' },
  ];

  if (isConnected) {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Slack MCP Server is connected.*',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'The agent can search team context and prepare Slack-native updates when asked.',
          },
        ],
      },
    );
  } else if (installUrl) {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Slack MCP Server is disconnected.* <${installUrl}|Connect the Slack MCP Server.>`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'The Slack MCP Server enables channel search, history reads, and canvas workflows.',
          },
        ],
      },
    );
  } else {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Slack MCP Server is disconnected.* <https://github.com/slack-samples/bolt-js-starter-agent/blob/main/openai-agents-sdk/README.md#slack-mcp-server|Learn how to enable the Slack MCP Server.>',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'The Slack MCP Server enables channel search, history reads, and canvas workflows.',
          },
        ],
      },
    );
  }

  return { type: 'home', blocks };
}
