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
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as EnableIcon,
  Settings as SettingsIcon,
  Stop as DisableIcon
} from '@mui/icons-material';
import {McpConfig} from './types';
import {mcpApi} from './api';

interface Props {
  onEdit: (config: McpConfig) => void;
  onCreate: () => void;
  onDelete: (config: McpConfig) => void;
  refreshKey: number;
}

export default function McpConfigList({onEdit, onCreate, onDelete, refreshKey}: Props) {
  const [configs, setConfigs] = useState<McpConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mcpApi.list();
        setConfigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch MCP configs');
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [refreshKey]);

  const handleDeleteClick = (config: McpConfig) => {
    if (window.confirm(`Are you sure you want to delete MCP config "${config.name}"? This action cannot be undone.`)) {
      onDelete(config);
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
            MCP Servers
          </Typography>
        </Box>

        {configs.length === 0 ? (
          <Paper sx={{p: 4, textAlign: 'center'}}>
            <SettingsIcon sx={{fontSize: 48, color: 'text.secondary', mb: 2}}/>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No MCP servers configured
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your first MCP server configuration to get started
            </Typography>
            <Button variant="contained" startIcon={<AddIcon/>} onClick={onCreate}>
              Add MCP Server
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {configs.map(config => (
              <Grid key={config.id} xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h2" fontWeight="medium">
                        {config.name}
                      </Typography>
                      <Chip
                        label={config.config.disabled ? 'Disabled' : 'Enabled'}
                        color={config.config.disabled ? 'error' : 'success'}
                        size="small"
                        icon={config.config.disabled ? <DisableIcon/> : <EnableIcon/>}
                      />
                    </Box>
                    {config.config.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {config.config.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(config.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{justifyContent: 'flex-end', px: 2, pb: 2}}>
                    <Tooltip title="Edit configuration">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(config)}
                        aria-label={`Edit ${config.name}`}
                      >
                        <EditIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete configuration">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(config)}
                        aria-label={`Delete ${config.name}`}
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
          aria-label="Add MCP server"
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
          MCP Server Configurations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          onClick={onCreate}
          size="large"
        >
          Add MCP Server
        </Button>
      </Box>

      {configs.length === 0 ? (
        <Paper sx={{p: 4, textAlign: 'center'}}>
          <SettingsIcon sx={{fontSize: 64, color: 'text.secondary', mb: 2}}/>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No MCP servers configured
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            MCP (Model Context Protocol) servers provide additional capabilities to your prompts.
            Configure servers to enable tools, resources, and other integrations.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon/>} onClick={onCreate}>
            Add MCP Server
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{minWidth: 650}} aria-label="MCP configs table">
            <TableHead>
              <TableRow sx={{backgroundColor: 'grey.50'}}>
                <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Description</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Created</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configs.map(config => (
                <TableRow
                  key={config.id}
                  hover
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                      {config.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {config.config.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={config.config.disabled ? 'Disabled' : 'Enabled'}
                      color={config.config.disabled ? 'error' : 'success'}
                      size="small"
                      icon={config.config.disabled ? <DisableIcon/> : <EnableIcon/>}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(config.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <Tooltip title="Edit configuration">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(config)}
                          aria-label={`Edit ${config.name}`}
                        >
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete configuration">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(config)}
                          aria-label={`Delete ${config.name}`}
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
