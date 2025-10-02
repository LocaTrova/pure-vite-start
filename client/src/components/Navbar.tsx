import { Button } from "@/components/ui/button";
import logoImage from "@assets/Locatrova.ai_1759437708812.png";

interface NavbarProps {
  onCTAClick?: () => void;
}

export default function Navbar({ onCTAClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Locatrova" 
              className="h-8 sm:h-10 w-auto"
              data-testid="logo-navbar"
            />
            <span className="text-xl sm:text-2xl font-bold">Locatrova</span>
          </div>
          
          <Button
            onClick={onCTAClick}
            data-testid="button-cta-navbar"
          >
            Registra il tuo spazio
          </Button>
        </div>
      </div>
    </nav>
  );
}
