import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate / Verify Signature from PSP
    // const signature = req.headers.get('x-psp-signature')
    const body = await req.json()
    
    // VERIFY SIGNATURE LOGIC HERE (CRITICAL FOR SECURITY)
    // if (!verify(body, signature)) throw new Error('Invalid signature')

    const { order_id, status } = body // Simplified for demonstration

    // 2. Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Update order status
    if (status === 'success') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order_id)
        .eq('status', 'pending') // Only update if still pending

      if (updateError) throw updateError
      
      // Note: Trigger in SQL will handle profiles.is_vip update
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
