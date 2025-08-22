import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';
import {Prompt, PromptVariable} from './types';

interface Props {
  prompt: Prompt;
  onEdit: () => void;
  onBack: () => void;
}

export default function PromptDetail({prompt, onEdit, onBack}: Props) {
  const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
  const [processedPrompt, setProcessedPrompt] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Initialize variable values with defaults
    const initialValues: { [key: string]: string } = {};
    prompt.variables.forEach(variable => {
      initialValues[variable.key] = variable.defaultValue || '';
    });
    setVariableValues(initialValues);
  }, [prompt]);

  useEffect(() => {
    processPrompt();
  }, [variableValues, prompt.content]);

  const processPrompt = () => {
    let processed = prompt.content;
    const errors: { [key: string]: string } = {};

    prompt.variables.forEach(variable => {
      const value = variableValues[variable.key];

      // Validate required variables
      if (variable.required && (!value || value.trim() === '')) {
        errors[variable.key] = 'This variable is required';
      }

      // Type validation
      if (value && variable.type) {
        switch (variable.type) {
          case 'number':
            if (isNaN(Number(value))) {
              errors[variable.key] = 'Must be a valid number';
            }
            break;
          case 'boolean':
            if (!['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())) {
              errors[variable.key] = 'Must be true/false, yes/no, or 1/0';
            }
            break;
          case 'select':
            if (variable.options && !variable.options.includes(value)) {
              errors[variable.key] = 'Must be one of the available options';
            }
            break;
        }
      }

      // Replace variable in content
      const finalValue = value || `[${variable.key}]`;
      processed = processed.replace(new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g'), finalValue);
    });

    setValidationErrors(errors);
    setProcessedPrompt(processed);
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    const defaultValues: { [key: string]: string } = {};
    prompt.variables.forEach(variable => {
      defaultValues[variable.key] = variable.defaultValue || '';
    });
    setVariableValues(defaultValues);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedPrompt);
      // Could add a snackbar notification here
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  };

  const renderVariableInput = (variable: PromptVariable) => {
    const value = variableValues[variable.key] || '';
    const error = validationErrors[variable.key];

    switch (variable.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small" error={!!error}>
            <InputLabel>{variable.key}</InputLabel>
            <Select
              value={value}
              onChange={e => handleVariableChange(variable.key, e.target.value)}
              label={variable.key}
            >
              {variable.options?.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={['true', '1', 'yes'].includes(value.toLowerCase())}
                onChange={e => handleVariableChange(variable.key, e.target.checked ? 'true' : 'false')}
              />
            }
            label={variable.key}
          />
        );

      default:
        return (
          <TextField
            label={variable.key}
            value={value}
            onChange={e => handleVariableChange(variable.key, e.target.value)}
            fullWidth
            size="small"
            error={!!error}
            helperText={error || variable.description}
            placeholder={variable.defaultValue || `Enter ${variable.key}`}
            type={variable.type === 'number' ? 'number' : 'text'}
            required={variable.required}
          />
        );
    }
  };

  const hasErrors = Object.keys(validationErrors).length > 0;
  const hasRequiredVariables = prompt.variables.some(v => v.required);

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{mb: 2}}>
        <Link
          component="button"
          variant="body2"
          onClick={onBack}
          sx={{
            textDecoration: 'none',
            '&:hover': {textDecoration: 'underline'}
          }}
        >
          Prompts
        </Link>
        <Typography variant="body2" color="text.primary">
          {prompt.name}
        </Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {prompt.name}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={`Version ${prompt.version}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={prompt.active ? 'Active' : 'Inactive'}
              color={prompt.active ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={`${prompt.variables.length} variable${prompt.variables.length !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<BackIcon/>}
            onClick={onBack}
            variant="outlined"
          >
            Back to List
          </Button>
          <Button
            startIcon={<EditIcon/>}
            onClick={onEdit}
            variant="contained"
          >
            Edit Prompt
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Variables Panel */}
        {prompt.variables.length > 0 && (
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{p: 3}}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Variables
                </Typography>
                <Tooltip title="Reset to defaults">
                  <IconButton size="small" onClick={resetToDefaults}>
                    <ResetIcon/>
                  </IconButton>
                </Tooltip>
              </Box>

              {hasRequiredVariables && (
                <Alert severity="info" sx={{mb: 2}}>
                  Fill in the required variables to see the complete prompt.
                </Alert>
              )}

              <Box display="flex" flexDirection="column" gap={2}>
                {prompt.variables.map(variable => (
                  <Box key={variable.key}>
                    {renderVariableInput(variable)}
                    {validationErrors[variable.key] && (
                      <Typography variant="caption" color="error" sx={{mt: 0.5, display: 'block'}}>
                        {validationErrors[variable.key]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Prompt Preview */}
        <Grid item xs={12} md={prompt.variables.length > 0 ? 8 : 12}>
          <Paper elevation={2} sx={{p: 3}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Generated Prompt
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Copy to clipboard">
                  <IconButton size="small" onClick={copyToClipboard}>
                    <CopyIcon/>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {hasErrors && (
              <Alert severity="warning" sx={{mb: 2}}>
                Please fix the validation errors in the variables panel.
              </Alert>
            )}

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: hasErrors ? 'error.light' : 'grey.50',
                borderColor: hasErrors ? 'error.main' : 'grey.300',
                minHeight: 200
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.5
                }}
              >
                {processedPrompt}
              </Typography>
            </Paper>

            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Character count: {processedPrompt.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Word count: {processedPrompt.trim().split(/\s+/).length}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Original Prompt Template */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Original Template
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                {prompt.content}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
