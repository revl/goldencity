import type { Request, Response, NextFunction } from "express";
import { getSessionFromRequest } from "../lib/session.js";

export interface AuthenticatedRequest extends Request {
  walletAddress?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.walletAddress = session.walletAddress;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
