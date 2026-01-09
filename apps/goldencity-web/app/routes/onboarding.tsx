import { redirect } from "react-router";
import type { Route } from "./+types/onboarding";

export async function loader({}: Route.LoaderArgs) {
  // Redirect to wallet connection step
  return redirect("/onboarding/wallet");
}
