import { LandingBackground } from "./landing-background";
import { LandingBenefits } from "./landing-benefits";
import { LandingCta } from "./landing-cta";
import { LandingFeatures } from "./landing-features";
import { LandingFooter } from "./landing-footer";
import { LandingHero } from "./landing-hero";
import { LandingMetrics } from "./landing-metrics";
import { LandingNav } from "./landing-nav";
import { LandingPhilosophy } from "./landing-philosophy";

export function LandingPage() {
  return (
    <div className="bg-background text-foreground relative min-h-svh">
      <LandingBackground />
      <div className="relative z-10">
        <LandingNav />
        <main>
          <LandingHero />
          <LandingPhilosophy />
          <LandingFeatures />
          <LandingMetrics />
          <LandingBenefits />
          <LandingCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
