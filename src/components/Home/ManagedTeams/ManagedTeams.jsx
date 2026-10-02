import { COLORS } from "@/constant/styles";
import { DISCOVERY_CALL_URL } from "@/constant/links";

const HELP = [
  {
    title: "Customer Support",
    text: "Help customers with enquiries, follow-ups, and issue resolution across your agreed support channels.",
  },
  {
    title: "Back-Office Support",
    text: "Keep routine administrative work, records, and operational follow-ups organised so your local team can focus on its priorities.",
  },
  {
    title: "Logistics Customer Support",
    text: "Support shipment enquiries, delivery follow-ups, and exception handling using your systems and agreed escalation rules.",
  },
];

const MANAGED = [
  "Agents trained on your processes and systems",
  "Team leadership for daily coordination and coaching",
  "Quality assurance to review work and identify improvements",
  "Operations management for performance reviews and issue escalation",
  "Reporting against agreed measures and service expectations",
];

const START = [
  { title: "Understand Your Needs", text: "We discuss your workload, current challenges, systems, service hours, and priorities." },
  { title: "Define the Support Model", text: "We agree on scope, team structure, responsibilities, performance measures, and pricing." },
  { title: "Prepare for Delivery", text: "We align training, system access, escalation rules, and readiness before launch." },
  { title: "Review and Improve", text: "We review performance together and address gaps through coaching and process improvements." },
];

const heading = { fontFamily: "var(--font-poppins), sans-serif", fontWeight: 900, color: COLORS.dark };

const ManagedTeams = () => (
  <>
    {/* What we help with */}
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl text-center mb-12 leading-tight" style={heading}>
          Keep Customers Supported. Keep Work Moving.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {HELP.map((h) => (
            <div key={h.title} className="p-8 rounded-xl border-t-4 shadow-md bg-white" style={{ borderColor: COLORS.primary }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.dark }}>{h.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-600">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How the team is managed */}
    <section className="py-16 md:py-24 px-4" style={{ backgroundColor: COLORS.primaryLight }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl mb-8 leading-tight" style={heading}>
          A Team with Day-to-Day Management
        </h2>
        <p className="font-semibold mb-4" style={{ color: COLORS.dark }}>Your support model can include:</p>
        <ul className="space-y-3 mb-8">
          {MANAGED.map((m) => (
            <li key={m} className="flex gap-3 text-neutral-700 leading-relaxed">
              <span aria-hidden className="mt-2 w-2 h-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              {m}
            </li>
          ))}
        </ul>
        <p className="text-neutral-700 leading-relaxed">
          We agree on responsibilities, staffing, coverage, and reporting before delivery begins. Your team retains the decisions and approvals that need to stay within your business.
        </p>
      </div>
    </section>

    {/* How we start */}
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl text-center mb-12 leading-tight" style={heading}>
          Built Around Your Operations
        </h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {START.map((s, i) => (
            <li key={s.title} className="p-6 rounded-xl bg-neutral-50">
              <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-full text-white font-bold" style={{ backgroundColor: COLORS.primary }}>
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.dark }}>{s.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-600">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="text-center">
          <a
            href={DISCOVERY_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ backgroundColor: COLORS.primary }}
          >
            Discuss Your Support Needs
          </a>
        </div>
      </div>
    </section>
  </>
);

export default ManagedTeams;
