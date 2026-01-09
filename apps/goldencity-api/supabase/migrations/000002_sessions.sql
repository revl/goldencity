-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_sessions_wallet_address ON sessions(wallet_address);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Add foreign key constraint (optional, for referential integrity)
-- ALTER TABLE sessions ADD CONSTRAINT fk_sessions_wallet_address
--   FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
--   ON DELETE CASCADE;
