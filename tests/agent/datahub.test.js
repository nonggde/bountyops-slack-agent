import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createDataHubMcpServer, resolveDataHubConfig } from '../../agent/datahub.js';

describe('DataHub MCP configuration', () => {
  it('stays disabled when no DataHub variables are present', () => {
    assert.equal(resolveDataHubConfig({}).enabled, false);
  });

  it('requires URL and token together', () => {
    assert.throws(() => resolveDataHubConfig({ DATAHUB_GMS_URL: 'http://localhost:8080' }), /URL and.*TOKEN/i);
  });

  it('uses the official MCP package by default', () => {
    const config = resolveDataHubConfig({
      DATAHUB_GMS_URL: 'http://localhost:8080',
      DATAHUB_GMS_TOKEN: 'test-token',
    });
    assert.equal(config.enabled, true);
    assert.equal(config.command, 'uvx');
    assert.equal(config.packageName, 'mcp-server-datahub@latest');
  });

  it('exposes read-only DataHub MCP tools', () => {
    const server = createDataHubMcpServer({
      DATAHUB_GMS_URL: 'http://localhost:8080',
      DATAHUB_GMS_TOKEN: 'test-token',
    });
    assert.ok(server);
    assert.ok(server.toolFilter.allowedToolNames.includes('search'));
    assert.equal(server.toolFilter.allowedToolNames.includes('add_tags'), false);
    assert.equal(server.toolFilter.allowedToolNames.includes('update_description'), false);
  });
});
