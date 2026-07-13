import { MCPServerStdio } from '@openai/agents';

const READ_ONLY_DATAHUB_TOOLS = [
  'search',
  'get_lineage',
  'get_dataset_queries',
  'get_entities',
  'list_schema_fields',
  'get_lineage_paths_between',
  'search_documents',
  'grep_documents',
];

/**
 * @param {NodeJS.ProcessEnv} [env=process.env]
 */
export function resolveDataHubConfig(env = process.env) {
  const url = env.DATAHUB_GMS_URL?.trim();
  const token = env.DATAHUB_GMS_TOKEN?.trim();
  const enabled = Boolean(url || token);

  if (enabled && (!url || !token)) {
    throw new Error('DataHub mode requires both DATAHUB_GMS_URL and DATAHUB_GMS_TOKEN.');
  }

  return {
    enabled,
    url,
    token,
    command: env.DATAHUB_MCP_COMMAND?.trim() || 'uvx',
    packageName: env.DATAHUB_MCP_PACKAGE?.trim() || 'mcp-server-datahub@latest',
  };
}

/**
 * Create the official DataHub MCP server with a hard read-only tool allowlist.
 * @param {NodeJS.ProcessEnv} [env=process.env]
 */
export function createDataHubMcpServer(env = process.env) {
  const config = resolveDataHubConfig(env);
  if (!config.enabled || !config.url || !config.token) return null;

  /** @type {Record<string, string>} */
  const childEnv = {};
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') childEnv[key] = value;
  }
  childEnv.DATAHUB_GMS_URL = config.url;
  childEnv.DATAHUB_GMS_TOKEN = config.token;
  childEnv.TOOLS_IS_MUTATION_ENABLED = 'false';
  childEnv.TOOLS_IS_USER_ENABLED = 'false';

  return new MCPServerStdio({
    name: 'DataHub MCP Server',
    command: config.command,
    args: [config.packageName],
    env: childEnv,
    cacheToolsList: true,
    toolFilter: { allowedToolNames: READ_ONLY_DATAHUB_TOOLS },
    clientSessionTimeoutSeconds: 20,
  });
}
