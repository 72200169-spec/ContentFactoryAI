import { AppError } from "./AppError.js";
import { logger } from "../services/logger.service.js";

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    logger.error(`[${error.code}] ${error.message}`, error);
    return error;
  }

  if (error instanceof Error) {
    const appError = new AppError(error.message, "UNKNOWN_ERROR", {
      cause: error,
    });
    logger.error(appError.message, appError);
    return appError;
  }

  const appError = new AppError(
    "An unexpected error occurred",
    "UNEXPECTED_ERROR"
  );
  logger.error(appError.message);
  return appError;
}

export function createErrorHandler(): (error: unknown) => AppError {
  return handleError;
}

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled rejection", reason instanceof Error ? reason : new Error(String(reason)));
  process.exit(1);
});
