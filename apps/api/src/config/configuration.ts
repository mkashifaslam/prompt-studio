import { validateConfig } from "./config.schema";

export default () => {
  const validatedConfig = validateConfig(process.env);

  return {
    port: validatedConfig.PORT,
    database: {
      url: validatedConfig.DATABASE_URL,
    },
    nodeEnv: validatedConfig.NODE_ENV,
    corsOrigin: validatedConfig.CORS_ORIGIN,
  };
};
