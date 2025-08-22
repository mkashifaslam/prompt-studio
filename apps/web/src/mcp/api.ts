import {API_BASE_URL} from '../prompt/api';

export const MCP_API_BASE_URL = `${API_BASE_URL}/mcp`;

export const mcpApi = {
  list: async () => {
    const response = await fetch(MCP_API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch MCP configs');
    return response.json();
  },

  get: async (id: string) => {
    const response = await fetch(`${MCP_API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch MCP config');
    return response.json();
  },

  create: async (name: string, config: any) => {
    const response = await fetch(`${MCP_API_BASE_URL}/${name}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...config,
        name,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create MCP config: ${response.status} ${errorText}`);
    }
    return response.json();
  },

  update: async (name: string, config: any) => {
    const response = await fetch(`${MCP_API_BASE_URL}/${name}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...config,
        name,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update MCP config: ${response.status} ${errorText}`);
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${MCP_API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete MCP config');
    return response.ok;
  },
};
