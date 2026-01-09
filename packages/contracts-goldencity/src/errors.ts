import * as z from "zod";

export const errorResponseSchema = z
  .object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .meta({
    description: "Error response",
    example: {
      code: "InternalServerError",
      message: "An unexpected error occurred.",
    },
    id: "ErrorResponse",
  });

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
