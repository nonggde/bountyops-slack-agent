import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'LICENSE',
  'NOTICE',
  'manifest.json',
  'agent/agent.js',
  'agent/datahub.js',
  'agent/tools/datahub-quality.js',
  'agent/tools/opportunity-scout.js',
  'agent/tools/submission-plan.js',
  'docs/hackathon-shortlist-2026-07-09.md',
  'docs/submission-checklist.md',
  'docs/devpost-submission-draft.md',
  'docs/demo-script.md',
  'docs/architecture.md',
  'docs/architecture.svg',
  'docs/qwen-cloud-submission.md',
  'docs/qwen-architecture.md',
  'docs/qwen-architecture.svg',
  'docs/qwen-demo-script.md',
  'docs/qwen-devpost-story.md',
  'scripts/verify-qwen-cloud.mjs',
  'docs/datahub-architecture.md',
  'docs/datahub-architecture.svg',
  'docs/datahub-submission.md',
  'docs/datahub-demo-script.md',
  'examples/datahub-remediation-plan.json',
];

const publicScanFiles = [
  'README.md',
  '.env.sample',
  'manifest.json',
  'agent/agent.js',
  'agent/tools/opportunity-scout.js',
  'agent/tools/submission-plan.js',
  'agent/datahub.js',
  'agent/tools/datahub-quality.js',
  'docs/hackathon-shortlist-2026-07-09.md',
  'docs/submission-checklist.md',
  'docs/devpost-submission-draft.md',
  'docs/demo-script.md',
  'docs/architecture.md',
  'docs/architecture.svg',
  'docs/qwen-cloud-submission.md',
  'docs/qwen-architecture.md',
  'docs/qwen-architecture.svg',
  'docs/qwen-demo-script.md',
  'docs/qwen-devpost-story.md',
  'scripts/verify-qwen-cloud.mjs',
  'docs/datahub-architecture.md',
  'docs/datahub-architecture.svg',
  'docs/datahub-submission.md',
  'docs/datahub-demo-script.md',
  'examples/datahub-remediation-plan.json',
];

const requiredReadmeLinks = [
  'docs/architecture.svg',
  'docs/submission-checklist.md',
  'docs/devpost-submission-draft.md',
  'docs/demo-script.md',
  'docs/qwen-cloud-submission.md',
  'docs/qwen-architecture.svg',
  'docs/qwen-demo-script.md',
  'docs/qwen-devpost-story.md',
  'docs/datahub-architecture.svg',
  'docs/datahub-submission.md',
  'docs/datahub-demo-script.md',
  'examples/datahub-remediation-plan.json',
];

const forbiddenPatterns = [
  { name: 'OpenAI-style API key', pattern: /sk-[A-Za-z0-9_-]{12,}/ },
  { name: 'Slack token', pattern: /xox[baprs]-[A-Za-z0-9-]+/ },
  { name: 'User gateway URL', pattern: /z30\.top/i },
  { name: 'Filled Slack client secret', pattern: /SLACK_CLIENT_SECRET=(?!YOUR_)[A-Za-z0-9_-]{20,}/ },
  { name: 'Filled DataHub token', pattern: /DATAHUB_GMS_TOKEN=(?!YOUR_)[A-Za-z0-9_.-]{12,}/ },
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`OK: ${message}`);
}

for (const file of requiredFiles) {
  const path = join(root, file);
  if (!existsSync(path)) {
    fail(`missing required file ${file}`);
    continue;
  }
  if (statSync(path).size === 0) {
    fail(`empty required file ${file}`);
    continue;
  }
  pass(`required file exists: ${file}`);
}

const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');
if (!gitignore.includes('.env*')) {
  fail('.gitignore does not exclude .env*');
} else if (!gitignore.includes('!.env.sample')) {
  fail('.gitignore does not keep .env.sample');
} else {
  pass('.env files are ignored while .env.sample remains public');
}

const slackGitignore = readFileSync(join(root, '.slack/.gitignore'), 'utf8');
for (const ignored of ['apps.dev.json', 'apps.json', 'cache/']) {
  if (!slackGitignore.includes(ignored)) fail(`.slack/.gitignore does not ignore ${ignored}`);
}
if (process.exitCode !== 1) pass('.slack local install metadata is ignored');

const readme = readFileSync(join(root, 'README.md'), 'utf8');
for (const link of requiredReadmeLinks) {
  if (!readme.includes(link)) fail(`README is missing link to ${link}`);
}
if (process.exitCode !== 1) pass('README links the submission artifacts');

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const license = readFileSync(join(root, 'LICENSE'), 'utf8');
if (packageJson.license !== 'Apache-2.0' || !license.includes('Apache License')) {
  fail('Apache 2.0 license is not configured');
} else {
  pass('Apache 2.0 license is configured');
}

for (const file of publicScanFiles) {
  const text = readFileSync(join(root, file), 'utf8');
  for (const forbidden of forbiddenPatterns) {
    if (forbidden.pattern.test(text)) {
      fail(`${file} contains forbidden pattern: ${forbidden.name}`);
    }
  }
}
if (process.exitCode !== 1) pass('public submission files passed sensitive-data scan');

if (process.exitCode) {
  process.exit(process.exitCode);
}
