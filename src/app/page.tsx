import { PricingSection } from "@/components/pricing/PricingSection";
import { CallToAction } from "@/components/site/CallToAction";
import { FeaturesBento } from "@/components/site/FeaturesBento";
import { Hero } from "@/components/site/Hero";
import { SiteCommandBar } from "@/components/site/SiteCommandBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturesBento />
        <PricingSection />
        <CallToAction />
      </main>
      <SiteFooter />
      <SiteCommandBar />
    </>
  );
}
