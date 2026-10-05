
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { CalendarDays, MapPin, Check } from "lucide-react";
import { FONT_CLASSES, COLORS } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

/* About Us section, content taken from the company presentation slide. */
const SERVICES = [
  "Customer support (voice, email, and chat)",
  "Virtual assistance",
  "Back-office operations",
  "Sales and lead generation",
  "Administrative support",
  "Outsourcing and offshoring solutions"
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay }
});

const CompanyDetails = () => {
  const router = useRouter();
  const AboutUsButton = ({ isLargeScreen = false }) => <div
    className={`flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${isLargeScreen ? "justify-end" : "justify-center"}`}
    onClick={() => router.push("/about")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push("/about");
      }
    }}
  >
      <button
    onClick={(e) => {
      e.stopPropagation();
      router.push("/about");
    }}
    className={`flex items-center justify-center gap-2
          bg-[${COLORS.primary}] text-white ${isLargeScreen ? "w-14 h-14" : "w-11 h-11"} rounded-full
          hover:bg-[#800000] transition-all hover:scale-105 shadow-lg`}
    type="button"
  >
        <FaArrowRight
    className={`${isLargeScreen ? "w-5 h-5" : "w-4 h-4"} rotate-[-45deg]`}
  />
      </button>
      <p
    className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 select-none`}
  >
        {isLargeScreen ? "About Us" : "View About Us"}
      </p>
    </div>;
  return <div className="py-12">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {
    /* Large Screen Button */
  }
        <div className="flex justify-end mb-4">
          <div className="hidden lg:flex justify-end mb-4">
            <AboutUsButton isLargeScreen={true} />
          </div>
        </div>

        {
    /* --- MAIN CONTENT GRID --- */
  }
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-8 items-start">
          {
    /* Established card */
  }
          <motion.div
    {...rise()}
    className={`relative bg-white shadow-xl p-5 rounded-xl border-t-4 transition duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between lg:col-span-1
              border-t-[${COLORS.primary}] order-1`}
  >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fce5e5]" style={{ color: COLORS.primary }}>
                <CalendarDays className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className={`${FONT_CLASSES.openSansBold} text-xs uppercase tracking-[0.18em] text-gray-500`}>Established</span>
            </div>
            <p className={`text-3xl ${FONT_CLASSES.poppinsBlack} leading-tight`} style={{ color: COLORS.primary }}>
              April 8,<br />2021
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
              <span className={FONT_CLASSES.rubikRegular}>Cawayan Bugtong, Guimba, Nueva Ecija</span>
            </div>
            <div
    className={`absolute bottom-[-12px] right-[-12px] w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-[${COLORS.primary}]`}
  >
              <FaArrowRight className="text-white text-base rotate-[-45deg]" />
            </div>
          </motion.div>

          {
    /* Company description */
  }
          <motion.div {...rise(0.08)} className="space-y-4 lg:col-span-1 order-2">
            <div>
              <h3 className={`text-2xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-3`}>
                About Us
                <span className="mt-2 block h-1 w-10 rounded-full" style={{ background: COLORS.primary }} />
              </h3>
              <p className={`text-gray-600 leading-relaxed ${FONT_CLASSES.rubikRegular}`}>
                <strong className="font-semibold text-gray-900">TelexPH Business Support Services Inc.</strong> is a
                Philippine-based BPO company established on April 8, 2021, located in Cawayan Bugtong, Guimba, Nueva
                Ecija, providing customer support and outsourcing solutions worldwide.
              </p>
            </div>
          </motion.div>

          {
    /* Services list */
  }
          <motion.div {...rise(0.16)} className="space-y-4 lg:col-span-1 order-3">
            <h3 className={`text-base ${FONT_CLASSES.openSansBold} text-gray-900 leading-snug`}>
              <strong className="font-semibold text-gray-900">TelexPH</strong> delivers a wide range of business support services, including:
            </h3>
            <ul className={`space-y-2.5 text-gray-600 ${FONT_CLASSES.rubikRegular}`}>
              {SERVICES.map((item, i) => <motion.li
    key={item}
    initial={{ opacity: 0, x: -14 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
    className="group flex items-start gap-3 text-[15px] leading-snug"
  >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:scale-110" style={{ background: COLORS.primary }}>
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="transition-colors group-hover:text-gray-900">{item}</span>
                </motion.li>)}
            </ul>
          </motion.div>

          {
    /* Image Block */
  }
          <motion.div {...rise(0.1)} className="hidden lg:block relative min-h-[400px] mt-0 lg:col-span-2 order-4">
            <img
    src="images/post1.webp"
    alt="Telex Philippines team"
    className="absolute top-0 left-0 w-[90%] h-[300px] object-cover rounded-xl z-10 shadow-lg"
  />
            <img
    src="images/post5.webp"
    alt="Telex Philippines office"
    className="absolute bottom-0 right-0 w-[60%] h-[200px] object-cover rounded-xl z-20 shadow-xl"
  />
            <span aria-hidden className="absolute -left-3 top-8 z-0 h-[260px] w-1.5 rounded-full" style={{ background: COLORS.primary }} />
          </motion.div>

          {
    /* Mobile Button */
  }
          <div className="lg:hidden col-span-full flex justify-center order-5 p-4">
            <AboutUsButton isLargeScreen={false} />
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = CompanyDetails;
export {
  stdin_default as default
};
