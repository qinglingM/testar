import { motion } from "framer-motion";
import { ChevronLeft, Ticket, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";

const CouponsPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout className="bg-muted/30">
      <Header 
        title="福利优惠中心" 
        onBack={() => navigate(-1)} 
      />

      <div className="px-6 pt-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner"
        >
          <Ticket className="w-10 h-10" />
        </motion.div>
        
        <h2 className="text-xl font-display font-black text-foreground mb-2">空空如也</h2>
        <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
          目前还没有可用的优惠券或福利。探索之旅才刚刚开始，敬请期待后续补给！
        </p>

        <button 
          onClick={() => navigate('/')}
          className="mt-10 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-sm btn-press shadow-xl shadow-primary/20"
        >
          去看看热门探测
        </button>
      </div>

      <div className="px-10 mt-10">
        <div className="p-6 rounded-[2.5rem] bg-background border border-border/50 border-dashed text-center">
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">
             Testar Reward System v1.0
           </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CouponsPage;
