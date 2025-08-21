import { z } from 'zod';

export const McpServerSchema = z.object({
  name: z.string().min(1),
  transport: z.enum(['stdio', 'sse', 'websocket']).default('stdio'),
  command: z.string().optional(),
  args: z.array(z.string()).default([]),
  env: z.record(z.string()).default({}),
  baseUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  tools: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        inputSchema: z.any().optional(),
      }),
    )
    .default([]),
});

export type McpServer = z.infer<typeof McpServerSchema>;
