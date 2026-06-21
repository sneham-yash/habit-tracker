import { LandingBackground } from "./landing-background";
import { LandingBenefits } from "./landing-benefits";
import { LandingCta } from "./landing-cta";
import { LandingFeatures } from "./landing-features";
import { LandingFooter } from "./landing-footer";
import { LandingHero } from "./landing-hero";
import { LandingMetrics } from "./landing-metrics";
import { LandingNav } from "./landing-nav";
import { LandingPhilosophy } from "./landing-philosophy";

type LandingPageProps = {
  isAuthenticated: boolean;
};

export function LandingPage({ isAuthenticated }: LandingPageProps) {
  return (
    <div className="bg-background text-foreground relative min-h-svh">
      <LandingBackground />
      <div className="relative z-10">
        <LandingNav isAuthenticated={isAuthenticated} />
        <main>
          <LandingHero isAuthenticated={isAuthenticated} />
          <LandingPhilosophy />
          <LandingFeatures />
          <LandingMetrics />
          <LandingBenefits />
          <LandingCta isAuthenticated={isAuthenticated} />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
