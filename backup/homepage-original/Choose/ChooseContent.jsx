
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import FeaturesSection from "./FeaturesSection";
import CenterGrid from "./CenterGrid";
import { FONT_CLASSES, COLORS } from "@/constant/styles";
const LEFT_FEATURES = [
  {
    id: 1,
    title: "Process Optimization",
    description: "We streamline workflows to save time and reduce costs.",
    icon: "layers"
  },
  {
    id: 2,
    title: "Data Security",
    description: "Your sensitive information is protected with enterprise-grade security.",
    icon: "building"
  },
  {
    id: 3,
    title: "Global Scalability",
    description: "Expand operations seamlessly with flexible outsourcing models.",
    icon: "wrench"
  }
];
const RIGHT_FEATURES = [
  {
    id: 4,
    title: "24/7 Support",
    description: "Round-the-clock service that ensures no downtime for your business.",
    icon: "shield"
  },
  {
    id: 5,
    title: "Cost Efficiency",
    description: "Affordable solutions without compromising on quality.",
    icon: "network"
  },
  {
    id: 6,
    title: "Smart Workforce",
    description: "Trained professionals with the expertise your business deserves.",
    icon: "leaf"
  }
];
const ContactUsButtonMobile = () => {
  const router = useRouter();
  return <div className="lg:hidden mt-6 mb-2 flex justify-center">
      <div
    className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity"
    onClick={() => router.push("/contact")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push("/contact");
      }
    }}
  >
        <button
    onClick={(e) => {
      e.stopPropagation();
      router.push("/contact");
    }}
    className={`flex items-center justify-center w-11 h-11 rounded-full text-white transition-all hover:scale-105 shadow-lg 
            bg-[${COLORS.primary}] hover:bg-[${COLORS.dark}]`}
    type="button"
  >
          <ArrowUpRight className="w-5 h-5 rotate-[15deg]" />
        </button>
        <p
    className={`${FONT_CLASSES.openSansBold} text-base transition-colors select-none`}
    style={{ color: COLORS.dark }}
  >
          Choose Us
        </p>
      </div>
    </div>;
};
const ChooseHeader = () => {
  const router = useRouter();
  return <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-16 gap-2 lg:gap-8">
      <div>
        <p
    className={`text-[${COLORS.primary}] text-sm ${FONT_CLASSES.openSansBold} mb-2 uppercase tracking-wide flex items-center gap-2`}
  >
          <span className={`w-8 h-[2px] bg-[${COLORS.primary}]`} />
          WHY CHOOSE US
        </p>
        <h2
    className={`text-[1.75rem] md:text-[2.5rem] lg:text-[3rem] ${FONT_CLASSES.poppinsBold} leading-tight`}
    style={{ color: COLORS.dark }}
  >
          We Use Proven Smart Technologies
          <br />
          for Faster & More Efficient Work
        </h2>
      </div>

      <div
    className="hidden lg:flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
    onClick={() => router.push("/contact")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push("/contact");
      }
    }}
  >
        <button
    onClick={(e) => {
      e.stopPropagation();
      router.push("/contact");
    }}
    className={`flex items-center justify-center gap-2 w-14 h-14 rounded-full text-white transition-all hover:scale-105 shadow-lg 
            bg-[${COLORS.primary}] hover:bg-[${COLORS.dark}]`}
    type="button"
  >
          <ArrowUpRight className="w-6 h-6" />
        </button>
        <p
    className={`${FONT_CLASSES.openSansBold} text-lg select-none`}
    style={{ color: COLORS.dark }}
  >
          Contact Us
        </p>
      </div>
    </div>;
};
const ChooseGrid = () => {
  return <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6">
      <FeaturesSection features={LEFT_FEATURES} />
      <CenterGrid />
      <FeaturesSection features={RIGHT_FEATURES} />
    </div>;
};
const ChooseContent = () => {
  return <>
      <ChooseHeader />
      <ChooseGrid />
      <ContactUsButtonMobile />
    </>;
};
var stdin_default = ChooseContent;
export {
  stdin_default as default
};
