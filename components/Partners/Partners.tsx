import React from "react";
import Image from "next/image";
import { Settings, Users, Wrench, Award } from "lucide-react";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

interface PartnersProps {
  imageSrc?: string; // optional prop for custom image
}

const Partners: React.FC<PartnersProps> = ({ imageSrc = "/images/partnership.jpg" }) => {
  const partnershipFeatures = [
    {
      icon: <Settings className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Trusted Partnership",
      description: "Building long-term client relationships worldwide.",
    },
    {
      icon: <Users className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Proven Track Record",
      description: "Delivering results across industries.",
    },
    {
      icon: <Wrench className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Smart solutions",
      description: "Tailored outsourcing that scales with you.",
    },
    {
      icon: <Award className="w-12 md:w-16 h-12 md:h-16 text-[#a10000]" />,
      title: "Expert Workforce",
      description: "Professional teams ready to support your goalss.",
    },
  ];

  return (
    <div className="w-full pt-16 pb-12 bg-white">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
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
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#282828] rounded-2xl shadow-2xl"></div>
              <div className="relative z-10 p-3 md:p-4 lg:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {partnershipFeatures.map((feature, index) => {
                    const [firstWord, ...restWords] = feature.title.split(" ");
                    const secondPart = restWords.join(" ");
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg md:rounded-xl shadow-xl p-3 md:p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
                      >
                        <div className="absolute bottom-0 right-0 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-[#a10000] rounded-tl-full"></div>

                        <div className="mb-2 md:mb-3 relative z-10">
                          {feature.icon}
                        </div>

                        <h3 className="text-sm md:text-xl lg:text-2xl font-poppins-black text-[#a10000] leading-tight relative z-10">
                          {firstWord}
                        </h3>
                        {secondPart && (
                          <h3 className="text-sm md:text-xl lg:text-2xl font-poppins-black text-[#a10000] mb-1 md:mb-2 relative z-10">
                            {secondPart}
                          </h3>
                        )}

                        <p className="font-rubik text-gray-600 text-[10px] md:text-sm lg:text-base leading-snug md:leading-relaxed relative z-10">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-20 md:h-20 lg:h-24"></div>
      </div>
    </div>
  );
};

export default Partners;
