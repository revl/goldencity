import { AlertCircle, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import {
  createUser,
  getCurrentUser,
  getNonce,
  signInWithEthereum,
} from "../lib/api.client.js";
import { createSIWEMessage, formatMessage } from "../lib/siwe.js";
import { defaultChain } from "../lib/wagmi.js";

export default function OnboardingWalletRoute() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const navigate = useNavigate();
  const { signMessageAsync } = useSignMessage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isWrongNetwork = chainId !== defaultChain.id;

  const handleConnect = async (connectorId: string) => {
    try {
      setError(null);
      const connector = connectors.find((c) => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const handleSignIn = async () => {
    if (!address || isWrongNetwork) return;

    try {
      setLoading(true);
      setError(null);

      // Get nonce from API
      const { nonce } = await getNonce();

      // Create SIWE message
      const siweMessage = await createSIWEMessage(address, nonce);
      const message = formatMessage(siweMessage);

      // Request signature
      const signature = await signMessageAsync({ message });

      // Send to API
      await signInWithEthereum({ message, signature });

      // Create or get user
      try {
        await createUser({ walletAddress: address });
      } catch (err) {
        // User might already exist, try to get current user
        try {
          await getCurrentUser();
        } catch (getErr) {
          // If both fail, continue anyway
        }
      }

      // Navigate to KYC step
      navigate("/onboarding/kyc");
    } catch (err) {
      if (err instanceof Error && err.message.includes("User rejected")) {
        setError("Signature request was rejected");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to sign in: " + JSON.stringify(err),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary text-text min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border-border bg-secondary rounded-lg border p-8">
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="text-text-secondary mt-2">
            Connect your Ethereum wallet to get started with GoldenCity.
          </p>

          {isWrongNetwork && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Wrong Network</p>
                <p className="text-sm">
                  Please switch to {defaultChain.name} to continue.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {!isConnected ? (
            <div className="mt-6 space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
                  className="border-border bg-primary hover:bg-secondary flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 font-medium disabled:opacity-50"
                >
                  <Wallet className="h-5 w-5" />
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <div className="border-border bg-primary rounded-lg border p-4">
                <p className="text-text-secondary text-sm">Connected Wallet</p>
                <p className="mt-1 font-mono text-sm">{address}</p>
                <button
                  onClick={() => disconnect()}
                  className="text-text-secondary hover:text-text mt-4 text-sm"
                >
                  Disconnect
                </button>
              </div>

              {!isWrongNetwork && (
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="bg-accent mt-6 w-full rounded-lg px-4 py-3 font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Signing..." : "Sign In with Ethereum"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
