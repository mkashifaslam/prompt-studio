import { NodeEnv } from "./config.schema";

export interface AppConfig {
  port: number;
  database: {
    url: string;
  };
  nodeEnv: NodeEnv;
  corsOrigin?: string;
}

// Extend ConfigService to provide type safety
declare module "@nestjs/config" {
  interface ConfigService {
    get<T = any>(propertyPath: keyof AppConfig, defaultValue?: T): T;
    get<T = any>(propertyPath: string, defaultValue?: T): T;
  }
}
