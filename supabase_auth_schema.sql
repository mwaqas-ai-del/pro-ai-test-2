-- Supabase authorization schema for the admin dashboard.
-- Run this in Supabase SQL Editor with database-owner privileges.
-- The frontend anon key must NOT be allowed to read/write these tables directly.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.admin_auth_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'disabled')),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_auth_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.admin_auth_users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager')),
  purpose TEXT NOT NULL CHECK (purpose IN ('registration', 'password_reset')),
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_auth_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.admin_auth_users(id) ON DELETE SET NULL,
  email TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'registration_requested',
    'registration_verified',
    'login_success',
    'login_failed',
    'password_reset_requested',
    'password_reset_code_verified',
    'password_reset_completed',
    'auth_code_failed',
    'account_disabled'
  )),
  event_detail JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_auth_users_email
  ON public.admin_auth_users(email);

CREATE INDEX IF NOT EXISTS idx_admin_auth_users_status_role
  ON public.admin_auth_users(status, role);

CREATE INDEX IF NOT EXISTS idx_admin_auth_codes_email_purpose
  ON public.admin_auth_codes(email, purpose);

CREATE INDEX IF NOT EXISTS idx_admin_auth_codes_expires_at
  ON public.admin_auth_codes(expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_auth_audit_logs_email
  ON public.admin_auth_audit_logs(email);

CREATE INDEX IF NOT EXISTS idx_admin_auth_audit_logs_created_at
  ON public.admin_auth_audit_logs(created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_admin_auth_users_updated_at ON public.admin_auth_users;
CREATE TRIGGER set_admin_auth_users_updated_at
BEFORE UPDATE ON public.admin_auth_users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.admin_auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_auth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies are created intentionally.
-- n8n should use Supabase service-role/database credentials to:
-- 1. Hash passwords with crypt(password, gen_salt('bf')) before insert/update.
-- 2. Hash OTP codes before insert.
-- 3. Verify with password_hash = crypt(input_password, password_hash).
-- 4. Verify OTP by matching code_hash, purpose, email, consumed_at IS NULL, and expires_at > NOW().

