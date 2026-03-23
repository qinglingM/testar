import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Crown, Shield, Settings, LogIn, ChevronRight, ChevronLeft, Gift, 
  FileText, Bell, HelpCircle, Eye, User, Star, LogOut, Key
} from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import VipPricingModal from "../payment/VipPricingModal";
import { toast } from "sonner";

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDrawer = ({ isOpen, onClose }: UserDrawerProps) => {
  const navigate = useNavigate();
  const user = useQuizStore(state => state.user);
  const logout = useQuizStore(state => state.logout);
  const completedCount = useQuizStore(state => state.completedReports.length);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const showHelpSupport = () => {
    toast("关注公众号以获得高级支持", {
      description: "微信公众号搜索：TESTSAR 探测星",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      style: {
        borderRadius: '24px',
        padding: '16px',
        background: '#fff',
        border: '2px solid #f0f0f0'
      }
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[100] bg-background max-w-md mx-auto overflow-y-auto no-scrollbar overscroll-contain h-[100dvh]"
            >
              <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="font-display font-bold text-lg">个人中心</h2>
                <div className="w-10" />
              </div>

              <div className="p-8 pt-6 pb-20">
                <div className="flex items-center gap-5 mb-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 p-1.5">
                      <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                        <User className="w-10 h-10" />
                      </div>
                    </div>
                    {user?.isVip && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full border-4 border-background flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-display font-bold text-foreground`}>
                      {user ? user.nickname : "探测星访客"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                        user?.isVip ? 'bg-yellow-100 text-yellow-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {user?.isVip ? 'PRO Member' : 'Standard'}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">ID: {user ? user.id : '40921-M'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-10">
                  <StatCard label="已测项目" value={completedCount} />
                  <StatCard label="加入天数" value={user?.joinDays || "1"} />
                  <StatCard label="灵魂厚度" value={user?.stats.soulThickness || "42"} />
                </div>

                {!user?.isVip && (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsVipOpen(true)}
                    className="gradient-primary rounded-3xl p-6 mb-10 text-white relative overflow-hidden btn-press shadow-lg shadow-primary/20"
                  >
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 blur-2xl rounded-full" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-5 h-5 text-yellow-300" />
                        <span className="text-sm font-bold uppercase tracking-widest leading-none">Activate Pro Plan</span>
                      </div>
                      <h4 className="text-lg font-display font-black mb-1 text-white italic whitespace-nowrap">输入激活码开启深读</h4>
                      <p className="text-xs opacity-80 leading-relaxed font-medium">获取全部高维度画像、稀缺度等级及深度建议</p>
                    </div>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-60" />
                  </motion.div>
                )}

                <div className="space-y-8">
                  <div>
                    <SectionTitle label="核心账户" />
                    <div className="space-y-1">
                      <MenuItem 
                        icon={FileText} 
                        label="我的探测报告" 
                        sub="存储你的所有探测历史数据" 
                        onClick={() => { onClose(); navigate('/history'); }}
                      />
                      <MenuItem 
                        icon={Gift} 
                        label="福利优惠中心" 
                        sub="我有 1 张待领优惠券" 
                        badge="New" 
                        onClick={() => { onClose(); navigate('/coupons'); }}
                      />
                    </div>
                  </div>

                  <div>
                    <SectionTitle label="系统与偏助" />
                    <div className="space-y-1">
                      <MenuItem icon={Eye} label="隐私查看限制" sub="量子加密策略" onClick={() => { onClose(); navigate('/privacy'); }} />
                      <MenuItem 
                        icon={HelpCircle} 
                        label="帮助与支持" 
                        sub="联系 TESTSAR 探测星客服" 
                        onClick={showHelpSupport}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/10">
                  {user ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-muted text-muted-foreground font-bold text-sm btn-press rounded-2xl"
                    >
                      <LogOut className="w-5 h-5" />
                      退出登录
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-primary text-white font-bold text-sm btn-press rounded-2xl shadow-xl shadow-primary/20 active:shadow-none transition-all"
                    >
                      <LogIn className="w-5 h-5" />
                      登录 / 注册新账号
                    </button>
                  )}
                </div>
                
                <p className="text-center text-[10px] text-muted-foreground mt-10 opacity-40 font-medium">
                  TESTSAR ENGINE v1.2.9 PRO <br />
                  POWERED BY QUANTUM PERSPECTIVE
                </p>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <VipPricingModal isOpen={isVipOpen} onClose={() => setIsVipOpen(false)} />
    </>
  );
};

const SectionTitle = ({ label }: { label: string }) => (
  <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-3">{label}</h4>
);

const StatCard = ({ label, value }: any) => (
  <div className="bg-muted/30 rounded-2xl p-4 text-center border border-border/50">
    <p className={`text-xl font-display font-black text-foreground`}>{value}</p>
    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-70">{label}</p>
  </div>
);

const MenuItem = ({ icon: Icon, label, sub, badge, onClick }: any) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-muted/40 transition-colors btn-press active:bg-muted"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-muted/50 text-foreground/70`}>
        <Icon className={`w-5 h-5`} />
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold text-foreground`}>{label}</p>
        {sub && <p className={`text-[10px] mt-0.5 leading-none text-muted-foreground`}>{sub}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="text-[8px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">{badge}</span>}
      <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
    </div>
  </motion.button>
);

export default UserDrawer;
