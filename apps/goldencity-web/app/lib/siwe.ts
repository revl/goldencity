import { SiweMessage } from "siwe";
import { defaultChain } from "./wagmi.js";

const DOMAIN = import.meta.env.VITE_SIWE_DOMAIN;
const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

export async function createSIWEMessage(
  address: string,
  nonce: string,
): Promise<SiweMessage> {
  const message = new SiweMessage({
    domain: DOMAIN,
    address,
    statement: "Sign in with Ethereum to GoldenCity",
    uri: ORIGIN,
    version: "1",
    chainId: defaultChain.id,
    nonce,
  });

  return message;
}

export function formatMessage(message: SiweMessage): string {
  return message.prepareMessage();
}
