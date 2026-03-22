import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Zap, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { track } from "@/utils/analytics";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import wechatIcon from "@/assets/icons/wechat-pay.svg";
import alipayIcon from "@/assets/icons/alipay.svg";

interface VipPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VipPricingModal = ({ isOpen, onClose }: VipPricingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const setVip = useQuizStore(state => state.setVip);
  const user = useQuizStore(state => state.user);
  const { slug } = useParams();
  const paywallOpenTime = useRef<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');

  useEffect(() => {
    if (isOpen) {
      paywallOpenTime.current = Date.now();
      track('paywall_view', {
        quiz_id: slug,
        paywall_type: 'member_offer', // or 'single_unlock' depending on context
        trigger_point: 'report_unlock'
      });
    }
  }, [isOpen, slug]);

  const handleSubscription = async (planId: string, price: string) => {
    if (!user) {
      toast.error("请先登录再进行购买");
      return;
    }

    const decisionTime = paywallOpenTime.current > 0 
      ? (Date.now() - paywallOpenTime.current) / 1000 
      : 0;

    track('purchase_click', {
      product_type: planId,
      payment_method: paymentMethod,
      quiz_id: slug,
      price: parseFloat(price),
      decision_time: decisionTime
    });

    setIsLoading(true);
    
    try {
      // 1. Call Create Payment Edge Function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          userId: user.id,
          planId: planId,
          paymentMethod: paymentMethod,
          quizId: slug,
          amount: parseFloat(price)
        }
      });

      if (error) throw error;
      if (!data?.paymentUrl) throw new Error("无法获取支付链接");

      // 2. Redirect to payment page or open in new tab
      // In a real mobile environment, this might trigger a deep link or redirect
      window.location.href = data.paymentUrl;

    } catch (err: any) {
      console.error('[Payment] Initiation failed', err);
      toast.error(`支付发起失败: ${err.message || '未知错误'}`);
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: "single",
      title: "单次深度解锁",
      price: "9.9",
      unit: "/测评",
      features: ["解锁单本报告全部维度", "高清灵魂海报导出", "关键维度深度解析"],
      recommend: false
    },
    {
      id: "yearly",
      title: "探测星 VIP 年度会员",
      price: "49",
      unit: "/年",
      features: ["全站测评无限次解锁", "专属 VIP 高阶画像", "永久存档与历史回溯", "优先体验实验室新品"],
      recommend: true
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-background rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pt-6 pb-12 shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar"
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8 sm:hidden opacity-40" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-display font-bold">解锁深度探测权限</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Feature Grid Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => setPaymentMethod('wechat')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'wechat' ? 'border-primary bg-primary/5' : 'border-border/50 bg-muted/20'
                  }`}
                >
                  <img src={wechatIcon} alt="WeChat" className="w-5 h-5" />
                  <span className="text-xs font-bold">微信支付</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('alipay')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'alipay' ? 'border-primary bg-primary/5' : 'border-border/50 bg-muted/20'
                  }`}
                >
                  <img src={alipayIcon} alt="Alipay" className="w-5 h-5" />
                  <span className="text-xs font-bold">支付宝</span>
                </button>
              </div>

              {/* Pricing Cards */}
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`relative p-6 rounded-3xl border-2 transition-all ${
                      plan.recommend ? 'border-primary bg-primary/5' : 'border-border/50 bg-muted/20'
                    }`}
                  >
                    {plan.recommend && (
                      <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-foreground/70">{plan.title}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-display font-black">¥{plan.price}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">{plan.unit}</span>
                        </div>
                      </div>
                      {plan.recommend && <Sparkles className="w-5 h-5 text-primary" />}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                          <Check className={`w-3 h-3 ${plan.recommend ? 'text-primary' : 'text-muted-foreground'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button 
                      disabled={isLoading}
                      onClick={() => handleSubscription(plan.id, plan.price)}
                      className={`w-full py-4 rounded-2xl font-display font-bold text-sm btn-press flex items-center justify-center gap-2 transition-all ${
                        plan.recommend 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'bg-foreground text-background'
                      } disabled:opacity-50`}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "立即完成订阅"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   支付即代表您同意 <span className="text-foreground underline underline-offset-2">订阅服务协议</span>
                   <br />
                   订阅将自动续费，可随时在设置中取消。
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FeatureSmall = ({ icon: Icon, label, desc }: any) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40">
    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-foreground leading-tight">{label}</p>
      <p className="text-[8px] text-muted-foreground mt-0.5">{desc}</p>
    </div>
  </div>
);

export default VipPricingModal;
