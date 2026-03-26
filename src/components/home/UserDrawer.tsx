import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Crown, Shield, Settings, LogIn, ChevronRight, ChevronLeft, Gift, 
  FileText, Bell, HelpCircle, Eye, User, Star, LogOut, Key, Zap
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
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 p-1.5 shadow-inner">
                      <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                        <User className="w-10 h-10" />
                      </div>
                    </div>
                    {user?.isVip && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-display font-bold text-foreground`}>
                      {user ? user.nickname : "探测星访客"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border ${
                        user?.isVip ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200' : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {user?.isVip ? 'MAX Member' : 'Standard'}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-30"># {user ? user.id.slice(0, 8) : 'ST-409'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-10">
                  <StatCard label="已测项目" value={completedCount} />
                  <StatCard label="加入天数" value={user?.joinDays || "1"} />
                  <StatCard label="灵魂厚度" value={user?.stats?.soulThickness || "42"} />
                </div>

                {!user?.isVip && (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsVipOpen(true)}
                    className="rounded-3xl p-6 mb-10 text-white relative overflow-hidden btn-press shadow-2xl cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 20%, #7C3AED 60%, #6366F1 100%)', backgroundSize: '200% auto', animation: 'gradient-x 4s ease infinite' }}
                  >
                    <div className="absolute top-[-30%] right-[-15%] w-40 h-40 bg-white/15 blur-3xl rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-yellow-200/20 blur-2xl rounded-full" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-yellow-200" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] leading-none text-yellow-100">TMAX · 年费大会员</span>
                      </div>
                      <h4 className="text-xl font-display font-black mb-2 text-white">全场测试免激活码</h4>
                      <p className="text-[11px] opacity-90 leading-relaxed font-bold text-white/80">每日 10 次深度探测 · 3000 字报告 · 稀缺画像 · 未来建议</p>
                      <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">立即开通 →</span>
                      </div>
                    </div>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40" />
                  </motion.div>
                )}

                <div className="space-y-8">
                  <div>
                    <SectionTitle label="核心账户" />
                    <div className="space-y-2">
                      <MenuItem 
                        icon={FileText} 
                        label="我的探测报告" 
                        sub="存储你的所有探测历史数据" 
                        onClick={() => { onClose(); navigate('/history'); }}
                      />
                      <MenuItem 
                        icon={Gift} 
                        label="福利优惠中心" 
                        sub="暂无可用福利补给" 
                        onClick={() => { onClose(); navigate('/coupons'); }}
                      />
                    </div>
                  </div>

                  <div>
                    <SectionTitle label="系统与偏助" />
                    <div className="space-y-2">
                      <MenuItem icon={Eye} label="隐私查看限制" sub="探测数据已锁定量子加密" onClick={() => { onClose(); navigate('/privacy'); }} />
                      <MenuItem 
                        icon={HelpCircle} 
                        label="帮助与支持" 
                        sub="微信公众号：TESTSAR 探测星" 
                        onClick={showHelpSupport}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/10">
                  {user ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-5 bg-muted/60 text-muted-foreground font-black uppercase tracking-widest text-[10px] btn-press rounded-[1.5rem]"
                    >
                      <LogOut className="w-4 h-4" />
                      退出当前探测链路
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full h-16 bg-primary text-white font-display font-black text-sm uppercase tracking-[0.2em] btn-press rounded-3xl shadow-xl shadow-primary/20 active:shadow-none transition-all flex items-center justify-center gap-3"
                    >
                      <LogIn className="w-5 h-5" />
                      立即登录探测星
                    </button>
                  )}
                </div>
                
                <p className="text-center text-[9px] text-muted-foreground mt-12 opacity-30 font-black uppercase tracking-[0.3em]">
                  TESTSAR ENGINE v1.2.9 MAX <br />
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
  <h4 className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-3">{label}</h4>
);

const StatCard = ({ label, value }: any) => (
  <div className="bg-muted/10 rounded-2xl p-4 text-center border border-border/10 backdrop-blur-sm">
    <p className={`text-xl font-display font-black text-foreground`}>{value}</p>
    <p className="text-[9px] text-muted-foreground font-black mt-1 uppercase tracking-widest opacity-60">{label}</p>
  </div>
);

const MenuItem = ({ icon: Icon, label, sub, badge, onClick }: any) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-muted/30 transition-all btn-press active:bg-muted/50 border border-transparent hover:border-border/20 shadow-sm hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-muted/30 text-foreground/50 border border-border/10`}>
        <Icon className={`w-5 h-5`} />
      </div>
      <div className="text-left">
        <p className={`text-sm font-black text-foreground/90 uppercase tracking-tight`}>{label}</p>
        {sub && <p className={`text-[10px] mt-0.5 leading-none text-muted-foreground font-bold italic`}>{sub}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="text-[8px] font-black uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">{badge}</span>}
      <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
    </div>
  </motion.button>
);

export default UserDrawer;
