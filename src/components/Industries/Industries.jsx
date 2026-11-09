import SectionTitle from "../common/SectionTitle";
import { ShoppingCart, Truck, Landmark, ArrowUpRight } from "lucide-react";
import { localImage } from "@/shared/Image";

const RED = "#a10000";
const MAROON = "#530607";

// To add a new industry, append an entry here:
//   Icon, title, description, image (any file in /public/images),
//   imagePosition (optional CSS background-position, default "center").
// Rows and numbering adjust automatically.
export const INDUSTRIES = [
  {
    Icon: ShoppingCart,
    title: "E-commerce",
    description: "Returns, refunds and order issues across 115+ platforms and marketplaces.",
    image: "/images/office-production.jpg"
  },
  {
    Icon: Truck,
    title: "Logistics & delivery",
    description: "Calls, emails and proof-of-delivery support for delivery operations.",
    image: "/images/office-frontDesk.jpg"
  },
  {
    Icon: Landmark,
    title: "Government services",
    description: "Appointment and ticket support with ~98% SLA.",
    image: "/images/office-outside.jpg",
    imagePosition: "center 60%"
  }
];

const IndustryRow = ({ Icon, title, description, image, imagePosition = "center", index }) => {
  return <div
    className="group relative isolate overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgba(83,6,7,0.35)]"
    style={{ border: "1px solid #eee", boxShadow: "0 8px 24px -18px rgba(0,0,0,0.25)" }}
  >
      {/* Soft tint on hover */}
      <div
    className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    style={{ background: "linear-gradient(100deg, #fff4f4 0%, #ffffff 60%)" }}
  />
      {/* Accent bar on the left, grows on hover */}
      <span
    className="absolute left-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-r-full transition-all duration-500 group-hover:h-3/5"
    style={{ background: `linear-gradient(180deg, ${RED}, ${MAROON})` }}
  />
      {/* Photo revealed on hover, right side (faded into the row) */}
      <div
    className="absolute inset-y-0 right-0 -z-10 hidden w-[26%] bg-cover opacity-0 transition-all duration-700 group-hover:opacity-80 md:block"
    style={{
      backgroundImage: `url('${localImage(image, 1280)}')`,
      backgroundPosition: imagePosition,
      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 60%)",
      maskImage: "linear-gradient(90deg, transparent 0%, #000 60%)",
      transform: "scale(1.06)"
    }}
  />

      <div className="grid items-center gap-5 px-6 py-7 sm:px-8 md:grid-cols-[auto_minmax(0,1.25fr)_minmax(0,1.2fr)_5rem] md:gap-8 md:py-9">
        <span
    className="select-none leading-none text-[#ece7e7] transition-colors duration-500 group-hover:text-[#a1000033]"
    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "56px" }}
  >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-4">
          <span
    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
    style={{ background: `linear-gradient(135deg, ${RED}, ${MAROON})`, boxShadow: "0 12px 24px -10px rgba(161,0,0,0.6)" }}
  >
            <Icon size={26} strokeWidth={1.7} className="text-white" />
          </span>
          <h3
    className="text-gray-900"
    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "clamp(1.2rem, 2vw, 1.55rem)", lineHeight: 1.15 }}
  >
            {title}
          </h3>
        </div>

        <p
    className="text-gray-600 transition-colors duration-500 group-hover:text-gray-800 md:max-w-md"
    style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "15px", lineHeight: 1.7 }}
  >
          {description}
        </p>

        <span
    className="hidden h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#a10000] transition-all duration-500 group-hover:border-[#a10000] group-hover:bg-[#a10000] group-hover:text-white md:flex"
  >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>
    </div>;
};

const Industries = ({ items = INDUSTRIES }) => {
  return <section id="industries" className="relative overflow-hidden py-20 sm:py-24" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fbf5f5 50%, #ffffff 100%)" }}>
      {/* Faded office photo */}
      <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `url('${localImage("/images/office-production.jpg", 1280)}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.06,
      filter: "grayscale(0.5)",
      WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
      maskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)"
    }}
  />
      {/* Fine grid, fading out toward the edges */}
      <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: "linear-gradient(rgba(161,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(161,0,0,0.06) 1px, transparent 1px)",
      backgroundSize: "56px 56px",
      WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
      maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 75%)"
    }}
  />
      {/* Glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: "rgba(161,0,0,0.10)" }} />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: "rgba(83,6,7,0.10)" }} />
      {/* Rings */}
      <div className="pointer-events-none absolute -left-28 bottom-16 h-80 w-80 rounded-full" style={{ border: `1px solid ${RED}26` }} />
      <div className="pointer-events-none absolute -left-12 bottom-32 h-48 w-48 rounded-full" style={{ border: `1px solid ${RED}1a` }} />
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full" style={{ border: `1px solid ${RED}26` }} />
      <div className="pointer-events-none absolute -right-8 top-32 h-44 w-44 rounded-full" style={{ border: `1px solid ${RED}1a` }} />
      {/* Dot grids */}
      <div className="pointer-events-none absolute right-6 top-8 h-44 w-64 opacity-60" style={{ backgroundImage: `radial-gradient(${RED}66 1.5px, transparent 1.5px)`, backgroundSize: "18px 18px" }} />
      <div className="pointer-events-none absolute bottom-8 left-6 h-36 w-52 opacity-50" style={{ backgroundImage: `radial-gradient(${MAROON}66 1.5px, transparent 1.5px)`, backgroundSize: "18px 18px" }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Industries" align="left" subtitle="Where our teams already handle returns, deliveries and public-service requests." className="mb-12 md:mb-16">Industries We Support</SectionTitle>
        <div className="flex flex-col gap-5">
          {items.map((item, i) => <IndustryRow key={item.title} index={i} {...item} />)}
        </div>
      </div>
    </section>;
};
export default Industries;
