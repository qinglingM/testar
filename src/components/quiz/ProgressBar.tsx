import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-muted">
      <motion.div
        className="h-full gradient-primary rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ProgressBar;
