-- Fix alignment of activation tiers across all tables
BEGIN;

-- 1. Update activation_codes constraint (if not already done)
ALTER TABLE public.activation_codes DROP CONSTRAINT IF EXISTS activation_codes_tier_valid;
ALTER TABLE public.activation_codes ADD CONSTRAINT activation_codes_tier_valid 
  CHECK (tier IN ('basi', 'upgd', 'tpro', 'tmax'));

-- 2. Update activation_redemptions constraint (CRITICAL FIX)
ALTER TABLE public.activation_redemptions DROP CONSTRAINT IF EXISTS activation_redemptions_effective_tier_valid;
ALTER TABLE public.activation_redemptions ADD CONSTRAINT activation_redemptions_effective_tier_valid 
  CHECK (effective_tier IN ('basi', 'tpro', 'tmax', 'base', 'pro')); -- Including legacy and new to be safe

COMMIT;
