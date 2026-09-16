import { config } from "../config/config.js";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string): string {
  return `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
}

export class Logger {
  private readonly minLevel: number;

  constructor(private readonly context?: string) {
    this.minLevel = LOG_LEVEL_PRIORITY[config.logLevel as LogLevel] ?? 1;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= this.minLevel;
  }

  private formatWithContext(level: LogLevel, message: string): string {
    const prefix = this.context ? `[${this.context}] ` : "";
    return formatMessage(level, `${prefix}${message}`);
  }

  debug(message: string): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatWithContext("debug", message));
    }
  }

  info(message: string): void {
    if (this.shouldLog("info")) {
      console.info(this.formatWithContext("info", message));
    }
  }

  warn(message: string): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatWithContext("warn", message));
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog("error")) {
      const suffix = error instanceof Error ? `: ${error.message}` : "";
      console.error(this.formatWithContext("error", `${message}${suffix}`));
    }
  }
}

export const logger = new Logger("CFAI");
