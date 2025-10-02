import { Card, CardContent } from "@/components/ui/card";
import { Upload, Eye, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Carica il tuo spazio",
      description: "Bastano 10 minuti. Aggiungi foto e descrizione della tua location. Il nostro team ti aiuta a valorizzarla al meglio.",
    },
    {
      icon: Eye,
      title: "Le produzioni guardano e selezionano",
      description: "Event manager e case di produzione cercano location sulla piattaforma. Quando il tuo spazio è perfetto per loro, ti preparano una proposta.",
    },
    {
      icon: CheckCircle,
      title: "Ricevi la richiesta e decidi",
      description: "Ti arriva la richiesta diretta con tutti i dettagli. Leggi, valuta e scegli se accettare. Nessun obbligo, massima libertà.",
    },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Semplice come affittare su Airbnb
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="hover-elevate transition-transform duration-300 hover:-translate-y-2"
              data-testid={`card-step-${index + 1}`}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
