const API_URL = import.meta.env.VITE_API_SERVER_URL;

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Request failed",
    }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export async function getNonce(): Promise<{ nonce: string }> {
  return apiRequest("/api/v1/auth/nonce");
}

export async function signInWithEthereum(data: {
  message: string;
  signature: string;
}): Promise<{ success: boolean; walletAddress: string }> {
  return apiRequest("/api/v1/auth/siwe", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<{ success: boolean }> {
  return apiRequest("/api/v1/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<{
  walletAddress: string;
  kycStatus: "pending" | "approved" | "rejected";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}> {
  return apiRequest("/api/v1/users/me");
}

export async function createUser(data: { walletAddress: string }): Promise<{
  walletAddress: string;
  kycStatus: "pending" | "approved" | "rejected";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}> {
  return apiRequest("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitKYC(data: {
  name: string;
  email: string;
  country: string;
}): Promise<{
  walletAddress: string;
  kycStatus: "pending" | "approved" | "rejected";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}> {
  return apiRequest("/api/v1/users/kyc", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function completeOnboarding(): Promise<{
  walletAddress: string;
  kycStatus: "pending" | "approved" | "rejected";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}> {
  return apiRequest("/api/v1/users/onboarding/complete", { method: "POST" });
}
