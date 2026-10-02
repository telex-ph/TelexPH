import { useEffect } from "react";
import LogisticsNav from "@/components/Logistics/LogisticsNav";
import LogisticsHero from "@/components/Logistics/LogisticsHero";
import LogisticsHelp from "@/components/Logistics/LogisticsHelp";
import LogisticsManaged from "@/components/Logistics/LogisticsManaged";
import LogisticsProcess from "@/components/Logistics/LogisticsProcess";
import LogisticsFooter from "@/components/Logistics/LogisticsFooter";
import { hideBugReportWidget } from "@/shared/BugReportWidget";

/* Logistics landing page. Built section by section: banner first.
   The earlier full draft is saved locally in .backup-local/Logistics.full.jsx. */
function LogisticsPage() {
  useEffect(() => hideBugReportWidget(), []);

  return (
    <div className="min-h-screen bg-white">
      <LogisticsNav />
      <main className="bg-white">
        <LogisticsHero />
        <LogisticsHelp />
        <LogisticsManaged />
        <LogisticsProcess />
      </main>
      <LogisticsFooter />
    </div>
  );
}

export { LogisticsPage as default };
