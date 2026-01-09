import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";
import {
  getCurrentUser,
  submitKYC,
  completeOnboarding,
} from "../lib/api.client.js";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function OnboardingKYCRoute() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
  });
  const [user, setUser] = useState<{
    kycStatus: "pending" | "approved" | "rejected";
    onboardingCompleted: boolean;
  } | null>(null);

  useEffect(() => {
    if (!address) {
      navigate("/onboarding/wallet");
      return;
    }

    // Check user status
    getCurrentUser()
      .then((userData) => {
        setUser({
          kycStatus: userData.kycStatus,
          onboardingCompleted: userData.onboardingCompleted,
        });

        if (userData.onboardingCompleted) {
          navigate("/dashboard");
        } else if (userData.kycStatus === "approved") {
          // Auto-complete onboarding if KYC is approved
          handleCompleteOnboarding();
        }
      })
      .catch(() => {
        // User might not exist yet, that's okay
      });
  }, [address, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await submitKYC(formData);
      setUser({
        kycStatus: updatedUser.kycStatus,
        onboardingCompleted: updatedUser.onboardingCompleted,
      });

      // If KYC is approved, complete onboarding
      if (updatedUser.kycStatus === "approved") {
        await handleCompleteOnboarding();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      const updatedUser = await completeOnboarding();
      setUser({
        kycStatus: updatedUser.kycStatus,
        onboardingCompleted: updatedUser.onboardingCompleted,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete onboarding",
      );
    }
  };

  if (user?.kycStatus === "approved" && user.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-primary text-text">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-secondary p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-bold">Onboarding Complete!</h1>
            <p className="mt-2 text-text-secondary">
              You're all set to start investing with GoldenCity.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-secondary p-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-text-secondary">
            Please provide some basic information to complete your KYC
            verification.
          </p>

          {user?.kycStatus === "approved" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p>KYC verification approved!</p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-border bg-primary px-3 py-2 text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-border bg-primary px-3 py-2 text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-text"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-border bg-primary px-3 py-2 text-text focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || user?.kycStatus === "approved"}
              className="mt-6 w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : user?.kycStatus === "approved"
                  ? "KYC Approved"
                  : "Submit KYC"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
