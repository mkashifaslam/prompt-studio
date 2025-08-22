import * as React from 'react';
import {useState} from 'react';
import PromptList from './PromptList';
import PromptForm from './PromptForm';
import {Prompt} from './types';
import {API_BASE_URL} from './api';

export default function PromptCrud() {
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (prompt: Prompt) => {
    setEditing(prompt);
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
  const handleSave = async (data: Partial<Prompt>) => {
    if (editing) {
      // Update
      await fetch(`${API_BASE_URL}/prompts/${editing.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    } else {
      // Create
      await fetch(`${API_BASE_URL}/prompts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    }
    setEditing(null);
    setCreating(false);
    setRefreshKey(k => k + 1);
  };
  const handleDelete = async (prompt: Prompt) => {
    if (window.confirm(`Delete prompt "${prompt.name}"?`)) {
      await fetch(`${API_BASE_URL}/prompts/${prompt.id}`, {method: 'DELETE'});
      setRefreshKey(k => k + 1);
    }
  };

  if (editing || creating) {
    return <PromptForm prompt={editing || undefined} onSave={handleSave} onCancel={handleCancel}/>;
  }
  return <PromptList onEdit={handleEdit} onCreate={handleCreate} onDelete={handleDelete} refreshKey={refreshKey}/>;
}
