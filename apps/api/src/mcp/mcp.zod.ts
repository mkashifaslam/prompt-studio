import { z } from "zod";

export const McpServerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  disabled: z.boolean().default(false),
  transport: z.enum(["stdio", "sse", "websocket"]).default("stdio"),
  command: z.string().optional(),
  args: z.array(z.string()).default([]),
  env: z.record(z.string()).default({}),
  cwd: z.string().optional(),
  timeout: z.number().min(1).max(300).default(30),
  baseUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  capabilities: z.array(z.string()).default([]),
  tools: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        inputSchema: z.any().optional(),
      })
    )
    .default([]),
});

export type McpServer = z.infer<typeof McpServerSchema>;
