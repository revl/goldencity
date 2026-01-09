import { logger } from "@goldencity/utils-node";
import type { NextFunction, Request, Response } from "express";
import { SiweMessage } from "siwe";

export interface SIWERequest extends Request {
  siweMessage?: {
    address: string;
  };
}

export async function siweMiddleware(
  req: SIWERequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      res.status(400).json({ error: "Message and signature are required" });
      return;
    }

    // Parse the message first to extract the address
    const parsedMessage = new SiweMessage(message);

    // Check if address is present in parsed message
    if (!parsedMessage.address) {
      logger.error("SIWE message missing address after parsing", {
        details: {
          domain: parsedMessage.domain,
          statement: parsedMessage.statement,
          messagePreview: message.substring(0, 200),
        },
      });
      res.status(401).json({
        error: "Invalid SIWE message: address not found",
        details: "SIWE message does not contain a valid address",
      });
      return;
    }

    // Verify the signature - this validates the message and signature match
    await parsedMessage.verify({ signature });

    // Use the parsed message's address (it's already extracted from the message string)
    req.siweMessage = {
      address: parsedMessage.address,
    };
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("SIWE verification error", { error });
    res.status(401).json({
      error: "Invalid SIWE message or signature",
      details: errorMessage,
    });
  }
}
