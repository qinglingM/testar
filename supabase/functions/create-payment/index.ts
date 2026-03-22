import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, planId, paymentMethod, quizId, amount } = await req.json()

    // 1. Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Insert record into orders table (Pending)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        product_type: planId,
        amount: amount,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 3. Call Payment Service Provider (PSP)
    // This is where you'd call WeChat/Alipay/Stripe API
    // For now, we'll return a mock payment URL and a real order ID
    let paymentUrl = ""
    
    if (paymentMethod === 'alipay') {
      // Mock calling Alipay SDK
      // const alipayUrl = await alipay.pagePay({ outTradeNo: order.id, totalAmount: amount, subject: planId })
      paymentUrl = `https://mock-alipay.com/pay?order_id=${order.id}`
    } else if (paymentMethod === 'wechat') {
      // Mock calling WeChat SDK
      // const codeUrl = await wechat.h5Pay({ out_trade_no: order.id, total_fee: amount * 100 })
      paymentUrl = `https://mock-wechat.com/pay?order_id=${order.id}`
    }

    return new Response(
      JSON.stringify({ 
        orderId: order.id, 
        paymentUrl: paymentUrl,
        message: "Order created successfully. Please complete payment."
      }),
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
