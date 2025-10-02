import { SiNetflix } from "react-icons/si";

export default function ClientLogos() {
  const logos = [
    { name: "Netflix", icon: SiNetflix },
    { name: "Gaumont", icon: SiNetflix },
    { name: "Mediaset", icon: SiNetflix },
    { name: "Peppermint", icon: SiNetflix },
  ];

  return (
    <section className="w-full bg-muted/30 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-muted-foreground text-sm font-medium mb-8">
          Trusted by
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-12 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              data-testid={`logo-${logo.name.toLowerCase()}`}
            >
              <logo.icon className="w-20 h-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
