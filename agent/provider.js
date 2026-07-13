import { OpenAIProvider } from '@openai/agents';

/**
 * Resolve the active OpenAI-compatible model provider without exposing secrets.
 * Qwen variables take precedence so the hackathon deployment cannot silently
 * fall back to a different model provider.
 * @param {NodeJS.ProcessEnv} [env=process.env]
 */
export function resolveModelConfig(env = process.env) {
  const isQwen = Boolean(env.QWEN_API_KEY || env.QWEN_BASE_URL || env.QWEN_MODEL);
  const apiKey = isQwen ? env.QWEN_API_KEY : env.OPENAI_API_KEY;
  const baseURL = isQwen ? env.QWEN_BASE_URL : env.OPENAI_BASE_URL;
  const model = isQwen ? env.QWEN_MODEL || 'qwen-plus' : env.OPENAI_MODEL || 'gpt-4.1-mini';
  /** @type {'responses' | 'chat_completions'} */
  const apiMode = env.OPENAI_API_MODE === 'responses' ? 'responses' : 'chat_completions';

  if (isQwen && (!apiKey || !baseURL)) {
    throw new Error('Qwen mode requires both QWEN_API_KEY and QWEN_BASE_URL.');
  }

  return { apiKey, baseURL, model, apiMode, provider: isQwen ? 'qwen-cloud' : 'openai-compatible' };
}

export function configureModelProvider(env = process.env) {
  const config = resolveModelConfig(env);
  const modelProvider = new OpenAIProvider({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    useResponses: config.apiMode === 'responses',
  });
  return { ...config, modelProvider };
}
