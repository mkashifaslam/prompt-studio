export interface McpConfig {
  id: string;
  name: string;
  config: {
    name: string;
    description?: string;
    disabled?: boolean;
    transport?: "stdio" | "sse" | "websocket";
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
    timeout?: number;
    baseUrl?: string;
    apiKey?: string;
    capabilities?: string[];
    tools?: Array<{
      name: string;
      description?: string;
      inputSchema?: any;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMcpConfigRequest {
  name: string;
  config: McpConfig["config"];
}

export interface UpdateMcpConfigRequest extends CreateMcpConfigRequest {
  id: string;
}
