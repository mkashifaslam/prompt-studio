import * as React from 'react';
import {useState} from 'react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {ArrowBack as ArrowBackIcon, Cancel as CancelIcon, Save as SaveIcon} from '@mui/icons-material';
import {Prompt} from './types';

interface Props {
  prompt?: Prompt;
  onSave: (data: Partial<Prompt>) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  content?: string;
}

export default function PromptForm({prompt, onSave, onCancel}: Props) {
  const [name, setName] = useState(prompt?.name || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [active, setActive] = useState(prompt?.active ?? true);
  const [version, setVersion] = useState(prompt?.version || '1.0');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Prompt name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Prompt name must be at least 3 characters';
    } else if (name.length > 100) {
      newErrors.name = 'Prompt name must be less than 100 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Prompt content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Prompt content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({name: true, content: true});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...prompt,
        name: name.trim(),
        content: content.trim(),
        active,
        version: prompt ? version : '1.0'
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'name') {
      setName(value);
    } else if (field === 'content') {
      setContent(value);
    } else if (field === 'version') {
      setVersion(value);
    }

    // Clear error when user starts typing
    if (touched[field] && errors[field as keyof FormErrors]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({...prev, [field]: true}));
    validateForm();
  };

  const isFormValid = name.trim() && content.trim() && Object.keys(errors).length === 0;

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
          Prompts
        </Link>
        <Typography variant="body2" color="text.primary">
          {prompt ? 'Edit Prompt' : 'Create Prompt'}
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
            {prompt ? 'Edit Prompt' : 'Create New Prompt'}
          </Typography>
        </Box>

        {prompt && (
          <Alert severity="info" sx={{mb: 3}}>
            You are editing an existing prompt. Changes will be saved as version {version}.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{mb: 4}}>
            {/* Basic Information Section */}
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Prompt Name"
                  value={name}
                  onChange={e => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  fullWidth
                  required
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name ? errors.name : 'Enter a descriptive name for your prompt'}
                  placeholder="e.g., Customer Support Response Template"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Version"
                  value={version}
                  onChange={e => handleFieldChange('version', e.target.value)}
                  fullWidth
                  disabled={!prompt}
                  helperText={prompt ? 'Version will be incremented' : 'Will be set to 1.0 for new prompts'}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Prompt Content"
                  value={content}
                  onChange={e => handleFieldChange('content', e.target.value)}
                  onBlur={() => handleBlur('content')}
                  fullWidth
                  required
                  multiline
                  minRows={6}
                  maxRows={20}
                  error={touched.content && !!errors.content}
                  helperText={
                    touched.content && errors.content
                      ? errors.content
                      : `${content.length} characters. Write your prompt content here.`
                  }
                  placeholder="Enter your prompt content here. You can use variables like {{variable_name}} in your prompt."
                  sx={{
                    '& .MuiInputBase-root': {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{mb: 4}}>
            {/* Settings Section */}
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Divider sx={{mb: 3}}/>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{mb: 2}}>
                Status
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={active}
                      onChange={e => setActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ml: 1}}>
                      <Typography variant="body1" fontWeight="medium">
                        Active
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {active
                          ? 'This prompt is active and can be used in applications'
                          : 'This prompt is inactive and will not be available for use'
                        }
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>
            </FormControl>
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
              {loading ? 'Saving...' : (prompt ? 'Update Prompt' : 'Create Prompt')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
