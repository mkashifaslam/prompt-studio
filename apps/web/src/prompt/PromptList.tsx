import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import {Prompt} from './types';
import {API_BASE_URL} from './api';

interface Props {
  onEdit: (prompt: Prompt) => void;
  onCreate: () => void;
  onDelete: (prompt: Prompt) => void;
  refreshKey: number;
}

export default function PromptList({onEdit, onCreate, onDelete, refreshKey}: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/prompts`)
      .then(res => res.json())
      .then(setPrompts)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Prompts</Typography>
        <Button variant="contained" color="primary" onClick={onCreate}>Create Prompt</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prompts.map(prompt => (
            <TableRow key={prompt.id}>
              <TableCell>{prompt.name}</TableCell>
              <TableCell>{prompt.version}</TableCell>
              <TableCell>{prompt.active ? 'Yes' : 'No'}</TableCell>
              <TableCell>{new Date(prompt.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => onEdit(prompt)}>Edit</Button>
                <Button size="small" color="error" onClick={() => onDelete(prompt)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <Typography>Loading...</Typography>}
    </Box>
  );
}
