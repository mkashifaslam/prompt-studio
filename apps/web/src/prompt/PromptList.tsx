import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Fab,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Visibility as ViewIcon} from '@mui/icons-material';
import {Prompt} from './types';
import {API_BASE_URL} from './api';

interface Props {
  onEdit: (prompt: Prompt) => void;
  onView: (prompt: Prompt) => void;
  onCreate: () => void;
  onDelete: (prompt: Prompt) => void;
  refreshKey: number;
}

export default function PromptList({onEdit, onView, onCreate, onDelete, refreshKey}: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/prompts`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch prompts');
        return res.json();
      })
      .then(setPrompts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleDeleteClick = (prompt: Prompt) => {
    if (window.confirm(`Are you sure you want to delete "${prompt.name}"? This action cannot be undone.`)) {
      onDelete(prompt);
    }
  };

  if (loading) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={200} height={40}/>
          <Skeleton variant="rectangular" width={140} height={40}/>
        </Box>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={60} sx={{mb: 1}}/>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  // Mobile Card Layout
  if (isMobile) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Prompts
          </Typography>
        </Box>

        {prompts.length === 0 ? (
          <Paper sx={{p: 4, textAlign: 'center'}}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No prompts found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your first prompt to get started
            </Typography>
            <Button variant="contained" startIcon={<AddIcon/>} onClick={onCreate}>
              Create Prompt
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {prompts.map(prompt => (
              <Grid key={prompt.id} xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h2" fontWeight="medium">
                        {prompt.name}
                      </Typography>
                      <Chip
                        label={prompt.active ? 'Active' : 'Inactive'}
                        color={prompt.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Version: {prompt.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(prompt.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                      {prompt.variables && prompt.variables.length > 0 ? (
                        prompt.variables.slice(0, 3).map((variable) => (
                          <Chip
                            key={variable.key}
                            label={`{{${variable.key}}}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{fontSize: '0.65rem'}}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No variables
                        </Typography>
                      )}
                      {prompt.variables && prompt.variables.length > 3 && (
                        <Chip
                          label={`+${prompt.variables.length - 3} more`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{fontSize: '0.65rem'}}
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{justifyContent: 'flex-end', px: 2, pb: 2}}>
                    <Tooltip title="View prompt">
                      <IconButton
                        size="small"
                        onClick={() => onView(prompt)}
                        aria-label={`View ${prompt.name}`}
                      >
                        <ViewIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit prompt">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(prompt)}
                        aria-label={`Edit ${prompt.name}`}
                      >
                        <EditIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete prompt">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(prompt)}
                        aria-label={`Delete ${prompt.name}`}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Fab
          color="primary"
          aria-label="Create new prompt"
          onClick={onCreate}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon/>
        </Fab>
      </Box>
    );
  }

  // Desktop Table Layout
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Prompts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          onClick={onCreate}
          size="large"
        >
          Create Prompt
        </Button>
      </Box>

      {prompts.length === 0 ? (
        <Paper sx={{p: 4, textAlign: 'center'}}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No prompts found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Create your first prompt to get started
          </Typography>
          <Button variant="contained" startIcon={<AddIcon/>} onClick={onCreate}>
            Create Prompt
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{minWidth: 650}} aria-label="prompts table">
            <TableHead>
              <TableRow sx={{backgroundColor: 'grey.50'}}>
                <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Version</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Variables</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Created</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prompts.map(prompt => (
                <TableRow
                  key={prompt.id}
                  hover
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                      {prompt.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {prompt.version}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {prompt.variables && prompt.variables.length > 0 ? (
                        prompt.variables.map((variable, index) => (
                          <Chip
                            key={variable.key}
                            label={`{{${variable.key}}}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{fontSize: '0.7rem'}}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No variables
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={prompt.active ? 'Active' : 'Inactive'}
                      color={prompt.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(prompt.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <Tooltip title="View prompt">
                        <IconButton
                          size="small"
                          onClick={() => onView(prompt)}
                          aria-label={`View ${prompt.name}`}
                        >
                          <ViewIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit prompt">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(prompt)}
                          aria-label={`Edit ${prompt.name}`}
                        >
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete prompt">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(prompt)}
                          aria-label={`Delete ${prompt.name}`}
                        >
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
