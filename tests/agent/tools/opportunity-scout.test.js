import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  cleanPrize,
  parseSubmissionEndDate,
  parseUsdPrize,
  rankDevpostHackathons,
} from '../../../agent/tools/opportunity-scout.js';

describe('opportunity scout', () => {
  it('cleans and parses USD prize strings from Devpost HTML', () => {
    assert.equal(cleanPrize('$<span data-currency-value>42,000</span>'), '$42,000');
    assert.equal(parseUsdPrize('$42,000'), 42000);
    assert.equal(parseUsdPrize('INR 350,000'), null);
  });

  it('parses submission end dates', () => {
    const date = parseSubmissionEndDate('May 20 - Jul 13, 2026');
    assert.equal(date?.toISOString().slice(0, 10), '2026-07-13');
  });

  it('ranks urgent cash agent-native hackathons ahead of risky or low-value ones', () => {
    const fixtures = [
      {
        title: 'Kaya AI India Hackathon 2026',
        url: 'https://kaya-ai-iit-hackathon-2026.devpost.com/',
        organization_name: 'Kaya',
        submission_period_dates: 'Jun 10 - Jul 10, 2026',
        time_left_to_submission: '2 days left',
        prize_amount: 'INR <span data-currency-value>350,000</span>',
        prizes_counts: { cash: 3 },
        registrations_count: 1000,
        themes: [{ name: 'Machine Learning/AI' }],
      },
      {
        title: 'Slack Agent Builder Challenge',
        url: 'https://slackhack.devpost.com/',
        organization_name: 'Salesforce',
        submission_period_dates: 'May 20 - Jul 13, 2026',
        time_left_to_submission: '5 days left',
        prize_amount: '$<span data-currency-value>42,000</span>',
        prizes_counts: { cash: 9 },
        registrations_count: 3989,
        themes: [{ name: 'Enterprise' }, { name: 'Low/No Code' }],
      },
      {
        title: 'AQX Sports Analytics Data Bowl 2.0',
        url: 'https://aqxanalyticsdata.devpost.com/',
        organization_name: 'James Logan High School',
        submission_period_dates: 'Jun 30 - Jul 10, 2026',
        time_left_to_submission: '1 day left',
        prize_amount: '$<span data-currency-value>50</span>',
        prizes_counts: { cash: 1 },
        registrations_count: 91,
        themes: [{ name: 'Databases' }],
      },
    ];

    const ranked = rankDevpostHackathons(fixtures, {
      maxDays: 14,
      minCashUsd: 500,
      now: new Date('2026-07-09T00:00:00Z'),
    });

    assert.equal(ranked[0].title, 'Slack Agent Builder Challenge');
    assert.equal(ranked[0].fitStatus, 'do_first');
    assert.ok(
      ranked.find((item) => item.title === 'Kaya AI India Hackathon 2026')?.blockers.includes('manual_skip_rule'),
    );
    assert.ok(
      ranked
        .find((item) => item.title === 'AQX Sports Analytics Data Bowl 2.0')
        ?.blockers.includes('below_min_cash_threshold'),
    );
  });
});
