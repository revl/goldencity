import {
  csvSpec as csv
} from "@goldencity/utils-node";
import { config as dotenv } from "dotenv";
import { cleanEnv, port, str } from "envalid";

// Load environment-specific .env file
dotenv({ path: [".env", `.env.${process.env.NODE_ENV || "development"}`] });

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 3001 }),
  HOST: str({ default: "0.0.0.0" }),

  // CORS configuration
  CORS_ORIGINS: csv(),

  // Supabase configuration
  SUPABASE_URL: str({
    desc: "Supabase project URL",
  }),
  SUPABASE_ANON_KEY: str({
    desc: "Supabase anonymous key",
  }),
  SUPABASE_SERVICE_ROLE_KEY: str({
    desc: "Supabase service role key",
  }),

  // Session configuration
  SESSION_SECRET: str({
    desc: "Session encryption secret",
  }),

  // SIWE configuration
  SIWE_DOMAIN: str({
    desc: "Domain for SIWE messages",
    default: "goldencity-ymzw2sanaa-uc.a.run.app",
  }),
});
