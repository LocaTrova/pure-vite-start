import { useRef } from "react";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import HowItWorks from "@/components/HowItWorks";
import CaseStudy from "@/components/CaseStudy";
import SpaceTypes from "@/components/SpaceTypes";
import MultiStepForm from "@/components/MultiStepForm";
import FAQ from "@/components/FAQ";
import FooterCTA from "@/components/FooterCTA";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onCTAClick={scrollToForm} />
      <ClientLogos />
      <HowItWorks />
      <CaseStudy />
      <SpaceTypes />
      <div ref={formRef}>
        <MultiStepForm />
      </div>
      <FAQ />
      <FooterCTA onCTAClick={scrollToForm} />
    </div>
  );
}
