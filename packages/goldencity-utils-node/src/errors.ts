export interface BaseErrorOptions extends ErrorOptions {
  details?: Record<string, unknown> | undefined;
}

/**
 * Base error class for all errors in the API server.
 */
export class BaseError extends Error {
  public readonly details?: Record<string, unknown> | undefined;

  constructor(message?: string, options?: BaseErrorOptions) {
    super(message, options);

    // Restore prototype chain (needed for Babel/TS targeting ES5)
    Object.setPrototypeOf(this, new.target.prototype);

    // Set the error name to the subclass's class name
    this.name = new.target.name;

    this.details = options?.details;
  }
}

/**
 * Base error class for API errors returned by the controllers via the
 * next() function in the middleware.
 */
export class ApiError extends BaseError {
  constructor(
    public readonly status: number,
    message?: string,
    options?: BaseErrorOptions,
  ) {
    super(message, options);
  }
}

// Common classes of errors shared by multiple features

export class ValidationError extends ApiError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(400, message, options);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(401, message, options);
  }
}

export class NotFoundError extends ApiError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(404, message, options);
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string, options?: BaseErrorOptions) {
    super(500, message, options);
  }
}
