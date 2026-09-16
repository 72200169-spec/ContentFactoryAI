export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly cause?: Error;

  constructor(
    message: string,
    code: string,
    options?: {
      statusCode?: number;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode;
    this.cause = options?.cause;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
