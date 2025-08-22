export interface McpConfig {
  id: string;
  name: string;
  config: {
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
    timeout?: number;
    disabled?: boolean;
    description?: string;
    serverUrl?: string;
    apiKey?: string;
    capabilities?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMcpConfigRequest {
  name: string;
  config: McpConfig['config'];
}

export interface UpdateMcpConfigRequest extends CreateMcpConfigRequest {
  id: string;
}
