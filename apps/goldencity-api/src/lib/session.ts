import type { Session } from "@goldencity/contracts";
import { randomUUID } from "crypto";
import type { Request } from "express";
import { supabase } from "./supabase.js";

export async function getSessionFromRequest(
  req: Request,
): Promise<Session | null> {
  const sessionId = req.cookies?.session_id;
  if (!sessionId) {
    return null;
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("session_id", sessionId)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error || !data) {
    return null;
  }

  return {
    sessionId: data.session_id,
    walletAddress: data.wallet_address,
    expiresAt: new Date(data.expires_at),
  };
}

export async function createSession(
  walletAddress: string,
  expiresInSeconds = 7 * 24 * 60 * 60, // 7 days
): Promise<string> {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  const { error } = await supabase.from("sessions").insert({
    session_id: sessionId,
    wallet_address: walletAddress,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return sessionId;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await supabase.from("sessions").delete().eq("session_id", sessionId);
}
