export interface PromptVariable {
  key: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  type?: 'string' | 'number' | 'boolean' | 'select';
  options?: string[]; // For select type
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  metadata: Record<string, any>;
  version: number; // Changed from string to number
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
