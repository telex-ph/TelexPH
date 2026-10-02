import Image from "next/image";
import { Headphones, ClipboardList, Truck } from "lucide-react";
import { Rubik } from "next/font/google";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"]
});
const Partners = ({
  imageSrc = "/images/partnership7.jpg",
  backgroundColor = "bg-white"
  // Set default to bg-white
}) => {
  const partnershipFeatures = [
    {
      icon: <Headphones className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Customer Support",
      description: "Help customers with enquiries, follow-ups, and issue resolution across your agreed support channels."
    },
    {
      icon: <ClipboardList className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Back-Office Support",
      description: "Keep routine administrative work, records, and operational follow-ups organised so your local team can focus on its priorities."
    },
    {
      icon: <Truck className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Logistics Customer Support",
      description: "Support shipment enquiries, delivery follow-ups, and exception handling using your systems and agreed escalation rules."
    }
  ];
  return (
    // 3. APPLIED backgroundColor to the outermost div
    <div className={`w-full pt-16 pb-12 ${backgroundColor}`}> 
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        <h2 className="font-poppins-black text-3xl md:text-5xl text-center text-[#1a1a2e] leading-tight mb-10 px-4">
          Keep Customers Supported. Keep Work Moving.
        </h2>
        <div className="relative w-full">
          <div className="w-full h-[400px] md:h-[650px] overflow-hidden shadow-2xl relative rounded-xl">
            <Image
      src={imageSrc}
      alt="Professional team collaboration"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 1200px"
      priority
    />
          </div>

          <div className="absolute -bottom-20 sm:-bottom-10 md:-bottom-20 left-0 right-0 px-4 sm:px-8 lg:px-8">
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#282828] rounded-2xl shadow-2xl" />
              <div className="relative z-10 p-3 md:p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  {partnershipFeatures.map((feature, index) => {
      const [firstWord, ...restWords] = feature.title.split(" ");
      const secondPart = restWords.join(" ");
      return <div
        key={index}
        className="bg-white rounded-lg md:rounded-xl shadow-xl p-3 md:p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
      >
                        <div className="absolute bottom-0 right-0 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-[#a10000] rounded-tl-full" />

                        <div className="mb-2 md:mb-3 relative z-10">
                          {feature.icon}
                        </div>

                        <p className="font-poppins font-bold text-sm md:text-xl lg:text-2xl text-[#a10000] leading-tight relative z-10">
                          {firstWord}
                        </p>
                        {secondPart && <p className="font-poppins font-bold text-sm md:text-xl lg:text-2xl text-[#a10000] mb-1 md:mb-2 relative z-10">
                            {secondPart}
                          </p>}

                        <p className={`${rubik.className} text-gray-600 text-[10px] md:text-sm lg:text-base leading-snug md:leading-relaxed relative z-10`}>
                          {feature.description}
                        </p>
                      </div>;
    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-20 md:h-20 lg:h-24" />
      </div>
    </div>
  );
};
var stdin_default = Partners;
export {
  stdin_default as default
};
