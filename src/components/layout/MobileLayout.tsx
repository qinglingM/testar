import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className="flex justify-center min-h-screen bg-muted/20">
      <div className={`w-full max-w-md bg-background relative shadow-sm min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
