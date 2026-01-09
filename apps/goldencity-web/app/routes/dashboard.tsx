import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAccount, useDisconnect } from "wagmi";
import { getCurrentUser, logout } from "../lib/api.client.js";
import { Building2, Wallet, CheckCircle } from "lucide-react";

export default function DashboardRoute() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    walletAddress: string;
    kycStatus: "pending" | "approved" | "rejected";
    onboardingCompleted: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      navigate("/onboarding/wallet");
      return;
    }

    getCurrentUser()
      .then((userData) => {
        setUser(userData);
        if (!userData.onboardingCompleted) {
          navigate("/onboarding/kyc");
        }
      })
      .catch(() => {
        navigate("/onboarding/wallet");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isConnected, address, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      disconnect();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-text">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <header className="border-b border-border bg-secondary">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="font-semibold">GoldenCity</div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-primary"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Welcome to your GoldenCity investment dashboard.
        </p>

        {user && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary p-6">
              <div className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-sm text-text-secondary">Wallet Address</p>
                  <p className="mt-1 font-mono text-sm">{user.walletAddress}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary p-6">
              <div className="flex items-center gap-3">
                <CheckCircle
                  className={`h-6 w-6 ${
                    user.kycStatus === "approved"
                      ? "text-green-500"
                      : "text-text-secondary"
                  }`}
                />
                <div>
                  <p className="text-sm text-text-secondary">KYC Status</p>
                  <p className="mt-1 font-semibold capitalize">
                    {user.kycStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-sm text-text-secondary">Properties</p>
                  <p className="mt-1 text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 rounded-lg border border-border bg-secondary p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-text-secondary" />
          <h2 className="mt-4 text-2xl font-bold">Start Investing</h2>
          <p className="mt-2 text-text-secondary">
            Browse available properties and start your real estate investment
            journey.
          </p>
          <p className="mt-4 text-sm text-text-secondary">
            Property listings coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
