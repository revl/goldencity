import { z } from "zod";

export const GOLDENCITY_SESSION_COOKIE_NAME = "__goldencity_session";

export const SIWEMessageSchema = z.object({
  domain: z.string(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  statement: z.string().optional(),
  uri: z.string().url(),
  version: z.string(),
  chainId: z.number(),
  nonce: z.string(),
  issuedAt: z.string().optional(),
  expirationTime: z.string().optional(),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid signature"),
});

export type SIWEMessage = z.infer<typeof SIWEMessageSchema>;

export const SessionSchema = z.object({
  sessionId: z.string(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;
