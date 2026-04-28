import Hero from "@/components/landing/Hero";
import PersonaCards from "@/components/landing/PersonaCards";
import IeltsGuide from "@/components/landing/IeltsGuide";
import HowItWorks from "@/components/landing/HowItWorks";
import PersonalStory from "@/components/landing/PersonalStory";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import MissionStrip from "@/components/landing/MissionStrip";
import FinalCta from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <PersonaCards />
      <IeltsGuide />
      <HowItWorks />
      <PersonalStory />
      <ComparisonTable />
      <Pricing />
      <Faq />
      <MissionStrip />
      <FinalCta />
    </>
  );
}
