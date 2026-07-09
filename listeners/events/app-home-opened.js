import { buildAppHomeView } from '../views/app-home-builder.js';

const SUGGESTED_PROMPTS = [
  { title: 'Scan Cash Hackathons', message: 'Find cash-backed online hackathons ending in the next 14 days.' },
  { title: 'Pick What To Build', message: 'Rank the top urgent cash opportunities and tell me what to build first.' },
  { title: 'Submission Checklist', message: 'Create a submission checklist for the Slack Agent Builder Challenge.' },
];

/**
 * Handle app_home_opened events. Under agent_view, this event fires for both
 * the Home tab and the Messages tab (the agent DM). Branch on event.tab:
 *   - 'messages' pins suggested prompts to the top of the DM
 *   - 'home' publishes the App Home Block Kit view
 * @param {import('@slack/bolt').AllMiddlewareArgs & import('@slack/bolt').SlackEventMiddlewareArgs<'app_home_opened'>} args
 * @returns {Promise<void>}
 */
export async function handleAppHomeOpened({ client, event, context, logger }) {
  try {
    if (event.tab === 'messages') {
      await client.assistant.threads.setSuggestedPrompts(
        /** @type {import('@slack/web-api').AssistantThreadsSetSuggestedPromptsArguments} */ ({
          channel_id: event.channel,
          title: 'What should BountyOps do next?',
          prompts: SUGGESTED_PROMPTS,
        }),
      );
      return;
    }

    const userId = /** @type {string} */ (context.userId);
    let installUrl = null;
    let isConnected = false;

    if (process.env.SLACK_CLIENT_ID) {
      if (context.userToken) {
        isConnected = true;
      } else if (process.env.SLACK_REDIRECT_URI) {
        const base = new URL(process.env.SLACK_REDIRECT_URI);
        installUrl = `${base.origin}/slack/install`;
      }
    }

    const view = buildAppHomeView(installUrl, isConnected);
    await client.views.publish({ user_id: userId, view });
  } catch (e) {
    logger.error(`Failed to handle app_home_opened: ${e}`);
  }
}
