-- Insert new activation codes based on re-defined tiers
INSERT INTO public.activation_codes (code, tier, max_redemptions) VALUES 
('BASI-TEST-0001-B001', 'basi', 100),
('BASI-TEST-0002-B002', 'basi', 100),
('UPGD-TEST-0001-U001', 'upgd', 100),
('TPRO-TEST-0001-P001', 'tpro', 100),
('TMAX-TEST-0001-M001', 'tmax', 100);
