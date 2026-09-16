export type Environment = "development" | "test" | "production";
export type LogLevel = "debug" | "info" | "warn" | "error";

interface EnvConfig {
  NODE_ENV: Environment;
  LOG_LEVEL: LogLevel;
}

function parseEnvironment(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

function resolveEnvironment(): EnvConfig {
  const rawEnv = parseEnvironment(process.env["NODE_ENV"], "development");

  const validEnvironments: Environment[] = ["development", "test", "production"];
  const nodeEnv: Environment = validEnvironments.includes(rawEnv as Environment)
    ? (rawEnv as Environment)
    : "development";

  const rawLogLevel = parseEnvironment(process.env["LOG_LEVEL"], "info");

  const validLogLevels: LogLevel[] = ["debug", "info", "warn", "error"];
  const logLevel: LogLevel = validLogLevels.includes(rawLogLevel as LogLevel)
    ? (rawLogLevel as LogLevel)
    : "info";

  return {
    NODE_ENV: nodeEnv,
    LOG_LEVEL: logLevel,
  };
}

export const env: EnvConfig = resolveEnvironment();
