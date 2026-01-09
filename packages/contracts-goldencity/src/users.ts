import { z } from "zod";

export const KYCStatusSchema = z.enum(["pending", "approved", "rejected"]);

export type KYCStatus = z.infer<typeof KYCStatusSchema>;

export const UserSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  kycStatus: KYCStatusSchema,
  onboardingCompleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const KYCFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  country: z.string().min(1, "Country is required"),
});

export type KYCForm = z.infer<typeof KYCFormSchema>;

export const CreateUserRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateKYCRequestSchema = KYCFormSchema;

export type UpdateKYCRequest = z.infer<typeof UpdateKYCRequestSchema>;
