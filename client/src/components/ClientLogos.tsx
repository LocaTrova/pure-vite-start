import netflixLogo from "@assets/Netflix-Logo-2006-500x333-1_1759442083338.png";
import mediasetLogo from "@assets/Mediaset_Logo_1759442083337.png";
import pinellaLogo from "@assets/Pinella_RGB_Wordmark_ColourWhite_M_1759442083338.webp";
import gaumontLogo from "@assets/Gaumont_logo.svg_1759442090117.png";

export default function ClientLogos() {
  const logos = [
    { name: "Netflix", src: netflixLogo },
    { name: "Mediaset", src: mediasetLogo },
    { name: "Pinella", src: pinellaLogo },
    { name: "Gaumont", src: gaumontLogo },
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
              <img 
                src={logo.src} 
                alt={logo.name}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
