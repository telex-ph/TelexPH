import SectionTitle from "../common/SectionTitle";
import { ArrowUpRight, Sparkles } from "lucide-react";

const INNOVATION_URL = "https://innovation.telexph.com";

// Abstract browser-window preview (no product claims, just a visual frame).
const BrowserPreview = () => <div className="relative">
    <div aria-hidden className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl" style={{ background: "linear-gradient(135deg, #a10000, #530607)" }} />
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(83,6,7,0.6)] ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1.5">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-gray-500 ring-1 ring-gray-200" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          innovation.telexph.com
        </span>
      </div>
      <div className="relative p-6 sm:p-8" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fbf3f3 100%)" }}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #a10000, #530607)" }}>
            <Sparkles className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="space-y-1.5">
            <div className="h-2.5 w-32 rounded-full bg-gray-800/80" />
            <div className="h-2 w-20 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-black/5">
              <div className="mb-3 h-8 w-8 rounded-lg" style={{ background: i === 0 ? "#a10000" : i === 1 ? "#530607" : "#e8c9c9" }} />
              <div className="mb-1.5 h-2 w-full rounded-full bg-gray-300" />
              <div className="h-2 w-2/3 rounded-full bg-gray-200" />
            </div>)}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200" />
          <div className="h-2 w-5/6 rounded-full bg-gray-200" />
          <div className="h-2 w-2/3 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  </div>;

const InnovationShowcase = () => {
  return <section id="innovation" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(161,0,0,0.07)" }} />
      <div aria-hidden className="pointer-events-none absolute right-6 top-8 h-44 w-64 opacity-50" style={{ backgroundImage: "radial-gradient(#a1000066 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionTitle
    eyebrow="Innovation"
    align="left"
    subtitle="Proof that we're AI-assisted, not a traditional BPO. See what our team has built."
  >
            Built with AI, Proven in Practice
          </SectionTitle>
          <a
    href={INNOVATION_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="group mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    style={{ background: "linear-gradient(135deg, #a10000, #530607)", fontFamily: "'Open Sans', sans-serif" }}
  >
            Visit innovation.telexph.com
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <a href={INNOVATION_URL} target="_blank" rel="noopener noreferrer" aria-label="Open innovation.telexph.com" className="group block">
          <BrowserPreview />
        </a>
      </div>
    </section>;
};
export default InnovationShowcase;
