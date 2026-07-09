import { AgentDeps, runAgent } from '../../agent/index.js';
import { conversationStore } from '../../thread-context/index.js';
import { buildFeedbackBlocks } from '../views/feedback-builder.js';

/**
 * Handle app_mention events and run the agent.
 * @param {import('@slack/bolt').AllMiddlewareArgs & import('@slack/bolt').SlackEventMiddlewareArgs<'app_mention'>} args
 * @returns {Promise<void>}
 */
export async function handleAppMentioned({ client, context, event, logger, say, sayStream, setStatus }) {
  try {
    const channelId = event.channel;
    const text = event.text || '';
    const threadTs = event.thread_ts || event.ts;
    const userId = /** @type {string} */ (context.userId);
    const cleanedText = text.replace(/<@[A-Z0-9]+>/g, '').trim();

    if (!cleanedText) {
      await say({
        text: 'Ask me to scan urgent cash hackathons, rank bounty targets, or prepare a submission checklist.',
        thread_ts: threadTs,
      });
      return;
    }

    await setStatus({
      status: 'Thinking...',
      loading_messages: [
        'Checking deadlines and cash pools...',
        'Scoring eligibility risks...',
        'Building the shortlist...',
        'Preparing the next action...',
      ],
    });

    const history = conversationStore.getHistory(channelId, threadTs);
    /** @type {string | import('@openai/agents').AgentInputItem[]} */
    const inputItems = history ? [...history, { role: 'user', content: cleanedText }] : cleanedText;

    const deps = new AgentDeps(client, userId, channelId, threadTs, event.ts, context.userToken);
    const result = await runAgent(inputItems, deps);

    const streamer = sayStream();
    await streamer.append({ markdown_text: result.finalOutput });
    const feedbackBlocks = buildFeedbackBlocks();
    await streamer.stop({ blocks: feedbackBlocks });

    conversationStore.setHistory(channelId, threadTs, result.history);
  } catch (e) {
    logger.error(`Failed to handle app mention: ${e}`);
    await say({
      text: `:warning: Something went wrong. (${e})`,
      thread_ts: event.thread_ts || event.ts,
    });
  }
}
