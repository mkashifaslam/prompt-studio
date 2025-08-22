import React from 'react';
import { Prompt } from './types';
import { Box, Typography } from '@mui/material';

interface Props {
  prompt: Prompt;
}

export default function PromptDetail({ prompt }: Props) {
  return (
    <Box>
      <Typography variant="h5">{prompt.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">ID: {prompt.id}</Typography>
      <Typography variant="body1" mt={2}>{prompt.content}</Typography>
      <Typography variant="body2" mt={2}>Active: {prompt.active ? 'Yes' : 'No'}</Typography>
      {prompt.variables && <Typography variant="body2">Variables: {prompt.variables.join(', ')}</Typography>}
      {prompt.metadata && <Typography variant="body2">Metadata: {JSON.stringify(prompt.metadata)}</Typography>}
      {prompt.version && <Typography variant="body2">Version: {prompt.version}</Typography>}
      {prompt.createdAt && <Typography variant="body2">Created: {prompt.createdAt}</Typography>}
      {prompt.updatedAt && <Typography variant="body2">Updated: {prompt.updatedAt}</Typography>}
    </Box>
  );
}
