import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Quanto posso guadagnare con il mio spazio?",
      answer: "Dipende dal tipo di location e dalla zona. In media: €300-800 per uno shooting di mezza giornata, €1.500-3.000 per produzioni di più giorni. Ti diamo una stima dopo aver visto il tuo spazio.",
    },
    {
      question: "Cosa succede se si rompono cose nello spazio?",
      answer: "Ogni produzione ha un'assicurazione obbligatoria. Più una polizza extra che copre eventuali danni. Prima e dopo facciamo foto della location per sicurezza.",
    },
    {
      question: "Devo modificare il mio spazio?",
      answer: "Dipende dal progetto. Spesso le produzioni cercano location 'vere' con gli arredi esistenti. Ti diciamo sempre in anticipo cosa serve preparare.",
    },
    {
      question: "Ci sono costi per registrare il mio spazio?",
      answer: "No, è gratis. Guadagniamo una commissione del 20% solo quando guadagni tu. Nessun abbonamento, nessun costo nascosto.",
    },
    {
      question: "Posso rifiutare una richiesta?",
      answer: "Sempre. Ogni richiesta è un'opportunità, non un obbligo. Hai 24 ore per decidere e puoi dire di no senza problemi.",
    },
    {
      question: "Come funziona la prima chiamata?",
      answer: "È una chiacchierata di 15 minuti con il nostro team. Guardiamo insieme la tua location, rispondiamo alle tue domande e ti diamo un'idea di cosa aspettarti. Tutto gratuito.",
    },
  ];

  return (
    <section className="w-full bg-muted/30 py-16 sm:py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Domande Frequenti
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-lg px-6 border-0 shadow-sm"
              data-testid={`accordion-item-${index + 1}`}
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
