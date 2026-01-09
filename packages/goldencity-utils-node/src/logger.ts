function errorToObject(error: Error): Record<string, unknown> {
  let message: string | undefined;
  let payload: unknown;
  try {
    payload = JSON.parse(error.message);
  } catch {
    message = error.message;
  }
  return {
    name: error.name,
    message,
    payload,
    stack: error.stack,
    cause:
      "cause" in error
        ? error.cause instanceof Error
          ? errorToObject(error.cause)
          : error.cause
        : undefined,
    code: "code" in error ? error.code : undefined,
    status: "status" in error ? error.status : undefined,
    details: "details" in error ? error.details : undefined,
    syscall: "syscall" in error ? error.syscall : undefined,
    errno: "errno" in error ? error.errno : undefined,
  };
}

interface LogOptions {
  error?: unknown;
  details?: unknown;
}

interface StructuredLogEntry extends LogOptions {
  severity: string;
  message: string;
}

function logProduction(
  logFunction: (message: string, ...data: unknown[]) => void,
  severity: string,
  message: string,
  options?: LogOptions,
) {
  const logEntry: StructuredLogEntry = { severity, message, ...options };
  if (logEntry.error instanceof Error) {
    logEntry.error = errorToObject(logEntry.error);
  }
  logFunction(JSON.stringify(logEntry));
}

function logDevelopment(
  logFunction: (message: string, ...data: unknown[]) => void,
  _severity: string,
  message: string,
  options?: unknown,
) {
  if (options) {
    logFunction(
      message.endsWith(":") ? message : message + ":",
      ...Object.values(options),
    );
  } else {
    logFunction(message);
  }
}

const log =
  process.env.NODE_ENV === "production" ? logProduction : logDevelopment;

export const logger = {
  error: (message: string, options?: LogOptions) =>
    log(console.error, "ERROR", message, options),
  warn: (message: string, options?: LogOptions) =>
    log(console.warn, "WARNING", message, options),
  info: (message: string, options?: LogOptions) =>
    log(console.info, "INFO", message, options),
  debug: (message: string, options?: LogOptions) =>
    log(console.debug, "DEBUG", message, options),
};
