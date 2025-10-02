import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/Elegant_villa_interior_hero_26f1e280.png";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative w-full h-screen md:h-[80vh] min-h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12 lg:py-20 gap-8">
          <div className="flex-1 max-w-2xl text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Trasforma il tuo spazio in una fonte di reddito
            </h1>
            
            <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
              Locatrova connette il tuo spazio con produzioni creative ed eventi. Come Airbnb, ma per shooting, film e produzione.
            </p>
            
            <div className="pt-4">
              <Button
                size="lg"
                onClick={onCTAClick}
                className="text-lg px-8 py-6 rounded-lg"
                data-testid="button-cta-hero"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Registra il tuo spazio
              </Button>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm sm:text-base opacity-90">
                Oltre 500 spazi attivi • Partner di Netflix e Mediaset
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
