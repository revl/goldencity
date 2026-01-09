import { SiweMessage } from "siwe";
import { env } from "../config.js";

export function createSIWEMessage(params: {
  address: string;
  statement: string;
  uri: string;
  chainId: number;
  nonce: string;
}): SiweMessage {
  return new SiweMessage({
    domain: env.SIWE_DOMAIN,
    address: params.address,
    statement: params.statement,
    uri: params.uri,
    version: "1",
    chainId: params.chainId,
    nonce: params.nonce,
  });
}

export async function verifySIWEMessage(
  message: string,
  signature: string,
): Promise<SiweMessage> {
  const siweMessage = new SiweMessage(message);

  // Verify the signature - this validates the message and signature match
  await siweMessage.verify({ signature });

  // Return the parsed message (address is extracted when parsing the message string)
  // The verify() method validates but doesn't necessarily return the address
  return siweMessage;
}
