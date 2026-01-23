-- Migration to fix legal agreements tracking table
-- This ensures all critical legal acceptance data is properly recorded
-- 
-- FOR SUPABASE: Remove BEGIN/COMMIT if running in SQL Editor
-- RECOMMENDED: Use this as a migration file instead

-- BEGIN; -- Uncomment if running locally

-- Step 1: Add missing version columns
ALTER TABLE legal_agreements 
ADD COLUMN IF NOT EXISTS refund_policy_version text,
ADD COLUMN IF NOT EXISTS licensing_version text,
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone;

-- Step 2: Set default values for existing NULL records
-- (You may want to handle this differently based on your business rules)
UPDATE legal_agreements 
SET 
    tos_accepted = COALESCE(tos_accepted, false),
    refund_policy_accepted = COALESCE(refund_policy_accepted, false),
    licensing_accepted = COALESCE(licensing_accepted, false),
    privacy_accepted = COALESCE(privacy_accepted, false),
    accepted_at = COALESCE(accepted_at, created_at, NOW()),
    tos_version = COALESCE(tos_version, 'unknown'),
    privacy_version = COALESCE(privacy_version, 'unknown'),
    refund_policy_version = COALESCE(refund_policy_version, 'unknown'),
    licensing_version = COALESCE(licensing_version, 'unknown'),
    ip_address = COALESCE(ip_address, 'not_recorded')
WHERE 
    tos_accepted IS NULL 
    OR refund_policy_accepted IS NULL 
    OR licensing_accepted IS NULL 
    OR privacy_accepted IS NULL
    OR accepted_at IS NULL
    OR tos_version IS NULL
    OR privacy_version IS NULL
    OR ip_address IS NULL;

-- Step 3: Make critical fields NOT NULL
ALTER TABLE legal_agreements 
ALTER COLUMN tos_accepted SET NOT NULL,
ALTER COLUMN refund_policy_accepted SET NOT NULL,
ALTER COLUMN licensing_accepted SET NOT NULL,
ALTER COLUMN privacy_accepted SET NOT NULL,
ALTER COLUMN accepted_at SET NOT NULL,
ALTER COLUMN tos_version SET NOT NULL,
ALTER COLUMN privacy_version SET NOT NULL,
ALTER COLUMN refund_policy_version SET NOT NULL,
ALTER COLUMN licensing_version SET NOT NULL,
ALTER COLUMN ip_address SET NOT NULL;

-- Step 4: Set default values for new records
ALTER TABLE legal_agreements 
ALTER COLUMN tos_accepted SET DEFAULT false,
ALTER COLUMN refund_policy_accepted SET DEFAULT false,
ALTER COLUMN licensing_accepted SET DEFAULT false,
ALTER COLUMN privacy_accepted SET DEFAULT false,
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN accepted_at SET DEFAULT NOW();

-- Step 5: Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legal_agreements_updated_at 
    BEFORE UPDATE ON legal_agreements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Add check constraints to ensure all agreements are accepted together
ALTER TABLE legal_agreements 
ADD CONSTRAINT all_agreements_accepted CHECK (
    (tos_accepted = true AND 
     refund_policy_accepted = true AND 
     licensing_accepted = true AND 
     privacy_accepted = true)
    OR
    (tos_accepted = false AND 
     refund_policy_accepted = false AND 
     licensing_accepted = false AND 
     privacy_accepted = false)
);

-- Step 7: Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_legal_agreements_user_id ON legal_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_agreements_order_id ON legal_agreements(order_id);
CREATE INDEX IF NOT EXISTS idx_legal_agreements_accepted_at ON legal_agreements(accepted_at);
CREATE INDEX IF NOT EXISTS idx_legal_agreements_user_accepted ON legal_agreements(user_id, tos_accepted);

COMMIT; -- Uncomment if running locally

-- ROLLBACK; -- Uncomment if you need to undo

-- ============================================
-- SUPABASE SQL EDITOR INSTRUCTIONS:
-- ============================================
-- 1. First, CHECK your existing data:
--    SELECT * FROM legal_agreements WHERE tos_accepted IS NULL LIMIT 10;
--
-- 2. Run this migration in SECTIONS, not all at once
-- 3. Do NOT include BEGIN/COMMIT in SQL Editor
-- 4. BACKUP your data first using Supabase dashboard
--
-- ============================================

-- Rollback script (save this separately)
/*
BEGIN;

ALTER TABLE legal_agreements 
ALTER COLUMN tos_accepted DROP NOT NULL,
ALTER COLUMN refund_policy_accepted DROP NOT NULL,
ALTER COLUMN licensing_accepted DROP NOT NULL,
ALTER COLUMN privacy_accepted DROP NOT NULL,
ALTER COLUMN accepted_at DROP NOT NULL,
ALTER COLUMN tos_version DROP NOT NULL,
ALTER COLUMN privacy_version DROP NOT NULL,
ALTER COLUMN refund_policy_version DROP NOT NULL,
ALTER COLUMN licensing_version DROP NOT NULL,
ALTER COLUMN ip_address DROP NOT NULL;

ALTER TABLE legal_agreements DROP CONSTRAINT IF EXISTS all_agreements_accepted;

DROP TRIGGER IF EXISTS update_legal_agreements_updated_at ON legal_agreements;
DROP FUNCTION IF EXISTS update_updated_at_column();

ALTER TABLE legal_agreements 
DROP COLUMN IF EXISTS refund_policy_version,
DROP COLUMN IF EXISTS licensing_version,
DROP COLUMN IF EXISTS updated_at;

COMMIT;
*/