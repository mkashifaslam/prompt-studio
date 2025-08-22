import * as React from 'react';
import {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {McpConfig} from './types';

interface Props {
  config?: McpConfig;
  onSave: (data: Partial<McpConfig>) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  command?: string;
  serverUrl?: string;
}

export default function McpConfigForm({config, onSave, onCancel}: Props) {
  const [name, setName] = useState(config?.name || '');
  const [description, setDescription] = useState(config?.config.description || '');
  const [disabled, setDisabled] = useState(config?.config.disabled || false);
  const [command, setCommand] = useState(config?.config.command || '');
  const [args, setArgs] = useState<string[]>(config?.config.args || []);
  const [env, setEnv] = useState<Record<string, string>>(config?.config.env || {});
  const [cwd, setCwd] = useState(config?.config.cwd || '');
  const [timeout, setTimeout] = useState(config?.config.timeout || 30);
  const [serverUrl, setServerUrl] = useState(config?.config.baseUrl || '');
  const [apiKey, setApiKey] = useState(config?.config.apiKey || '');
  const [capabilities, setCapabilities] = useState<string[]>(config?.config.capabilities || []);
  const [showApiKey, setShowApiKey] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Server name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Server name must be at least 2 characters';
    }

    if (!command.trim() && !serverUrl.trim()) {
      newErrors.command = 'Either command or server URL is required';
      newErrors.serverUrl = 'Either command or server URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({name: true, command: true, serverUrl: true});

    if (!validateForm()) {
      return;
    }

    // Derive transport based on inputs
    const trimmedUrl = serverUrl.trim();
    const hasCommand = !!command.trim();
    let transport: 'stdio' | 'sse' | 'websocket' = 'stdio';
    if (!hasCommand && trimmedUrl) {
      transport = trimmedUrl.startsWith('ws') ? 'websocket' : 'sse';
    }

    setLoading(true);
    try {
      await onSave({
        ...config,
        name: name.trim(),
        config: {
          // Align with backend McpServerSchema
          name: name.trim(),
          description: description.trim() || undefined,
          disabled,
          transport,
          command: command.trim() || undefined,
          args: args.filter(arg => arg.trim()),
          env: Object.fromEntries(
            Object.entries(env).filter(([key, value]) => key.trim() && value.trim())
          ),
          cwd: cwd.trim() || undefined,
          timeout,
          baseUrl: trimmedUrl || undefined,
          apiKey: apiKey.trim() || undefined,
          capabilities: capabilities.filter(cap => cap.trim()),
          tools: (capabilities || []).filter(cap => cap.trim()).map(cap => ({name: cap.trim()})),
        },
      });
      setSubmitError(null);
    } catch (error: any) {
      console.error('Error saving MCP config:', error);
      setSubmitError(error?.message || 'Failed to save MCP config');
    } finally {
      setLoading(false);
    }
  };

  const addArg = () => {
    setArgs([...args, '']);
  };

  const updateArg = (index: number, value: string) => {
    const newArgs = [...args];
    newArgs[index] = value;
    setArgs(newArgs);
  };

  const removeArg = (index: number) => {
    setArgs(args.filter((_, i) => i !== index));
  };

  const addEnvVar = () => {
    const key = `ENV_VAR_${Object.keys(env).length + 1}`;
    setEnv({...env, [key]: ''});
  };

  const updateEnvKey = (oldKey: string, newKey: string) => {
    const newEnv = {...env};
    newEnv[newKey] = newEnv[oldKey];
    delete newEnv[oldKey];
    setEnv(newEnv);
  };

  const updateEnvValue = (key: string, value: string) => {
    setEnv({...env, [key]: value});
  };

  const removeEnvVar = (key: string) => {
    const newEnv = {...env};
    delete newEnv[key];
    setEnv(newEnv);
  };

  const addCapability = () => {
    setCapabilities([...capabilities, '']);
  };

  const updateCapability = (index: number, value: string) => {
    const newCapabilities = [...capabilities];
    newCapabilities[index] = value;
    setCapabilities(newCapabilities);
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const isFormValid = name.trim() && (command.trim() || serverUrl.trim()) && Object.keys(errors).length === 0;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{mb: 2}}>
        <Link
          component="button"
          variant="body2"
          onClick={onCancel}
          sx={{
            textDecoration: 'none',
            '&:hover': {textDecoration: 'underline'}
          }}
        >
          MCP Servers
        </Link>
        <Typography variant="body2" color="text.primary">
          {config ? 'Edit Configuration' : 'New Configuration'}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{p: {xs: 2, md: 4}}}>
        <Box display="flex" alignItems="center" mb={3}>
          {isMobile && (
            <Button
              startIcon={<ArrowBackIcon/>}
              onClick={onCancel}
              sx={{mr: 2}}
              size="small"
            >
              Back
            </Button>
          )}
          <Typography variant="h4" component="h1" fontWeight="bold">
            {config ? 'Edit MCP Server' : 'Add New MCP Server'}
          </Typography>
        </Box>

        {config && (
          <Alert severity="info" sx={{mb: 3}}>
            You are editing an existing MCP server configuration.
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" sx={{mb: 3}}>{submitError}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Box sx={{mb: 4}}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Server Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  required
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name ? errors.name : 'Unique name for this MCP server'}
                  placeholder="e.g., filesystem-server, weather-api"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!disabled}
                      onChange={e => setDisabled(!e.target.checked)}
                      color="primary"
                    />
                  }
                  label={disabled ? 'Disabled' : 'Enabled'}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Optional description of what this server provides"
                  placeholder="Describe the functionality this MCP server provides..."
                />
              </Grid>
            </Grid>
          </Box>

          {/* Server Configuration */}
          <Box sx={{mb: 4}}>
            <Typography variant="h6" gutterBottom>
              Server Configuration
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Local Command Configuration
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Command"
                      value={command}
                      onChange={e => setCommand(e.target.value)}
                      fullWidth
                      error={touched.command && !!errors.command}
                      helperText={touched.command && errors.command ? errors.command : 'Executable command to start the MCP server'}
                      placeholder="e.g., node, python, npx"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="medium">
                          Arguments
                        </Typography>
                        <Button size="small" startIcon={<AddIcon/>} onClick={addArg}>
                          Add Argument
                        </Button>
                      </Box>
                      {args.map((arg, index) => (
                        <Box key={index} display="flex" gap={1} mb={1}>
                          <TextField
                            size="small"
                            value={arg}
                            onChange={e => updateArg(index, e.target.value)}
                            placeholder={`Argument ${index + 1}`}
                            fullWidth
                          />
                          <IconButton size="small" onClick={() => removeArg(index)}>
                            <DeleteIcon/>
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Working Directory"
                      value={cwd}
                      onChange={e => setCwd(e.target.value)}
                      fullWidth
                      helperText="Optional working directory for the command"
                      placeholder="/path/to/working/directory"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Timeout (seconds)"
                      type="number"
                      value={timeout}
                      onChange={e => setTimeout(parseInt(e.target.value) || 30)}
                      fullWidth
                      helperText="Server startup timeout"
                      inputProps={{min: 1, max: 300}}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Remote Server Configuration
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Server URL"
                      value={serverUrl}
                      onChange={e => setServerUrl(e.target.value)}
                      fullWidth
                      error={touched.serverUrl && !!errors.serverUrl}
                      helperText={touched.serverUrl && errors.serverUrl ? errors.serverUrl : 'URL for remote MCP server'}
                      placeholder="https://api.example.com/mcp"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="API Key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      fullWidth
                      helperText="Optional API key for authentication"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowApiKey(!showApiKey)}
                              edge="end"
                            >
                              {showApiKey ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Environment Variables
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Environment variables passed to the MCP server
                    </Typography>
                    <Button size="small" startIcon={<AddIcon/>} onClick={addEnvVar}>
                      Add Variable
                    </Button>
                  </Box>
                  {Object.entries(env).map(([key, value]) => (
                    <Box key={key} display="flex" gap={1} mb={1}>
                      <TextField
                        size="small"
                        label="Key"
                        value={key}
                        onChange={e => updateEnvKey(key, e.target.value)}
                        sx={{width: '40%'}}
                      />
                      <TextField
                        size="small"
                        label="Value"
                        value={value}
                        onChange={e => updateEnvValue(key, e.target.value)}
                        sx={{width: '60%'}}
                      />
                      <IconButton size="small" onClick={() => removeEnvVar(key)}>
                        <DeleteIcon/>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Capabilities
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Expected capabilities provided by this server
                    </Typography>
                    <Button size="small" startIcon={<AddIcon/>} onClick={addCapability}>
                      Add Capability
                    </Button>
                  </Box>
                  {capabilities.map((capability, index) => (
                    <Box key={index} display="flex" gap={1} mb={1}>
                      <TextField
                        size="small"
                        value={capability}
                        onChange={e => updateCapability(index, e.target.value)}
                        placeholder="e.g., tools, resources, prompts"
                        fullWidth
                      />
                      <IconButton size="small" onClick={() => removeCapability(index)}>
                        <DeleteIcon/>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              flexDirection: {xs: 'column-reverse', sm: 'row'},
              justifyContent: {sm: 'flex-end'},
              alignItems: {xs: 'stretch', sm: 'center'}
            }}
          >
            <Button
              onClick={onCancel}
              size="large"
              startIcon={<CancelIcon/>}
              variant="outlined"
              sx={{minWidth: {sm: 120}}}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon/>}
              sx={{minWidth: {sm: 160}}}
            >
              {loading ? 'Saving...' : (config ? 'Update Server' : 'Create Server')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
