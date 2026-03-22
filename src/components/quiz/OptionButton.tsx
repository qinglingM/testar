import { motion } from "framer-motion";

interface OptionButtonProps {
  label: string;
  charIndex: number;
  isSelected?: boolean;
  onClick: () => void;
}

const OptionButton = ({ label, charIndex, isSelected = false, onClick }: OptionButtonProps) => {
  const char = String.fromCharCode(65 + charIndex); // A, B, C, D...

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 btn-press flex items-center gap-4 ${
        isSelected
          ? "bg-primary/10 border-primary shadow-sm"
          : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
      }`}
      onClick={onClick}
    >
      <span
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 text-muted-foreground bg-background"
        }`}
      >
        {char}
      </span>
      <span className={`font-medium text-[1rem] leading-snug ${isSelected ? 'text-primary' : 'text-foreground/90'}`}>
        {label}
      </span>
    </motion.button>
  );
};

export default OptionButton;
