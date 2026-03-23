-- SQL Schema for Testar Supabase Backend

-- 1. Profiles Table (User settings & VIP status)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname TEXT,
    avatar_url TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    metadata JSONB DEFAULT "{}");

-- 2. Quiz Reports Table (Persistent test results)
CREATE TABLE IF NOT EXISTS public.quiz_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    result_id TEXT NOT NULL,
    scores JSONB NOT NULL,
    professional_scores JSONB NOT NULL,
    metadata JSONB NOT NULL, -- Includes rarity, synergyTags, dominantTraits, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table (Payment & Unlock tracking)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT,
    product_type TEXT NOT NULL, -- 'single_unlock' | 'member_yearly'
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'failed'
    order_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic Examples
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to see/edit their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Allow users to see/add their own reports
CREATE POLICY "Users can view their own reports" ON public.quiz_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reports" ON public.quiz_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to see their own orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- 4. Payment Integration Enhancements
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT; -- 'wechat' | 'alipay'

-- 5. VIP Synchronization Trigger
-- Automatically update profile's is_vip when a relevant order is completed
CREATE OR REPLACE FUNCTION public.sync_vip_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (NEW.product_type = 'member_yearly' OR NEW.product_type = 'member_monthly') THEN
        UPDATE public.profiles
        SET is_vip = TRUE, updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_completed ON public.orders;
CREATE TRIGGER on_order_completed
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION public.sync_vip_status();

-- Enable Realtime for orders table to allow frontend polling/listening
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
