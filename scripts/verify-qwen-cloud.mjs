import 'dotenv/config';

async function main() {
  const required = ['QWEN_API_KEY', 'QWEN_BASE_URL', 'QWEN_MODEL'];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(`FAIL: missing Qwen Cloud configuration: ${missing.join(', ')}`);
    return 1;
  }

  const baseUrl = process.env.QWEN_BASE_URL.replace(/\/$/, '');
  const model = process.env.QWEN_MODEL;

  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with exactly QWEN_OK' }],
        max_tokens: 8,
        temperature: 0,
      }),
    });
  } catch (error) {
    console.error(`FAIL: Qwen Cloud request failed: ${error instanceof Error ? error.message : 'network error'}`);
    return 1;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = String(payload?.error?.message || payload?.message || 'unknown API error')
      .replace(/sk-[A-Za-z0-9._-]+/g, '[REDACTED]')
      .slice(0, 240);

    if (response.status === 403 && /eligible|access|denied/i.test(message)) {
      console.error(`PENDING: Qwen Cloud model access is not approved yet (${response.status}).`);
      return 2;
    }

    console.error(`FAIL: Qwen Cloud returned ${response.status}: ${message}`);
    return 1;
  }

  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (reply !== 'QWEN_OK') {
    console.error('FAIL: Qwen Cloud returned an unexpected verification response.');
    return 1;
  }

  console.log(`OK: live Qwen Cloud inference passed with ${model}.`);
  return 0;
}

process.exitCode = await main();
