export interface Prompt {
  id: string;
  name: string;
  content: string;
  variables: { key: string; description?: string; required?: boolean }[];
  metadata: Record<string, any>;
  version: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
