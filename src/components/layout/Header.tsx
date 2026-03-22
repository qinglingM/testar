import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  transparent?: boolean;
  onBack?: () => void;
}

const Header = ({ 
  title, 
  showBack = true, 
  rightElement, 
  transparent = false,
  onBack
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`px-4 pt-6 pb-2 flex items-center justify-between z-40 relative ${
      transparent ? 'bg-transparent' : 'bg-background'
    }`}>
      {showBack ? (
        <button onClick={handleBack} className="btn-press p-2 -ml-2 rounded-xl">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      ) : (
        <div className="w-9" />
      )}
      
      {title && (
        <h1 className="font-display font-bold text-lg text-center flex-1">
          {title}
        </h1>
      )}
      
      {rightElement ? (
        <div className="flex justify-end">{rightElement}</div>
      ) : (
        <div className="w-9" />
      )}
    </header>
  );
};

export default Header;
