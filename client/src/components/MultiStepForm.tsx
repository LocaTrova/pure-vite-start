import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Home, Building2, Factory, Castle, Palette, Trees, Briefcase, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    spaceType: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    squareMeters: [100],
    availability: [] as string[],
    characteristics: "",
    notes: "",
    privacy: false,
    marketing: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const spaceTypes = [
    { icon: Home, label: "Casa/Appartamento", value: "house" },
    { icon: Building2, label: "Ufficio/Spazio commerciale", value: "office" },
    { icon: Factory, label: "Spazio industriale/Warehouse", value: "warehouse" },
    { icon: Castle, label: "Villa/Casale storico", value: "villa" },
    { icon: Palette, label: "Studio/Spazio creativo", value: "studio" },
    { icon: Trees, label: "Spazio esterno/Giardino", value: "outdoor" },
    { icon: Briefcase, label: "Sala eventi/Meeting room", value: "events" },
    { icon: Sparkles, label: "Location unica/Particolare", value: "unique" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      console.log(`Moving to step ${currentStep + 1}`, formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const toggleAvailability = (value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter(v => v !== value)
        : [...prev.availability, value]
    }));
  };

  return (
    <section id="form" className="w-full bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16 sm:py-24 scroll-mt-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Inizia in 60 secondi
          </h2>
          <p className="text-lg text-muted-foreground">
            Compila il form in 60 secondi. Ti richiameremo noi per fare due chiacchiere sul tuo spazio, senza impegno.
          </p>
        </div>

        <div className="mb-8">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Step {currentStep} di {totalSteps}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Che tipo di spazio hai?"}
              {currentStep === 2 && "Informazioni di contatto"}
              {currentStep === 3 && "Dettagli dello spazio"}
              {currentStep === 4 && "Conferma e invia"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Seleziona la categoria che meglio descrive il tuo spazio"}
              {currentStep === 2 && "Inserisci i tuoi dati per essere ricontattato"}
              {currentStep === 3 && "Raccontaci di più sul tuo spazio"}
              {currentStep === 4 && "Ultimo step prima di inviarci la tua richiesta"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {spaceTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, spaceType: type.value })}
                    className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                      formData.spaceType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`button-space-${type.value}`}
                  >
                    <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                      formData.spaceType === type.value ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <p className="text-xs text-center font-medium leading-tight">
                      {type.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome e Cognome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mario Rossi"
                    data-testid="input-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mario.rossi@email.com"
                    data-testid="input-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+39 333 123 4567"
                    data-testid="input-phone"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Città/Provincia *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Milano"
                    data-testid="input-city"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Metri quadrati: {formData.squareMeters[0]} mq</Label>
                  <Slider
                    value={formData.squareMeters}
                    onValueChange={(value) => setFormData({ ...formData, squareMeters: value })}
                    min={20}
                    max={1000}
                    step={10}
                    data-testid="slider-sqm"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Disponibilità</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Giorni feriali", "Weekend", "Sera/Notte", "Periodo esteso"].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          id={option}
                          checked={formData.availability.includes(option)}
                          onCheckedChange={() => toggleAvailability(option)}
                          data-testid={`checkbox-${option.toLowerCase().replace(/\s+/g, "-")}`}
                        />
                        <Label htmlFor={option} className="cursor-pointer font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="characteristics">Caratteristiche speciali</Label>
                  <Textarea
                    id="characteristics"
                    value={formData.characteristics}
                    onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                    placeholder="Descrivi brevemente le caratteristiche uniche del tuo spazio..."
                    rows={4}
                    data-testid="textarea-characteristics"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Note aggiuntive (opzionale)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="C'è qualcos'altro che vuoi farci sapere sul tuo spazio?"
                    rows={4}
                    maxLength={500}
                    data-testid="textarea-notes"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.notes.length}/500 caratteri
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.privacy}
                      onCheckedChange={(checked) => setFormData({ ...formData, privacy: checked as boolean })}
                      data-testid="checkbox-privacy"
                    />
                    <Label htmlFor="privacy" className="cursor-pointer font-normal text-sm leading-tight">
                      Ho letto e accetto i <a href="#" className="text-primary hover:underline">Termini e Condizioni</a> e l'<a href="#" className="text-primary hover:underline">Informativa Privacy</a> *
                    </Label>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketing}
                      onCheckedChange={(checked) => setFormData({ ...formData, marketing: checked as boolean })}
                      data-testid="checkbox-marketing"
                    />
                    <Label htmlFor="marketing" className="cursor-pointer font-normal text-sm leading-tight">
                      Accetto di ricevere comunicazioni promozionali da Locatrova su nuove opportunità, consigli per ottimizzare la mia location e aggiornamenti sulla piattaforma
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Indietro
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  data-testid="button-next"
                >
                  Avanti
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!formData.privacy}
                  data-testid="button-submit"
                >
                  Invia il form
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
