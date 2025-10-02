import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import caseStudyImage from "@assets/generated_images/Case_study_testimonial_photo_f39ea69d.png";

export default function CaseStudy() {
  return (
    <section className="w-full bg-gradient-to-b from-muted/20 to-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            I proprietari che hanno provato Locatrova
          </h2>
          <p className="text-lg text-muted-foreground">
            Storie vere di chi ha trasformato il proprio spazio
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 relative h-64 md:h-auto">
              <img
                src={caseStudyImage}
                alt="Marco - Proprietario spazio Milano"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:col-span-3">
              <CardHeader className="space-y-3">
                <Badge className="w-fit" variant="secondary">
                  Case Study
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                  Marco ha guadagnato €5.000 in 3 mesi con il suo spazio
                </h3>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Marco aveva uno spazio a Milano che usava poco. L'ha registrato su Locatrova e in 3 mesi ha ospitato 3 shooting fotografici e 1 video musicale. Ha guadagnato €5.000 extra senza cambiare nulla nella sua routine.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <MapPin className="w-4 h-4" />
                  <span>Spazio di Marco - Milano, Italia</span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
