-- Seed more realistic activation codes for new tiers
DELETE FROM public.activation_codes;

INSERT INTO public.activation_codes (code, tier, max_redemptions) VALUES 
('BASI-2938-1029-4822', 'basi', 100),
('BASI-5948-2831-9921', 'basi', 100),
('UPGD-4822-1928-3301', 'upgd', 100),
('UPGD-8821-2291-5502', 'upgd', 100),
('TPRO-2811-9921-3811', 'tpro', 100),
('TMAX-2024-VVIP-0001', 'tmax', 100),
('TMAX-8888-6666-9999', 'tmax', 100),
('TMAX-STAR-GAZE-7777', 'tmax', 100),
('TMAX-FLOW-MEMB-1111', 'tmax', 100);
