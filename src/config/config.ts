import { env } from "./env.js";

export interface AppConfig {
  readonly environment: string;
  readonly logLevel: string;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
}

export const config: AppConfig = {
  environment: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
};
