import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoDetectIcon from '@mui/icons-material/AutoFixHigh';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import './tiptap.css';

import type { Prompt, PromptVariable } from './types';

// Reusable toolbar button
interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({icon, label, onClick, active}) => {
  const theme = useTheme();

  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="small"
        onClick={onClick}
        color={active ? 'primary' : 'default'}
  sx={(theme: import('@mui/material/styles').Theme) => ({
          borderRadius: 1.5,
          border: `1px solid ${active ? theme.palette.primary.main : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')}`,
            backgroundColor: active ? (theme.palette.mode === 'dark' ? 'rgba(25,118,210,0.15)' : 'rgba(25,118,210,0.08)') : 'transparent',
            '&:hover': {
              backgroundColor: active ? (theme.palette.mode === 'dark' ? 'rgba(25,118,210,0.25)' : 'rgba(25,118,210,0.15)') : theme.palette.action.hover
            },
            transition: 'background-color 120ms ease'
        })}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

interface Props {
  prompt?: Prompt;
  onSave: (data: Partial<Prompt>) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  content?: string;
  variables?: { [key: string]: string };
}

export default function PromptForm({prompt, onSave, onCancel}: Props) {
  const [name, setName] = useState(prompt?.name || '');
  const [content, setContent] = useState(prompt?.content || '');

  // Tiptap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        style: 'min-height: 180px; font-family: monospace; font-size: 0.95rem;'
      }
    }
  });
  const [active, setActive] = useState(prompt?.active ?? true);
  const [version, setVersion] = useState(prompt?.version || 1);
  const [variables, setVariables] = useState<PromptVariable[]>(prompt?.variables || []);
  const [previewValues, setPreviewValues] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auto-detect variables from content when content changes
  useEffect(() => {
    autoDetectVariables();
  }, [content]);

  // Initialize preview values when variables change
  useEffect(() => {
    const newPreviewValues: { [key: string]: string } = {};
    variables.forEach(variable => {
      newPreviewValues[variable.key] = variable.defaultValue || `[${variable.key}]`;
    });
    setPreviewValues(newPreviewValues);
  }, [variables]);

  const autoDetectVariables = () => {
    // Extract variables from content using {{variable}} pattern
    const variableMatches = content.match(/\{\{([^}]+)\}\}/g);
    if (!variableMatches) return;

    const detectedKeys = variableMatches.map(match =>
      match.replace(/[{}]/g, '').trim()
    );

    // Get unique variable keys
    const uniqueKeys = [...new Set(detectedKeys)];

    // Update variables list, preserving existing variable configurations
    const newVariables: PromptVariable[] = uniqueKeys.map(key => {
      const existing = variables.find(v => v.key === key);
      return existing || {
        key,
        description: '',
        required: true,
        type: 'string',
        defaultValue: ''
      };
    });

    setVariables(newVariables);
  };

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

    // Validate variables only if they exist
    const variableErrors: { [key: string]: string } = {};
    variables.forEach(variable => {
      if (!variable.key.trim()) {
        variableErrors[variable.key || 'unnamed'] = 'Variable key is required';
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable.key)) {
        variableErrors[variable.key] = 'Variable key must be valid (letters, numbers, underscore)';
      }

      if (variable.type === 'select' && (!variable.options || variable.options.length === 0)) {
        variableErrors[variable.key] = 'Select type variables must have options';
      }
    });

    if (Object.keys(variableErrors).length > 0) {
      newErrors.variables = variableErrors;
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.content && (!newErrors.variables || Object.keys(newErrors.variables).length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({name: true, content: true});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null); // Reset submit error
    try {
      await onSave({
        ...prompt,
        name: name.trim(),
        content: content.trim(),
        active,
        variables,
        version: prompt ? version : 1 // Send as number, not string
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      setSubmitError('Failed to save prompt. Please try again.'); // Set submit error
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
      setVersion(parseInt(value) || 1);
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

  const addVariable = () => {
    const newVariable: PromptVariable = {
      key: `variable_${variables.length + 1}`,
      description: '',
      required: true,
      type: 'string',
      defaultValue: ''
    };
    setVariables([...variables, newVariable]);
  };

  const updateVariable = (index: number, field: keyof PromptVariable, value: any) => {
    const newVariables = [...variables];
    (newVariables[index] as any)[field] = value;

    // Clear options if type is not select
    if (field === 'type' && value !== 'select') {
      newVariables[index].options = undefined;
    }

    setVariables(newVariables);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariableOptions = (index: number, options: string[]) => {
    const newVariables = [...variables];
    newVariables[index].options = options;
    setVariables(newVariables);
  };

  const generatePreview = () => {
    let preview = content;
    variables.forEach(variable => {
      const value = previewValues[variable.key] || variable.defaultValue || `[${variable.key}]`;
      preview = preview.replace(new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g'), value);
    });
    return preview;
  };

  const isFormValid = () => {
    const hasRequiredFields = name.trim() && content.trim();
    const hasNoMainErrors = !errors.name && !errors.content;
    const hasNoVariableErrors = !errors.variables || Object.keys(errors.variables).length === 0;

    return hasRequiredFields && hasNoMainErrors && hasNoVariableErrors;
  };

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

        {submitError && (
          <Alert severity="error" sx={{mb: 3}}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{mb: 4}}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Prompt Name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('name', e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('version', e.target.value)}
                  fullWidth
                  disabled={!prompt}
                  helperText={prompt ? 'Version will be incremented' : 'Will be set to 1.0 for new prompts'}
                />
              </Grid>

              <Grid item xs={12}>
                <Box mb={1}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Prompt Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use <code>{'{{variable_name}}'}</code> for variables. Supports rich formatting, tables, images, code, etc.
                  </Typography>
                </Box>
                {/* Tiptap Toolbar */}
                {editor && (
                  <Paper
                    variant="outlined"
                    elevation={0}
                    sx={{
                      mb: 1,
                      p: 0.5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <ToolbarButton icon={<FormatBoldIcon fontSize="small"/>} active={editor.isActive('bold')} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} />
                    <ToolbarButton icon={<FormatItalicIcon fontSize="small"/>} active={editor.isActive('italic')} label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} />
                    <ToolbarButton icon={<FormatUnderlinedIcon fontSize="small"/>} active={editor.isActive('underline')} label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} />
                    <ToolbarButton icon={<StrikethroughSIcon fontSize="small"/>} active={editor.isActive('strike')} label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} />
                    <ToolbarButton icon={<CodeIcon fontSize="small"/>} active={editor.isActive('code')} label="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} />
                    <Divider flexItem orientation="vertical" sx={{mx: 0.5}} />
                    <ToolbarButton icon={<FormatListBulletedIcon fontSize="small"/>} active={editor.isActive('bulletList')} label="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} />
                    <ToolbarButton icon={<FormatListNumberedIcon fontSize="small"/>} active={editor.isActive('orderedList')} label="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                    <ToolbarButton icon={<FormatQuoteIcon fontSize="small"/>} active={editor.isActive('blockquote')} label="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} />
                    <ToolbarButton icon={<HorizontalRuleIcon fontSize="small"/>} label="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                    <Divider flexItem orientation="vertical" sx={{mx: 0.5}} />
                    <ToolbarButton icon={<UndoIcon fontSize="small"/>} label="Undo" onClick={() => editor.chain().focus().undo().run()} />
                    <ToolbarButton icon={<RedoIcon fontSize="small"/>} label="Redo" onClick={() => editor.chain().focus().redo().run()} />
                  </Paper>
                )}
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    minHeight: 200,
                    position: 'relative',
                    backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
                    '&:hover': { boxShadow: theme.palette.mode === 'dark' ? '0 0 0 1px rgba(255,255,255,0.1)' : '0 0 0 1px rgba(0,0,0,0.05)' },
                    transition: 'box-shadow 120ms ease',
                    '& .tiptap-editor': {
                      color: 'text.primary',
                      fontFamily: theme.typography.fontFamily,
                      lineHeight: 1.55
                    },
                    '&.error': {
                      borderColor: 'error.main'
                    }
                  }}
                  className={touched.content && errors.content ? 'error' : undefined}
                >
                  <EditorContent editor={editor} />
                </Paper>
                {touched.content && errors.content && (
                  <Typography color="error" variant="body2" mt={1}>{errors.content}</Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Variables Management */}
          <Box sx={{mb: 4}}>
            <Typography variant="h6" gutterBottom>
              Variables
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Box display="flex" gap={2} mb={3}>
              <Button
                startIcon={<AutoDetectIcon/>}
                onClick={autoDetectVariables}
                variant="outlined"
                size="small"
              >
                Auto-Detect Variables
              </Button>
              <Button
                startIcon={<AddIcon/>}
                onClick={addVariable}
                variant="outlined"
                size="small"
              >
                Add Variable
              </Button>
              <Button
                startIcon={<PreviewIcon/>}
                onClick={() => setShowPreview(!showPreview)}
                variant="outlined"
                size="small"
                color={showPreview ? "primary" : "inherit"}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </Box>

            {variables.length === 0 ? (
              <Alert severity="info">
                No variables detected. Use {'{{'} and {'}}'} to define variables in your prompt content,
                or click "Add Variable" to manually add variables.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {variables.map((variable, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper variant="outlined" sx={{p: 2}}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Variable {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeVariable(index)}
                        >
                          <DeleteIcon/>
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Variable Key"
                            value={variable.key}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVariable(index, 'key', e.target.value)}
                            fullWidth
                            size="small"
                            error={!!errors.variables?.[variable.key]}
                            helperText={errors.variables?.[variable.key]}
                            placeholder="variable_name"
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                              value={variable.type || 'string'}
                              onChange={(e: React.ChangeEvent<{ value: unknown }>) => updateVariable(index, 'type', e.target.value)}
                              label="Type"
                            >
                              <MenuItem value="string">String</MenuItem>
                              <MenuItem value="number">Number</MenuItem>
                              <MenuItem value="boolean">Boolean</MenuItem>
                              <MenuItem value="select">Select</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Default Value"
                            value={variable.defaultValue || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVariable(index, 'defaultValue', e.target.value)}
                            fullWidth
                            size="small"
                            placeholder="Optional default"
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={variable.required ?? true}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVariable(index, 'required', e.target.checked)}
                                size="small"
                              />
                            }
                            label="Required"
                            sx={{mt: 1}}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            label="Description"
                            value={variable.description || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateVariable(index, 'description', e.target.value)}
                            fullWidth
                            size="small"
                            placeholder="Describe what this variable represents"
                          />
                        </Grid>

                        {variable.type === 'select' && (
                          <Grid item xs={12}>
                            <TextField
                              label="Options (comma-separated)"
                              value={variable.options?.join(', ') || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateVariableOptions(
                                  index,
                                  e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                                )
                              }
                              fullWidth
                              size="small"
                              placeholder="option1, option2, option3"
                              helperText="Enter comma-separated options for the select dropdown"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Preview Section */}
          {showPreview && variables.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="h6">Preview with Test Values</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} sx={{mb: 3}}>
                  {variables.map((variable, index) => (
                    <Grid item xs={12} md={6} key={variable.key}>
                      <TextField
                        label={`Test value for ${variable.key}`}
                        value={previewValues[variable.key] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewValues(prev => ({
                          ...prev,
                          [variable.key]: e.target.value
                        }))}
                        fullWidth
                        size="small"
                        placeholder={variable.defaultValue || `Enter test value for ${variable.key}`}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="subtitle2" gutterBottom>
                  Preview Result:
                </Typography>
                <Paper variant="outlined" sx={{p: 2, bgcolor: 'grey.50'}}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {generatePreview()}
                  </Typography>
                </Paper>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Settings */}
          <Box sx={{mb: 4}}>
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActive(e.target.checked)}
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
              disabled={!isFormValid() || loading}
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
