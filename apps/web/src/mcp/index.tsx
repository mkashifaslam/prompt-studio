import * as React from 'react';
import {useState} from 'react';
import McpConfigList from './McpConfigList';
import McpConfigForm from './McpConfigForm';
import {McpConfig} from './types';
import {mcpApi} from './api';

export default function McpManagement() {
  const [editing, setEditing] = useState<McpConfig | null>(null);
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (config: McpConfig) => {
    setEditing(config);
    setCreating(false);
  };

  const handleCreate = () => {
    setEditing(null);
    setCreating(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSave = async (data: Partial<McpConfig>) => {
    try {
      if (editing) {
        // Update existing config
        await mcpApi.update(data.name!, data.config);
      } else {
        // Create new config
        await mcpApi.create(data.name!, data.config);
      }
      setEditing(null);
      setCreating(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error saving MCP config:', error);
      throw error;
    }
  };

  const handleDelete = async (config: McpConfig) => {
    try {
      await mcpApi.delete(config.id);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error deleting MCP config:', error);
    }
  };

  if (editing || creating) {
    return (
      <McpConfigForm
        config={editing || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <McpConfigList
      onEdit={handleEdit}
      onCreate={handleCreate}
      onDelete={handleDelete}
      refreshKey={refreshKey}
    />
  );
}
