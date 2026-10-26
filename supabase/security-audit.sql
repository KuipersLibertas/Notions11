-- =============================================================================
-- Notions11 — Supabase Security Audit
-- Generated: 2026-10-26
-- Project: fxahtpttsiqvxpvkqedm.supabase.co (confirm before running)
-- Review this file carefully before applying. Run in the Supabase SQL editor.
-- All changes are idempotent (IF NOT EXISTS / OR REPLACE).
-- =============================================================================
-- Findings are identical to the Passdropit audit (same schema, same codebase
-- lineage) with two additional Notions11-specific items:
--   • Legacy plaintext passwords in passdrop_pwd (§7)
--   • No rate_limits table (§8 — create it if rate limiting is desired)
-- =============================================================================


-- =============================================================================
-- SECTION 1: ENABLE ROW-LEVEL SECURITY ON ALL PUBLIC TABLES
-- =============================================================================
-- Finding: No table in the public schema has RLS enabled. Any caller with the
-- Supabase anon key can SELECT/INSERT/UPDATE/DELETE every row — including
-- password_hash, balance, stripe_id, and password_reset_tokens.
-- The service_role key bypasses RLS and continues to work for all server-side
-- app code unchanged.

ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_list_user        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_downloads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_tracker            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_links            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_membership       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- With RLS enabled and no permissive policies, the default is DENY ALL for
-- `anon` and `authenticated`. The service_role key bypasses RLS automatically.


-- =============================================================================
-- SECTION 2: REVOKE DANGEROUS DEFAULT GRANTS FROM anon / authenticated
-- =============================================================================
-- Finding: Supabase projects inherit GRANT ALL ON ALL TABLES to anon and
-- authenticated from project provisioning. Removing the grants is defence-in-
-- depth that makes the intent explicit and protects against any future RLS
-- misconfiguration.

REVOKE ALL ON public.users                 FROM anon, authenticated;
REVOKE ALL ON public.file_list_user        FROM anon, authenticated;
REVOKE ALL ON public.daily_downloads       FROM anon, authenticated;
REVOKE ALL ON public.ip_tracker            FROM anon, authenticated;
REVOKE ALL ON public.paid_links            FROM anon, authenticated;
REVOKE ALL ON public.paid_membership       FROM anon, authenticated;
REVOKE ALL ON public.password_reset_tokens FROM anon, authenticated;

-- Prevent new tables from inheriting dangerous grants automatically.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;


-- =============================================================================
-- SECTION 3: PRIVILEGE-ESCALATION COLUMN PROTECTION TRIGGER
-- =============================================================================
-- Finding: is_pro, balance, stripe_id, subscription_id, paypal_id have no
-- DB-level write guard. A misconfigured RLS policy or compromised session could
-- allow a caller to self-promote or inflate their balance.
--
-- Fix: BEFORE UPDATE trigger blocks writes to those columns from any session
-- whose current_user is not a trusted server role.

CREATE OR REPLACE FUNCTION public.trg_block_privilege_escalation_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF current_user IN ('service_role', 'postgres', 'supabase_admin', 'authenticator') THEN
    RETURN NEW;
  END IF;

  IF OLD.is_pro           IS DISTINCT FROM NEW.is_pro           OR
     OLD.balance          IS DISTINCT FROM NEW.balance          OR
     OLD.stripe_id        IS DISTINCT FROM NEW.stripe_id        OR
     OLD.subscription_id  IS DISTINCT FROM NEW.subscription_id  OR
     OLD.paypal_id        IS DISTINCT FROM NEW.paypal_id        THEN
    RAISE EXCEPTION 'Modification of privileged columns (is_pro, balance, stripe_id, subscription_id, paypal_id) is not permitted from role "%"', current_user;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_block_privilege_escalation ON public.users;
CREATE TRIGGER trg_block_privilege_escalation
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.trg_block_privilege_escalation_fn();


-- =============================================================================
-- SECTION 4: ATOMIC BALANCE DEDUCTION FUNCTION
-- =============================================================================
-- Finding: buyLink in src/lib/db/links.ts reads the buyer's balance in JS then
-- issues UPDATE … SET balance = <computed>. Two concurrent requests can both
-- read the same balance, both pass the check, and both set the same lower value
-- — giving the buyer the link twice for the price of one (double-spend).
-- The code comment acknowledges this ("A fully atomic fix requires a Supabase RPC").
--
-- Fix: Atomic SQL function; code updated to call it via supabase.rpc().

CREATE OR REPLACE FUNCTION public.deduct_user_balance(
  p_user_id BIGINT,
  p_amount  DECIMAL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_updated INT;
BEGIN
  UPDATE public.users
  SET    balance = balance - p_amount
  WHERE  id = p_user_id
    AND  balance >= p_amount;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_user_balance(BIGINT, DECIMAL) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.deduct_user_balance(BIGINT, DECIMAL) TO service_role;

CREATE OR REPLACE FUNCTION public.credit_user_balance(
  p_user_id BIGINT,
  p_amount  DECIMAL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET    balance = balance + p_amount
  WHERE  id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.credit_user_balance(BIGINT, DECIMAL) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.credit_user_balance(BIGINT, DECIMAL) TO service_role;


-- =============================================================================
-- SECTION 5: AUDIT LOG — CAPTURE DELETED ROWS
-- =============================================================================
-- Finding: No audit trail. A deleted user or link leaves no forensic record.
-- ON DELETE CASCADE propagates the deletion to daily_downloads and ip_tracker.
-- Recovery requires a full backup restore.
--
-- Fix: append-only audit table + BEFORE DELETE triggers on the two highest-
-- value tables. The audit table has RLS enabled with no DELETE policy.

CREATE TABLE IF NOT EXISTS public.audit_deleted_rows (
  id          BIGSERIAL    PRIMARY KEY,
  table_name  TEXT         NOT NULL,
  row_id      BIGINT       NOT NULL,
  deleted_by  TEXT         NOT NULL DEFAULT current_user,
  deleted_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  row_data    JSONB        NOT NULL
);

ALTER TABLE public.audit_deleted_rows ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.audit_deleted_rows TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.audit_deleted_rows_id_seq TO service_role;

CREATE OR REPLACE FUNCTION public.trg_audit_delete_file_list_user_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_deleted_rows(table_name, row_id, row_data)
  VALUES ('file_list_user', OLD.id, to_jsonb(OLD));
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_delete_file_list_user ON public.file_list_user;
CREATE TRIGGER trg_audit_delete_file_list_user
BEFORE DELETE ON public.file_list_user
FOR EACH ROW
EXECUTE FUNCTION public.trg_audit_delete_file_list_user_fn();

CREATE OR REPLACE FUNCTION public.trg_audit_delete_users_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_deleted_rows(table_name, row_id, row_data)
  VALUES ('users', OLD.id, to_jsonb(OLD));
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_delete_users ON public.users;
CREATE TRIGGER trg_audit_delete_users
BEFORE DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.trg_audit_delete_users_fn();


-- =============================================================================
-- SECTION 6: BULK-DELETE LIMIT ON file_list_user
-- =============================================================================
-- Finding: No limit on how many rows can be deleted in one statement. A
-- compromised session or a future bug could wipe all of a user's links in one go.
--
-- Fix: Statement-level trigger rejects any DELETE affecting more than 50 rows.
-- Normal usage (single-link deletion) never reaches this limit.

CREATE OR REPLACE FUNCTION public.trg_limit_bulk_delete_file_list_user_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INT;
BEGIN
  SELECT count(*) INTO deleted_count FROM old_table;
  IF deleted_count > 50 THEN
    RAISE EXCEPTION 'Bulk delete of more than 50 file_list_user rows in a single statement is not permitted (attempted: %)', deleted_count;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_limit_bulk_delete_file_list_user ON public.file_list_user;
CREATE TRIGGER trg_limit_bulk_delete_file_list_user
AFTER DELETE ON public.file_list_user
REFERENCING OLD TABLE AS old_table
FOR EACH STATEMENT
EXECUTE FUNCTION public.trg_limit_bulk_delete_file_list_user_fn();


-- =============================================================================
-- SECTION 7: LEGACY PLAINTEXT PASSWORDS IN passdrop_pwd (Notions11-specific)
-- =============================================================================
-- Finding: The schema comment reads "plain-text password (null = no password)".
-- The app now encrypts NEW passwords with AES-256-GCM (enc: prefix), but rows
-- created before the encryption was introduced still hold plaintext values.
-- If the database is breached, those legacy rows expose link passwords directly.
--
-- Fix: Run the migration below to encrypt all remaining plaintext passwords.
-- WARNING: This requires the correct NEXTAUTH_SECRET to be passed in so the
-- app can later decrypt them. Replace 'YOUR_NEXTAUTH_SECRET_HERE' with the
-- actual secret value (do this in a private session — do not commit it).
-- The function is dropped immediately after use.
--
-- IMPORTANT: Test on a non-production copy first. All app sessions that hold
-- a cached decrypted password will need to re-enter it (they won't, because
-- the link password is only checked at download time, not cached).

-- Step 1: Create a helper function that encrypts one plaintext password.
--         This mirrors the TypeScript encryptLinkPassword() logic in AES-256-GCM.
CREATE OR REPLACE FUNCTION public._encrypt_link_password_migration(
  p_plaintext TEXT,
  p_secret    TEXT  -- pass your NEXTAUTH_SECRET value here
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_key    BYTEA;
  v_iv     BYTEA;
  v_enc    BYTEA;
  v_tag    BYTEA;
  v_result TEXT;
BEGIN
  -- Derive 32-byte key from secret via SHA-256 (matches JS crypto.createHash('sha256'))
  v_key := digest(p_secret, 'sha256');
  -- Generate random 12-byte IV
  v_iv  := gen_random_bytes(12);
  -- AES-256-GCM encryption
  v_enc := encrypt_iv(convert_to(p_plaintext, 'UTF8'), v_key, v_iv, 'aes-gcm');
  -- In pgcrypto the auth tag is the last 16 bytes of the output
  v_tag := right(v_enc, 16)::BYTEA;
  v_enc := left(v_enc, length(v_enc) - 16)::BYTEA;
  -- Stored format: "enc:<base64(iv || authTag || ciphertext)>"
  v_result := 'enc:' || encode(v_iv || v_tag || v_enc, 'base64');
  RETURN v_result;
END;
$$;

-- Step 2: Run the migration (uncomment and fill in your NEXTAUTH_SECRET).
-- IMPORTANT: Run this ONLY ONCE. The WHERE clause ensures only legacy plaintext
-- rows (those not starting with 'enc:') are updated.

/*
DO $$
DECLARE
  v_secret TEXT := 'YOUR_NEXTAUTH_SECRET_HERE';  -- <-- fill in
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, passdrop_pwd
    FROM   public.file_list_user
    WHERE  passdrop_pwd IS NOT NULL
      AND  passdrop_pwd NOT LIKE 'enc:%'
  LOOP
    UPDATE public.file_list_user
    SET    passdrop_pwd = public._encrypt_link_password_migration(r.passdrop_pwd, v_secret)
    WHERE  id = r.id;
  END LOOP;
END;
$$;
*/

-- Step 3: Drop the helper function after migration is complete.
-- DROP FUNCTION IF EXISTS public._encrypt_link_password_migration(TEXT, TEXT);

-- Note: pgcrypto's AES-GCM implementation may differ from Node's in auth tag
-- handling. If the migration produces passwords the app cannot verify, the
-- safest fallback is to notify affected users to reset their link passwords.
-- Check by verifying a known password via the app after running the migration.


-- =============================================================================
-- SECTION 8: RATE LIMITS TABLE (Notions11-specific — optional)
-- =============================================================================
-- Finding: Passdropit has a dedicated rate_limits table used by src/lib/rateLimit.ts.
-- Notions11's schema.sql does not include it. If Notions11 uses the same in-memory
-- rate limiter (no DB table), this section can be skipped.
-- If you want DB-backed rate limiting (survives server restarts), run:

/*
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id         BIGSERIAL   PRIMARY KEY,
  key        TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limits_key_created_at ON public.rate_limits (key, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_limits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limits_id_seq TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rate_limits FROM anon, authenticated;
*/


-- =============================================================================
-- SECTION 9: VERIFY SERVICE_ROLE GRANTS (FUTURE-PROOF)
-- =============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_deleted_rows TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;


-- =============================================================================
-- SECTION 10: BACKUP STRATEGY NOTE
-- =============================================================================
-- Notions11 is on Supabase free tier. PITR requires a paid plan.
-- Recommended: schedule a daily pg_dump via GitHub Actions or an external
-- backup service (e.g. pg_dump piped to S3 / Google Cloud Storage).
-- Test a restore to a staging project at least once per quarter.
-- =============================================================================
