import * as React from 'react';
import {useState} from 'react';
import PromptList from './PromptList';
import PromptForm from './PromptForm';
import PromptDetail from './PromptDetail';
import {Prompt} from './types';
import {API_BASE_URL} from './api';

export default function PromptCrud() {
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [viewing, setViewing] = useState<Prompt | null>(null);
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (prompt: Prompt) => {
    setEditing(prompt);
    setViewing(null);
    setCreating(false);
  };

  const handleView = (prompt: Prompt) => {
    setViewing(prompt);
    setEditing(null);
    setCreating(false);
  };

  const handleCreate = () => {
    setEditing(null);
    setViewing(null);
    setCreating(true);
  };
  const handleCancel = () => {
    setEditing(null);
    setViewing(null);
    setCreating(false);
  };
  const handleSave = async (data: Partial<Prompt>) => {
    try {
      if (editing) {
        // Update
        await fetch(`${API_BASE_URL}/prompts/${editing.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        });
      } else {
        // Create
        const response = await fetch(`${API_BASE_URL}/prompts`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create prompt: ${response.status} ${errorText}`);
        }
      }
      setEditing(null);
      setCreating(false);
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error saving prompt:', error);
      // Re-throw the error so the form can handle it
      throw error;
    }
  };
  const handleDelete = async (prompt: Prompt) => {
    try {
      await fetch(`${API_BASE_URL}/prompts/${prompt.id}`, {method: 'DELETE'});
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  if (editing || creating) {
    return (
      <PromptForm
        prompt={editing || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (viewing) {
    return (
      <PromptDetail
        prompt={viewing}
        onEdit={() => handleEdit(viewing)}
        onBack={handleCancel}
      />
    );
  }

  return (
    <PromptList
      onEdit={handleEdit}
      onView={handleView}
      onCreate={handleCreate}
      onDelete={handleDelete}
      refreshKey={refreshKey}
    />
  );
}
