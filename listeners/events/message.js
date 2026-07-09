import { AgentDeps, runAgent } from '../../agent/index.js';
import { conversationStore } from '../../thread-context/index.js';
import { buildFeedbackBlocks } from '../views/feedback-builder.js';

/**
 * @param {import('@slack/types').MessageEvent} event
 * @returns {event is import('@slack/types').GenericMessageEvent}
 */
function isGenericMessageEvent(event) {
  return !('subtype' in event && event.subtype !== undefined);
}

/**
 * Handle messages sent to the agent via DM or in threads the bot is part of.
 * @param {import('@slack/bolt').AllMiddlewareArgs & import('@slack/bolt').SlackEventMiddlewareArgs<'message'>} args
 * @returns {Promise<void>}
 */
export async function handleMessage({ client, context, event, logger, say, sayStream, setStatus }) {
  if (!isGenericMessageEvent(event)) return;
  if (event.bot_id) return;

  const isDm = event.channel_type === 'im';
  const isThreadReply = !!event.thread_ts;

  if (!isDm && isThreadReply) {
    const history = conversationStore.getHistory(event.channel, /** @type {string} */ (event.thread_ts));
    if (history === null) return;
  } else if (!isDm) {
    return;
  }

  try {
    const channelId = event.channel;
    const text = event.text || '';
    const threadTs = event.thread_ts || event.ts;
    const userId = /** @type {string} */ (context.userId);
    const history = conversationStore.getHistory(channelId, threadTs);

    await setStatus({
      status: 'Thinking...',
      loading_messages: [
        'Checking deadlines and cash pools...',
        'Scoring eligibility risks...',
        'Building the shortlist...',
        'Preparing the next action...',
      ],
    });

    /** @type {string | import('@openai/agents').AgentInputItem[]} */
    const inputItems = history ? [...history, { role: 'user', content: text }] : text;

    const deps = new AgentDeps(client, userId, channelId, threadTs, event.ts, context.userToken);
    const result = await runAgent(inputItems, deps);

    const streamer = sayStream();
    await streamer.append({ markdown_text: result.finalOutput });
    const feedbackBlocks = buildFeedbackBlocks();
    await streamer.stop({ blocks: feedbackBlocks });

    conversationStore.setHistory(channelId, threadTs, result.history);
  } catch (e) {
    logger.error(`Failed to handle message: ${e}`);
    await say({
      text: `:warning: Something went wrong. (${e})`,
      thread_ts: event.thread_ts || event.ts,
    });
  }
}
