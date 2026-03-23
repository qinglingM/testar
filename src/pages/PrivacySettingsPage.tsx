import { motion } from "framer-motion";
import { ChevronLeft, Shield, Eye, Bell, Moon, User, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // I'll check if it exists or use checkbox

const PrivacySettingsPage = () => {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    reportPublic: false,
    syncCloud: true,
    anonymousMode: false
  });

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <MobileLayout className="bg-muted/30">
      <Header 
        title="隐私查看限制" 
        onBack={() => navigate(-1)} 
      />

      <div className="p-8 pb-32">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-16 h-16 rounded-3xl bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] shadow-inner">
             <Shield className="w-8 h-8" strokeWidth={2.5} />
           </div>
           <div>
             <h2 className="text-xl font-display font-black text-foreground">探测隐私策略</h2>
             <p className="text-xs text-muted-foreground mt-1 leading-none font-medium">Testar Quantum Encryption Level 4</p>
           </div>
        </div>

        <div className="space-y-10">
           <div>
             <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">基本可见性</h4>
             <div className="bg-background rounded-[2.5rem] p-3 border border-border/40 shadow-sm space-y-2">
                <PrivacyItem 
                  icon={Eye} 
                  label="探测个人主页公开" 
                  sub="允许他人在推荐中看到你的探测动态" 
                  isOn={privacySettings.profileVisible} 
                  toggle={() => toggleSetting('profileVisible')} 
                />
                <PrivacyItem 
                  icon={User} 
                  label="探测报告公开" 
                  sub="任何人都可以通过链接查看你的深度报告" 
                  isOn={privacySettings.reportPublic} 
                  toggle={() => toggleSetting('reportPublic')} 
                />
             </div>
           </div>

           <div>
             <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">数据与同步</h4>
             <div className="bg-background rounded-[2.5rem] p-3 border border-border/40 shadow-sm space-y-2">
                <PrivacyItem 
                  icon={Shield} 
                  label="量子云备份" 
                  sub="在多台设备间同步你的探测轨迹" 
                  isOn={privacySettings.syncCloud} 
                  toggle={() => toggleSetting('syncCloud')} 
                />
                <PrivacyItem 
                  icon={Shield} 
                  label="完全匿名模式" 
                  sub="探测报告不关联任何个人身份识别信息" 
                  isOn={privacySettings.anonymousMode} 
                  toggle={() => toggleSetting('anonymousMode')} 
                />
             </div>
           </div>
        </div>

        <div className="mt-16 p-8 bg-[#0EA5E9]/5 rounded-[2.5rem] border border-[#0EA5E9]/10 text-center">
            <p className="text-xs text-[#0EA5E9] font-black uppercase tracking-[0.2em] mb-3">TESTAR Privacy Promise</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
               您的数据采用端到端量子级加密存储。我们承诺永不将您的测试结果泄露给第三方。探寻真实的自己，应当在安全且私密的环境中进行。
            </p>
        </div>
      </div>
    </MobileLayout>
  );
};

const PrivacyItem = ({ icon: Icon, label, sub, isOn, toggle }: any) => (
  <div 
    onClick={toggle}
    className="flex items-center justify-between p-5 rounded-[2rem] hover:bg-muted/30 transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOn ? 'bg-primary/10 text-primary' : 'bg-muted/40 text-muted-foreground'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`text-sm font-black transition-colors ${isOn ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner ${isOn ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`}>
       <motion.div 
         animate={{ x: isOn ? 26 : 4 }}
         className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
       />
    </div>
  </div>
);

export default PrivacySettingsPage;
