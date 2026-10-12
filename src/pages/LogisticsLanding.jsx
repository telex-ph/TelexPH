import { useEffect } from "react";
import LogisticsNav from "@/components/Logistics/LogisticsNav";
import LogisticsLandingHero from "@/components/Logistics/LogisticsLandingHero";
import LogisticsScope from "@/components/Logistics/LogisticsScope";
import LogisticsManagement from "@/components/Logistics/LogisticsManagement";
import LogisticsTestimonials from "@/components/Logistics/LogisticsTestimonialVariants";
import LogisticsFaqs from "@/components/Logistics/LogisticsFaqs";
import LogisticsCta from "@/components/Logistics/LogisticsCta";
import LogisticsFooter from "@/components/Logistics/LogisticsFooter";
import { hideBugReportWidget } from "@/shared/BugReportWidget";

/* Logistics landing page (ad destination). Built section by section: banner first. */
function LogisticsLandingPage() {
  useEffect(() => hideBugReportWidget(), []);

  return (
    <div className="min-h-screen bg-white">
      <LogisticsNav />
      <main className="bg-white">
        <LogisticsLandingHero />
        <LogisticsScope />
        <LogisticsManagement />
        <LogisticsTestimonials />
        <LogisticsFaqs />
        <LogisticsCta />
      </main>
      <LogisticsFooter />
    </div>
  );
}

export { LogisticsLandingPage as default };
