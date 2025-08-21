import { z } from "zod";

export enum NodeEnv {
  Development = "development",
  Production = "production",
  Test = "test",
}

export const configSchema = z.object({
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.Development),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  CORS_ORIGIN: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

export const validateConfig = (config: Record<string, unknown>) => {
  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `Configuration validation failed:\n${errorMessages.join("\n")}`
      );
    }
    throw error;
  }
};
