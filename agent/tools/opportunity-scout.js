import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tool } from '@openai/agents';
import { z } from 'zod';

const DEVPOST_API_BASE = 'https://devpost.com/api/hackathons?challenge_type=online&status=open&sort_by=deadline';
const execFileAsync = promisify(execFile);

/** @type {Record<string, { scoreBoost: number, status: string, deadline: string, reason: string, required: string, risk: string }>} */
const KNOWN_RULE_NOTES = {
  'Slack Agent Builder Challenge': {
    scoreBoost: 30,
    status: 'do_first',
    deadline: '2026-07-13 17:00 PDT / 2026-07-14 08:00 Asia/Shanghai',
    reason:
      'Strong fit: close deadline, $42k cash pool, agent-native prompt, Slack MCP Server integration, and a required Slack sandbox URL.',
    required:
      'Text description, architecture diagram, public demo video under 3 minutes, Slack developer sandbox URL, and judge access for slackhack@salesforce.com and testing@devpost.com.',
    risk: 'Needs Devpost join, Slack Developer Program sandbox, Slack app install, and API credentials before final submission.',
  },
  'Global AI Hackathon Series with Qwen Cloud': {
    scoreBoost: 18,
    status: 'do_second',
    deadline: '2026-07-20 14:00 PDT / 2026-07-21 05:00 Asia/Shanghai',
    reason:
      'Strong second target: $45k cash pool, agent tracks, public repo requirement, and enough time to reuse this project as an Autopilot Agent.',
    required:
      'Public open-source repo, Qwen Cloud usage, Alibaba Cloud deployment proof, architecture diagram, and public demo video around 3 minutes.',
    risk: 'Needs Qwen Cloud signup, Alibaba Cloud deployment evidence, and cloud/API credentials before submission.',
  },
  'Reddit Games with a Hook Hackathon': {
    scoreBoost: 8,
    status: 'backup',
    deadline: '2026-07-15 18:00 PDT / 2026-07-16 09:00 Asia/Shanghai',
    reason: 'Large $40k cash pool and close deadline, but it is a Devvit game contest rather than an agent contest.',
    required: 'Devvit app listing and a public Reddit demo post running the game.',
    risk: 'Needs Reddit/Devvit publishing and a polished game loop; not aligned with the current Slack agent codebase.',
  },
  'Kaya AI India Hackathon 2026': {
    scoreBoost: -80,
    status: 'skip',
    deadline: '2026-07-11 09:15 IST / 2026-07-11 11:45 Asia/Shanghai',
    reason: 'Very close and cash-backed, but solo submissions are not accepted and finalists go to Bangalore.',
    required: 'Teams of 2-4, video, slide deck, construction-domain project, and later live final path.',
    risk: 'High eligibility/logistics risk for a solo remote agent workflow.',
  },
};

/**
 * @param {string} title
 * @returns {{ scoreBoost: number, status: string, deadline: string, reason: string, required: string, risk: string } | null}
 */
function getKnownRuleNote(title) {
  const direct = KNOWN_RULE_NOTES[title] || KNOWN_RULE_NOTES[title.trim()];
  if (direct) return direct;
  if (title.includes('Reddit') && title.includes('Games with a Hook')) {
    return KNOWN_RULE_NOTES['Reddit Games with a Hook Hackathon'];
  }
  return null;
}

/**
 * @param {string | undefined} html
 * @returns {string}
 */
export function cleanPrize(html) {
  return (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} prize
 * @returns {number | null}
 */
export function parseUsdPrize(prize) {
  const match = prize.match(/\$\s*([\d,]+)/);
  if (!match) return null;
  return Number.parseInt(match[1].replace(/,/g, ''), 10);
}

/**
 * @param {string | undefined} dateRange
 * @returns {Date | null}
 */
export function parseSubmissionEndDate(dateRange) {
  const match = (dateRange || '').match(/-\s*([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;

  const [, rawMonth, day, year] = match;
  const month = rawMonth === 'Sept' ? 'Sep' : rawMonth;
  const parsed = Date.parse(`${month} ${day}, ${year} 23:59:59 UTC`);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

/**
 * @param {Date | null} endDate
 * @param {Date} now
 * @returns {number | null}
 */
export function daysUntil(endDate, now = new Date()) {
  if (!endDate) return null;
  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / 86_400_000);
}

/**
 * @param {any[]} hackathons
 * @param {{ maxDays?: number, minCashUsd?: number, now?: Date, includeSmallPrizes?: boolean }} options
 * @returns {any[]}
 */
export function rankDevpostHackathons(hackathons, options = {}) {
  const maxDays = options.maxDays ?? 14;
  const minCashUsd = options.minCashUsd ?? 500;
  const now = options.now ?? new Date();
  const includeSmallPrizes = options.includeSmallPrizes ?? false;

  return hackathons
    .map((item) => {
      const title = item.title || 'Untitled hackathon';
      const prize = cleanPrize(item.prize_amount);
      const usdPrize = parseUsdPrize(prize);
      const endDate = parseSubmissionEndDate(item.submission_period_dates);
      const days = daysUntil(endDate, now);
      const cashPrizeCount = item.prizes_counts?.cash || 0;
      const ruleNote = getKnownRuleNote(title);
      const registrations = item.registrations_count || 0;
      /** @type {Array<{ name: string }>} */
      const themeItems = Array.isArray(item.themes) ? item.themes : [];
      const themes = themeItems.map((theme) => theme.name).join(', ');
      const smallPrize = usdPrize !== null && usdPrize < minCashUsd;
      const tooFar = days !== null && days > maxDays;
      const expired = days !== null && days < 0;
      const noCash = cashPrizeCount <= 0;
      const inviteOnly = Boolean(item.invite_only);
      const nonUsdPrize = usdPrize === null && !/\b(USD|USDC|USDT)\b/i.test(prize);

      let score = 0;
      score += usdPrize ? Math.min(40, Math.log10(usdPrize) * 10) : 8;
      score += days === null ? 0 : Math.max(0, maxDays - days) * 4;
      score += Math.min(12, Math.log10(registrations + 1) * 3);
      score += ruleNote?.scoreBoost || 0;
      if (/agent|ai|automation|productivity|enterprise/i.test(`${title} ${themes}`)) score += 12;
      if (inviteOnly || noCash || expired || tooFar || nonUsdPrize || (!includeSmallPrizes && smallPrize)) score -= 100;

      const blockers = [];
      if (inviteOnly) blockers.push('invite_only');
      if (noCash) blockers.push('no_cash_prize');
      if (expired) blockers.push('expired_or_closed');
      if (tooFar) blockers.push('outside_requested_window');
      if (nonUsdPrize) blockers.push('non_usd_prize_review');
      if (!includeSmallPrizes && smallPrize) blockers.push('below_min_cash_threshold');
      if (ruleNote?.status === 'skip') blockers.push('manual_skip_rule');

      return {
        title,
        url: item.url,
        organization: item.organization_name,
        dates: item.submission_period_dates,
        deadline: ruleNote?.deadline || (endDate ? endDate.toISOString().slice(0, 10) : 'unknown'),
        timeLeft: item.time_left_to_submission,
        prize,
        usdPrize,
        cashPrizeCount,
        registrations,
        themes,
        fitStatus: ruleNote?.status || (blockers.length === 0 ? 'candidate' : 'filtered'),
        ruleReason: ruleNote?.reason || null,
        requiredSubmissionAssets: ruleNote?.required || null,
        risk: ruleNote?.risk || null,
        blockers,
        score: Math.round(score),
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score));
}

/**
 * @param {number} page
 * @returns {Promise<any[]>}
 */
async function fetchDevpostPage(page) {
  const url = `${DEVPOST_API_BASE}&page=${page}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'BountyOps Slack Agent/0.1' },
  });

  const text = await response.text();
  if (response.ok && text.trim()) {
    const data = JSON.parse(text);
    return data.hackathons || [];
  }

  return fetchDevpostPageWithPowerShell(url, response.status);
}

/**
 * Devpost sometimes returns an empty 202 response to Node HTTP clients while
 * accepting Windows PowerShell/.NET requests. This keeps the local demo usable.
 * @param {string} url
 * @param {number} previousStatus
 * @returns {Promise<any[]>}
 */
async function fetchDevpostPageWithPowerShell(url, previousStatus) {
  const script = [
    "$ProgressPreference='SilentlyContinue'",
    `$r=Invoke-RestMethod -Uri '${url}' -Headers @{ 'User-Agent'='Mozilla/5.0'; 'Accept'='application/json' } -TimeoutSec 20`,
    '[pscustomobject]@{ hackathons=@($r.hackathons) } | ConvertTo-Json -Depth 8',
  ].join('; ');

  try {
    const { stdout } = await execFileAsync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
      {
        timeout: 30_000,
        maxBuffer: 5 * 1024 * 1024,
      },
    );
    const data = JSON.parse(stdout);
    return data.hackathons || [];
  } catch (error) {
    throw new Error(`Devpost API returned ${previousStatus} to Node and fallback failed: ${error}`);
  }
}

export const scanCashHackathons = tool({
  name: 'scan_cash_hackathons',
  description:
    'Scan open online Devpost hackathons and rank the ones that are close to deadline, have cash prizes, and are practical for a small agent-led team.',
  parameters: z.object({
    max_days: z
      .number()
      .int()
      .min(1)
      .max(90)
      .default(14)
      .describe('Only prioritize hackathons ending within this many days.'),
    min_cash_usd: z
      .number()
      .int()
      .min(0)
      .max(1000000)
      .default(500)
      .describe('Filter out USD-denominated hackathons below this cash pool. Non-USD prizes are retained but flagged.'),
    max_pages: z.number().int().min(1).max(10).default(8).describe('Maximum Devpost API pages to scan.'),
    include_filtered: z.boolean().default(false).describe('Whether to include filtered low-value or risky hackathons.'),
  }),
  execute: async ({ max_days, min_cash_usd, max_pages, include_filtered }) => {
    const pages = [];
    for (let page = 1; page <= max_pages; page += 1) {
      const pageItems = await fetchDevpostPage(page);
      if (pageItems.length === 0) break;
      pages.push(...pageItems);
    }

    const ranked = rankDevpostHackathons(pages, {
      maxDays: max_days,
      minCashUsd: min_cash_usd,
      includeSmallPrizes: include_filtered,
    });
    const visible = include_filtered ? ranked : ranked.filter((item) => item.blockers.length === 0);

    return {
      scannedAt: new Date().toISOString(),
      source: DEVPOST_API_BASE,
      ruleNotesCheckedAt: '2026-07-09',
      recommendation: visible[0] || null,
      topCandidates: visible.slice(0, 10),
      filteredExamples: ranked.filter((item) => item.blockers.length > 0).slice(0, 8),
    };
  },
});
