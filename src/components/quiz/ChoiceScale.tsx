import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChoiceScaleProps {
  onSelect: (index: number) => void;
  selectedIndex?: number;
}

const scaleItems = [
  { label: "强烈反对", size: "w-12 h-12", color: "bg-muted-foreground/40", activeColor: "bg-red-400" },
  { label: "反对", size: "w-9 h-9", color: "bg-muted-foreground/30", activeColor: "bg-red-300" },
  { label: "中立", size: "w-7 h-7", color: "bg-muted-foreground/20", activeColor: "bg-gray-400" },
  { label: "同意", size: "w-9 h-9", color: "bg-muted-foreground/30", activeColor: "bg-purple-300" },
  { label: "强烈同意", size: "w-12 h-12", color: "bg-muted-foreground/40", activeColor: "bg-purple-500" },
];

const ChoiceScale = ({ onSelect, selectedIndex }: ChoiceScaleProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-2 mb-10 relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2 -z-10 mx-8" />
        
        {scaleItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelect(index)}
                className={cn(
                  "rounded-full transition-all duration-300 border-4 border-background shadow-sm",
                  item.size,
                  isSelected ? item.activeColor : item.color,
                  isSelected && "ring-4 ring-primary/20 scale-110"
                )}
              />
            </div>
          );
        })}
      </div>
      
      <div className="w-full flex justify-between px-1">
        <span className="text-xs font-bold text-red-500/70 tracking-tighter">强烈反对</span>
        <span className="text-xs font-bold text-purple-600/70 tracking-tighter">强烈同意</span>
      </div>
    </div>
  );
};

export default ChoiceScale;
