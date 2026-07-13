import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveModelConfig } from '../../agent/provider.js';

describe('model provider configuration', () => {
  it('prefers explicit Qwen Cloud settings', () => {
    const config = resolveModelConfig({
      QWEN_API_KEY: 'test-key',
      QWEN_BASE_URL: 'https://example.invalid/v1',
      QWEN_MODEL: 'qwen-plus',
      OPENAI_API_KEY: 'fallback-key',
    });
    assert.equal(config.provider, 'qwen-cloud');
    assert.equal(config.model, 'qwen-plus');
    assert.equal(config.baseURL, 'https://example.invalid/v1');
  });

  it('rejects partial Qwen configuration instead of silently falling back', () => {
    assert.throws(() => resolveModelConfig({ QWEN_MODEL: 'qwen-plus' }), /QWEN_API_KEY and QWEN_BASE_URL/);
  });
});
