import { Card, CardContent } from "@/components/ui/card";
import { Home, Building2, Factory, Castle, Palette, Users, Warehouse, Sparkles, Briefcase } from "lucide-react";

export default function SpaceTypes() {
  const categories = [
    { icon: Home, title: "Case Private", description: "Abitazioni e residenze" },
    { icon: Castle, title: "Casali & Ville", description: "Proprietà rurali e di prestigio" },
    { icon: Building2, title: "Uffici", description: "Spazi corporate e professionali" },
    { icon: Briefcase, title: "Sale Eventi", description: "Location per eventi e celebrazioni" },
    { icon: Palette, title: "Spazi Creativi", description: "Studi artistici e laboratori" },
    { icon: Users, title: "Co-working", description: "Spazi di lavoro condiviso" },
    { icon: Factory, title: "Spazi Industriali", description: "Capannoni e strutture industriali" },
    { icon: Warehouse, title: "Location Uniche", description: "Spazi particolari e caratteristici" },
    { icon: Sparkles, title: "Spazi Esterni", description: "Giardini e location all'aperto" },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Accettiamo ogni tipo di spazio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Location residenziali, commerciali o spazi unici. Se hai uno spazio può diventare una location*
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="hover-elevate transition-all duration-300 cursor-pointer"
              data-testid={`card-space-${index + 1}`}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-8 max-w-3xl mx-auto">
          *Per eventi pubblici verranno selezionate solo location con le autorizzazioni necessarie
        </p>
      </div>
    </section>
  );
}
