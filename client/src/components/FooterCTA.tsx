import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SiLinkedin, SiInstagram } from "react-icons/si";

interface FooterCTAProps {
  onCTAClick?: () => void;
}

export default function FooterCTA({ onCTAClick }: FooterCTAProps) {
  const benefits = [
    "Registra il tuo spazio gratuitamente",
    "Decidi tu per ogni richiesta",
    "Copertura assicurativa per ogni location",
    "Team di supporto sempre disponibile",
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-foreground/95 to-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Il tuo spazio potrebbe già guadagnare
          </h2>
          <p className="text-lg text-background/80 mb-8">
            Centinaia di proprietari hanno già trasformato i loro spazi in location. Iscriversi è gratis e richiede 10 minuti.
          </p>
          
          <Button
            size="lg"
            variant="secondary"
            onClick={onCTAClick}
            className="text-lg px-8 py-6 mb-10"
            data-testid="button-cta-footer"
          >
            Inizia ora - È gratuito
          </Button>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-background/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
              <a href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Termini e Condizioni
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Contatti
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-background/60">
            © 2025 Locatrova. Tutti i diritti riservati.
          </div>
        </div>
      </div>
    </footer>
  );
}
