import type { ErrorResponse } from "@goldencity/contracts";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";
import { ApiError } from "./errors.js";
import { logger } from "./logger.js";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  // Express identifies error handlers by having exactly 4 parameters:
  // (err, req, res, next), so we need to disable the unused-vars rule.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let status: number;
  let code: string;
  let message: string;
  let details: Record<string, unknown> | undefined;

  if (error instanceof ApiError) {
    status = error.status;
    code = error.name;
    message = error.message;
    details = error.details;

    if (status >= 400 && status < 500) {
      logger.warn(message, { details, error: error.cause });
    } else {
      logger.error(message, { details, error: error.cause });
    }
  } else {
    if (error instanceof ZodError) {
      status = 400;
      code = "ValidationError";
      message = "Input validation error";
      details = {
        issues: error.issues.map(({ path, message, code }) => ({
          path,
          message,
          code,
        })),
      };
    } else if (error.name === "UnauthorizedError") {
      status = 401;
      code = error.name;
      message = "Unauthorized";
    } else {
      status = 500;
      code = "InternalServerError";
      message = "Internal server error";
    }

    logger.error(message, { error });
  }

  res.status(status).json({ code, message, details });
};
