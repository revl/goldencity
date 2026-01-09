import {
  CreateUserRequestSchema,
  type User
} from "@goldencity/contracts";
import { Router, type Request, type Response } from "express";
import { supabase } from "../lib/supabase.js";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const usersRoutes = Router();

// Get current user
usersRoutes.get(
  "/me",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.walletAddress) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", req.walletAddress.toLowerCase())
        .single();

      if (error || !data) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const user: User = {
        walletAddress: data.wallet_address,
        kycStatus: data.kyc_status,
        onboardingCompleted: data.onboarding_completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
);

// Create user (auto-created on first wallet connection)
usersRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = CreateUserRequestSchema.parse(req.body);
    const walletAddress = parsed.walletAddress.toLowerCase();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (existing) {
      res.json({
        walletAddress: existing.wallet_address,
        kycStatus: existing.kyc_status,
        onboardingCompleted: existing.onboarding_completed,
        createdAt: new Date(existing.created_at),
        updatedAt: new Date(existing.updated_at),
      });
      return;
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert({
        wallet_address: walletAddress,
        kyc_status: "pending",
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    const user: User = {
      walletAddress: data.wallet_address,
      kycStatus: data.kyc_status,
      onboardingCompleted: data.onboarding_completed,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request", details: error });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update KYC status
usersRoutes.post(
  "/kyc",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.walletAddress) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const walletAddress = req.walletAddress.toLowerCase();

      // Update user KYC status (mock - always approve)
      const { data, error } = await supabase
        .from("users")
        .update({
          kyc_status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("wallet_address", walletAddress)
        .select()
        .single();

      if (error) {
        res.status(500).json({ error: "Failed to update KYC" });
        return;
      }

      const user: User = {
        walletAddress: data.wallet_address,
        kycStatus: data.kyc_status,
        onboardingCompleted: data.onboarding_completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      res.json(user);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request", details: error });
        return;
      }
      res.status(500).json({ error: "Failed to update KYC" });
    }
  },
);

// Complete onboarding
usersRoutes.post(
  "/onboarding/complete",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.walletAddress) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const walletAddress = req.walletAddress.toLowerCase();

      const { data, error } = await supabase
        .from("users")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("wallet_address", walletAddress)
        .select()
        .single();

      if (error) {
        res.status(500).json({ error: "Failed to complete onboarding" });
        return;
      }

      const user: User = {
        walletAddress: data.wallet_address,
        kycStatus: data.kyc_status,
        onboardingCompleted: data.onboarding_completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  },
);
