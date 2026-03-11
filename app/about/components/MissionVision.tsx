import React from "react";
import { Target, Eye } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

export default function MissionVision() {
  return (
    <div className="bg-gray-50">
      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" />
            <span
              className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
              style={{ color: COLORS.primary }}
            >
              — WHAT DRIVES US FORWARD
            </span>
          </div>
        </div>

        {/* Mission and Vision Cards */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Mission Card */}
            <div className="group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                    style={{ borderColor: COLORS.primary }}
                  >
                    <Target
                      className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]"
                      style={{ color: COLORS.primary }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                      style={{ borderColor: COLORS.primary }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2
                    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-tight`}
                  >
                    MISSION
                  </h2>
                  <p
                    className={`${FONT_CLASSES.rubikRegular} text-gray-600 text-sm sm:text-base leading-relaxed`}
                  >
                    To empower businesses through innovative outsourcing
                    solutions, cutting-edge technology, and adaptive strategies
                    that drive efficiency, growth, and long-term success.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
                    style={{ borderColor: COLORS.primary }}
                  >
                    <Eye
                      className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]"
                      style={{ color: COLORS.primary }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
                      style={{ borderColor: COLORS.primary }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2
                    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl text-gray-900 mb-4 sm:mb-6 tracking-tight`}
                  >
                    VISION
                  </h2>
                  <p
                    className={`${FONT_CLASSES.rubikRegular} text-gray-600 text-sm sm:text-base leading-relaxed`}
                  >
                    To be a global leader in business process solutions,
                    recognized for harnessing innovation, people, and technology
                    to create sustainable value, transform industries, and shape
                    the future of work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
