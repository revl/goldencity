import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layouts/pages.tsx", [
    route("/onboarding", "routes/onboarding.tsx"),
    route("/onboarding/wallet", "routes/onboarding.wallet.tsx"),
    route("/onboarding/kyc", "routes/onboarding.kyc.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/privacy", "routes/privacy.tsx"),
    route("/terms", "routes/terms.tsx"),
  ]),
] satisfies RouteConfig;
