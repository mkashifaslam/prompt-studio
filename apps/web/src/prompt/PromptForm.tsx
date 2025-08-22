import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Prompt } from './types';

interface Props {
  prompt?: Prompt;
  onSave: (data: Partial<Prompt>) => void;
  onCancel: () => void;
}

export default function PromptForm({ prompt, onSave, onCancel }: Props) {
  const [name, setName] = useState(prompt?.name || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [active, setActive] = useState(prompt?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...prompt, name, content, active });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" mb={2}>{prompt ? 'Edit Prompt' : 'Create Prompt'}</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        minRows={3}
      />
      <FormControlLabel
        control={<Checkbox checked={active} onChange={e => setActive(e.target.checked)} />}
        label="Active"
      />
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}
