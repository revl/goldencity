import { randomBytes } from "crypto";
import { Router, type Request, type Response } from "express";
import { createSession } from "../lib/session.js";
import {
  siweMiddleware,
  type SIWERequest,
} from "../middleware/siwe.middleware.js";

export const authRoutes = Router();

// Generate a random alphanumeric nonce for SIWE (minimum 8 characters)
function generateNonce(): string {
  const length = 16; // Generate 16 character nonce for security
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytesArray = randomBytes(length);
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars[randomBytesArray[i]! % chars.length];
  }
  return nonce;
}

// Get nonce for SIWE
authRoutes.get("/nonce", (_req: Request, res: Response) => {
  const nonce = generateNonce();
  res.json({ nonce });
});

// Verify SIWE and create session
authRoutes.post(
  "/siwe",
  siweMiddleware,
  async (req: SIWERequest, res: Response) => {
    try {
      if (!req.siweMessage) {
        res.status(400).json({ error: "SIWE verification failed" });
        return;
      }

      const walletAddress = req.siweMessage.address.toLowerCase();
      const sessionId = await createSession(walletAddress);

      res.cookie("session_id", sessionId, {
        httpOnly: true,
        secure: true, // Required for SameSite=None
        // Cannot be "lax" or "strict" because the web app is hosted on a
        // different domain.
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ success: true, walletAddress });
    } catch (error) {
      res.status(500).json({
        error:
          "Failed to create session: " +
          (error instanceof Error ? error.message : JSON.stringify(error)),
      });
    }
  },
);

// Logout
authRoutes.post("/logout", async (req: Request, res: Response) => {
  const sessionId = req.cookies?.session_id;
  if (sessionId) {
    // Session will expire naturally, but we can clear the cookie
    res.clearCookie("session_id", {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: "none", // Must match the cookie settings
    });
  }
  res.json({ success: true });
});
