import React from "react";
import { Settings, Users, Wrench, Award } from "lucide-react";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

const Partners = () => {
  const partnershipFeatures = [
    {
      icon: <Settings className="w-16 h-16 text-[#a10000]" />,
      title: "Trusted Partnership",
      description: "Building long-term client relationships worldwide.",
    },
    {
      icon: <Users className="w-16 h-16 text-[#a10000]" />,
      title: "Collaborative Teamwork",
      description: "We work closely to achieve your business goals.",
    },
    {
      icon: <Wrench className="w-16 h-16 text-[#a10000]" />,
      title: "Reliable Solutions",
      description: "Delivering innovative and effective strategies.",
    },
    {
      icon: <Award className="w-16 h-16 text-[#a10000]" />,
      title: "Recognized Excellence",
      description: "Award-winning services trusted worldwide.",
    },
  ];

  return (
    <div className="min-h-[730px] max-h-[830px] w-full pt-16 pb-12 bg-white">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {/* Main Image Container */}
        <div className="relative w-full">
          {/* Background Image */}
          <div className="w-full h-[650px] overflow-hidden shadow-2xl relative rounded-xl">
            <img
              src="images/partnership.jpg"
              alt="Professional team collaboration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Partnership Cards */}
          <div className="absolute -bottom-20 left-0 right-0 px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#282828] rounded-2xl shadow-2xl"></div>
              <div className="relative z-10 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {partnershipFeatures.map((feature, index) => {
                    const [firstWord, ...restWords] = feature.title.split(" ");
                    const secondPart = restWords.join(" ");
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
                      >
                        {/* Red Circle Accent */}
                        <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#a10000] rounded-tl-full"></div>

                        {/* Icon */}
                        <div className="mb-3 relative z-10">{feature.icon}</div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-poppins-black text-[#a10000] leading-tight relative z-10">
                          {firstWord}
                        </h3>
                        {secondPart && (
                          <h3 className="text-xl sm:text-2xl font-poppins-black text-[#a10000] mb-2 relative z-10">
                            {secondPart}
                          </h3>
                        )}

                        {/* Description */}
                        <p className="font-rubik text-gray-600 text-sm sm:text-base leading-relaxed relative z-10">
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

        {/* Spacer for overlap */}
        <div className="h-80 sm:h-72"></div>
      </div>
    </div>
  );
};

export default Partners;
