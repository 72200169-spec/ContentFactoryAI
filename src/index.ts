import { config } from "./config/config.js";
import { logger } from "./services/logger.service.js";
import { AppError } from "./errors/AppError.js";
import { handleError } from "./errors/error-handler.js";

function main(): void {
  logger.info("Content Factory AI");
  logger.info(`Environment: ${config.environment}`);

  try {
    logger.info("System ready.");
  } catch (error) {
    handleError(error);
  }
}

function testErrorHandler(): void {
  try {
    throw new AppError("Test error", "TEST_ERROR");
  } catch (error) {
    handleError(error);
  }
}

main();

if (config.isDevelopment && process.argv.includes("--test-error")) {
  testErrorHandler();
}
