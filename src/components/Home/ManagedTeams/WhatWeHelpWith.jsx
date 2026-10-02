import { COLORS } from "@/constant/styles";

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

const WhatWeHelpWith = () => (
  <section className="py-16 md:py-24 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2
        className="text-3xl md:text-5xl text-center mb-12 leading-tight"
        style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 900, color: COLORS.dark }}
      >
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
);

export default WhatWeHelpWith;
